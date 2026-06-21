"use server";

/**
 * Client/lead import — parse an uploaded spreadsheet or PDF into reviewable
 * rows, then (after the advisor confirms) bulk-insert them.
 *
 *  - .xlsx / .xls / .csv → parsed deterministically with SheetJS and mapped by
 *    column-header heuristics.
 *  - .pdf → text extracted with pdf-parse, then structured by Groq (Llama 3.3),
 *    since a PDF client list has no reliable column structure.
 *
 * Both paths run server-side only (these libraries are Node-only) and require an
 * authenticated advisor. Inserts are always scoped to that advisor.
 */

import * as XLSX from "xlsx";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/ai-guard";
import { promptJSON } from "@/lib/groq";

export type ImportKind = "lead" | "client";

/** Normalised row shape — a superset of the lead and client fields we import. */
export type ImportRow = {
  fullName: string;
  occupation?: string;
  phone?: string;
  email?: string;
  location?: string;
  company?: string; // employer (leads)
  monthlyIncome?: number; // leads
  age?: number; // clients
  civilStatus?: string; // clients
  dependents?: number; // clients
};

export type ParseResult =
  | { rows: ImportRow[]; warning?: string }
  | { error: string };

const MAX_ROWS = 500;

/* ── Column-header heuristics (spreadsheets) ──────────────────────────────── */

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

const FIELD_SYNONYMS: Record<keyof ImportRow, string[]> = {
  fullName: ["fullname", "name", "client", "clientname", "leadname", "contactname"],
  occupation: ["occupation", "job", "jobtitle", "profession", "position", "work", "role"],
  phone: ["phone", "mobile", "mobileno", "contact", "contactnumber", "cellphone", "number", "tel"],
  email: ["email", "emailaddress", "mail", "eaddress"],
  location: ["location", "address", "city", "area", "province", "region"],
  company: ["company", "employer", "business", "organization", "organisation", "firm"],
  monthlyIncome: ["monthlyincome", "income", "salary", "monthlysalary", "grossincome"],
  age: ["age"],
  civilStatus: ["civilstatus", "maritalstatus", "status", "civil"],
  dependents: ["dependents", "dependent", "children", "kids", "nodependents"],
};

function buildHeaderMap(headers: string[]): Partial<Record<keyof ImportRow, string>> {
  const map: Partial<Record<keyof ImportRow, string>> = {};
  const normalized = headers.map((h) => ({ raw: h, n: norm(h) }));
  for (const field of Object.keys(FIELD_SYNONYMS) as (keyof ImportRow)[]) {
    const syns = FIELD_SYNONYMS[field];
    const hit = normalized.find((h) => syns.includes(h.n));
    if (hit) map[field] = hit.raw;
  }
  return map;
}

const toNum = (v: unknown): number | undefined => {
  if (v === null || v === undefined || v === "") return undefined;
  const n = Number(String(v).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : undefined;
};

const toStr = (v: unknown): string | undefined => {
  const s = String(v ?? "").trim();
  return s === "" ? undefined : s;
};

function rowsFromSheet(records: Record<string, unknown>[]): ImportRow[] {
  if (records.length === 0) return [];
  const headers = Object.keys(records[0]);
  const hmap = buildHeaderMap(headers);
  // Fall back to the first column for the name if no recognisable header.
  const nameKey = hmap.fullName ?? headers[0];

  const rows: ImportRow[] = [];
  for (const rec of records) {
    const fullName = toStr(rec[nameKey]);
    if (!fullName) continue; // skip blank / total rows
    rows.push({
      fullName,
      occupation: hmap.occupation ? toStr(rec[hmap.occupation]) : undefined,
      phone: hmap.phone ? toStr(rec[hmap.phone]) : undefined,
      email: hmap.email ? toStr(rec[hmap.email]) : undefined,
      location: hmap.location ? toStr(rec[hmap.location]) : undefined,
      company: hmap.company ? toStr(rec[hmap.company]) : undefined,
      monthlyIncome: hmap.monthlyIncome ? toNum(rec[hmap.monthlyIncome]) : undefined,
      age: hmap.age ? toNum(rec[hmap.age]) : undefined,
      civilStatus: hmap.civilStatus ? toStr(rec[hmap.civilStatus]) : undefined,
      dependents: hmap.dependents ? toNum(rec[hmap.dependents]) : undefined,
    });
  }
  return rows;
}

/* ── PDF → text → AI-structured rows ──────────────────────────────────────── */

async function rowsFromPdf(buf: Buffer): Promise<ImportRow[]> {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: new Uint8Array(buf) });
  const { text } = await parser.getText();
  const clean = (text ?? "").trim().slice(0, 16000);
  if (!clean) return [];

  const data = await promptJSON<{ rows: ImportRow[] }>(
    `Extract the people listed in this document into structured rows. The text
comes from a financial advisor's existing list of clients/prospects.

Return ONLY the people actually present in the text — do not invent anyone. Use
exactly these keys per row (omit a key if the value isn't in the text):
"fullName" (required), "occupation", "phone", "email", "location",
"company" (their employer), "monthlyIncome" (number), "age" (number),
"civilStatus", "dependents" (number).

DOCUMENT TEXT:
"""
${clean}
"""

Return JSON: { "rows": [ ... ] }`,
  );
  return Array.isArray(data?.rows) ? data.rows : [];
}

