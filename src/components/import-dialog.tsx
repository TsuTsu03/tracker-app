"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileSpreadsheet,
  Loader2,
  X,
  Check,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import {
  parseImportFile,
  commitImport,
  type ImportKind,
  type ImportRow,
} from "@/app/actions/import";

/**
 * Import button + modal for bringing an advisor's existing book into the CRM.
 * Flow: pick a .xlsx/.csv/.pdf file → server parses it → review the mapped rows
 * → confirm → bulk insert. Used on both the Leads and Clients tabs.
 */
export function ImportButton({ kind }: { kind: ImportKind }) {
  const [open, setOpen] = useState(false);
  const noun = kind === "lead" ? "Leads" : "Clients";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-hairline bg-surface px-4 py-2.5 text-sm font-semibold text-navy-900 transition hover:bg-surface-2"
      >
        <Upload className="h-4 w-4" /> Import
      </button>
      {open && (
        <ImportModal kind={kind} noun={noun} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

type Stage = "pick" | "parsing" | "review" | "saving";

function ImportModal({
  kind,
  noun,
  onClose,
}: {
  kind: ImportKind;
  noun: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>("pick");
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function onFile(file: File) {
    setError(null);
    setWarning(null);
    setFileName(file.name);
    setStage("parsing");
    const fd = new FormData();
    fd.append("file", file);
    const res = await parseImportFile(fd);
    if ("error" in res) {
      setError(res.error);
      setStage("pick");
      return;
    }
    setRows(res.rows);
    setWarning(res.warning ?? null);
    setStage("review");
  }

  function removeRow(i: number) {
    setRows((r) => r.filter((_, idx) => idx !== i));
  }

  function confirm() {
    setStage("saving");
    setError(null);
    startTransition(async () => {
      const res = await commitImport(kind, rows);
      if ("error" in res) {
        setError(res.error);
        setStage("review");
        return;
      }
      router.refresh();
      onClose();
    });
  }

  const isPdf = fileName.toLowerCase().endsWith(".pdf");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-navy-950/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-hairline bg-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-navy-900">
              Import {noun}
            </h2>
            <p className="text-xs text-slate-500">
              Upload an Excel, CSV, or PDF of your existing {noun.toLowerCase()}.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {error && (
            <p className="mb-4 flex items-center gap-2 rounded-xl border border-risk-500/20 bg-risk-500/5 px-3 py-2.5 text-sm text-risk-700">
              <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
            </p>
          )}

          {/* Pick / parsing */}
          {(stage === "pick" || stage === "parsing") && (
            <>
              <input
                ref={fileRef}
                type="file"
                accept=".xlsx,.xls,.csv,.pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onFile(f);
                }}
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={stage === "parsing"}
                className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-hairline bg-surface-2 px-6 py-14 text-center transition hover:border-brand-400 hover:bg-brand-50/30 disabled:opacity-70"
              >
                {stage === "parsing" ? (
                  <>
                    <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
                    <p className="text-sm font-medium text-navy-900">
                      {isPdf
                        ? "Reading PDF with AI…"
                        : "Parsing spreadsheet…"}
                    </p>
                    <p className="text-xs text-slate-500">{fileName}</p>
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="h-8 w-8 text-brand-600" />
                    <p className="text-sm font-medium text-navy-900">
                      Click to choose a file
                    </p>
                    <p className="text-xs text-slate-500">
                      .xlsx, .xls, .csv, or .pdf · up to 10 MB
                    </p>
                  </>
                )}
              </button>
              <p className="mt-3 text-xs text-slate-400">
                Spreadsheets are mapped by column headers (Name, Phone, Email,
                Occupation…). PDFs are read by AI — review the results before
                saving.
              </p>
            </>
          )}

          {/* Review */}
          {(stage === "review" || stage === "saving") && (
            <>
              {warning && (
                <p className="mb-3 flex items-center gap-2 rounded-lg bg-gold-200/40 px-3 py-2 text-xs text-gold-700">
                  <AlertTriangle className="h-3.5 w-3.5" /> {warning}
                </p>
              )}
              <p className="mb-3 text-sm text-slate-600">
                <b className="text-navy-900">{rows.length}</b>{" "}
                {rows.length === 1 ? "row" : "rows"} ready to import from{" "}
                <b className="text-navy-900">{fileName}</b>. Remove any that look
                wrong, then confirm.
              </p>
              <div className="overflow-x-auto rounded-xl border border-hairline">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-2 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-3 py-2 font-medium">Name</th>
                      <th className="px-3 py-2 font-medium">Occupation</th>
                      <th className="px-3 py-2 font-medium">Phone</th>
                      <th className="px-3 py-2 font-medium">Email</th>
                      <th className="px-3 py-2 font-medium">
                        {kind === "lead" ? "Company" : "Location"}
                      </th>
                      <th className="px-3 py-2" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {rows.map((r, i) => (
                      <tr key={i} className="hover:bg-surface-2/50">
                        <td className="px-3 py-2 font-medium text-navy-900">
                          {r.fullName}
                        </td>
                        <td className="px-3 py-2 text-slate-600">
                          {r.occupation ?? "—"}
                        </td>
                        <td className="px-3 py-2 text-slate-600">
                          {r.phone ?? "—"}
                        </td>
                        <td className="max-w-[160px] truncate px-3 py-2 text-slate-600">
                          {r.email ?? "—"}
                        </td>
                        <td className="px-3 py-2 text-slate-600">
                          {kind === "lead"
                            ? (r.company ?? "—")
                            : (r.location ?? "—")}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <button
                            onClick={() => removeRow(i)}
                            className="rounded-md p-1 text-slate-400 hover:bg-risk-500/10 hover:text-risk-600"
                            aria-label="Remove row"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {(stage === "review" || stage === "saving") && (
          <div className="flex items-center justify-end gap-3 border-t border-hairline px-5 py-4">
            <button
              onClick={onClose}
              disabled={stage === "saving"}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:text-navy-900 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              onClick={confirm}
              disabled={stage === "saving" || rows.length === 0}
              className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60"
            >
              {stage === "saving" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Import {rows.length} {rows.length === 1 ? noun.slice(0, -1) : noun}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