/* ── Public actions ───────────────────────────────────────────────────────── */

export async function parseImportFile(formData: FormData): Promise<ParseResult> {
  await requireUser();

  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "No file was uploaded." };
  if (file.size > 10 * 1024 * 1024)
    return { error: "File is too large (max 10 MB)." };

  const name = file.name.toLowerCase();
  const buf = Buffer.from(await file.arrayBuffer());

  try {
    let rows: ImportRow[];
    if (name.endsWith(".pdf")) {
      rows = await rowsFromPdf(buf);
    } else if (/\.(xlsx|xls|csv)$/.test(name)) {
      const wb = XLSX.read(buf, { type: "buffer" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const records = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
        defval: "",
      });
      rows = rowsFromSheet(records);
    } else {
      return { error: "Unsupported file type. Upload a .xlsx, .csv, or .pdf file." };
    }

    if (rows.length === 0)
      return { error: "No rows with a name were found in the file." };

    let warning: string | undefined;
    if (rows.length > MAX_ROWS) {
      rows = rows.slice(0, MAX_ROWS);
      warning = `Only the first ${MAX_ROWS} rows were imported.`;
    }
    return { rows, warning };
  } catch (e) {
    return {
      error: `Could not read the file: ${e instanceof Error ? e.message : "unknown error"}`,
    };
  }
}

export async function commitImport(
  kind: ImportKind,
  rows: ImportRow[],
): Promise<{ inserted: number } | { error: string }> {
  const user = await requireUser();
  if (!Array.isArray(rows) || rows.length === 0)
    return { error: "Nothing to import." };

  const clean = rows
    .filter((r) => r.fullName && r.fullName.trim())
    .slice(0, MAX_ROWS);

  const supabase = await createClient();

  if (kind === "lead") {
    const payload = clean.map((r) => ({
      advisor_id: user.id,
      full_name: r.fullName.trim(),
      occupation: r.occupation ?? "",
      phone: r.phone ?? "",
      email: r.email ?? "",
      location: r.location ?? "",
      company: r.company ?? null,
      monthly_income: r.monthlyIncome ?? null,
      temperature: "Warm",
      stage: "New Lead",
      source: "Import",
      ai_score: 50,
      score_reasons: [],
      avatar_seed: r.fullName.trim(),
    }));
    const { error, count } = await supabase
      .from("leads")
      .insert(payload, { count: "exact" });
    if (error) return { error: error.message };
    revalidatePath("/leads");
    revalidatePath("/pipeline");
    revalidatePath("/dashboard");
    return { inserted: count ?? payload.length };
  }

  const payload = clean.map((r) => ({
    advisor_id: user.id,
    full_name: r.fullName.trim(),
    occupation: r.occupation ?? "",
    phone: r.phone ?? "",
    email: r.email ?? "",
    location: r.location ?? "",
    age: r.age ?? 0,
    civil_status: r.civilStatus ?? "",
    dependents: r.dependents ?? 0,
    relationship_score: 70,
  }));
  const { error, count } = await supabase
    .from("clients")
    .insert(payload, { count: "exact" });
  if (error) return { error: error.message };
  revalidatePath("/clients");
  revalidatePath("/dashboard");
  return { inserted: count ?? payload.length };
}
