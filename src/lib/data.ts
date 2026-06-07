import { createClient } from "./supabase/server";
import type {
  Advisor,
  Claim,
  Client,
  Lead,
  PipelineStage,
  ServiceTicket,
  Task,
  Temperature,
} from "./types";

export interface Profile {
  id: string;
  name: string;
  role: string;
  unit: string;
  branch: string;
  avatarSeed: string;
}

const iso = (v: string | null) => v ?? new Date().toISOString();

/* ── Row mappers (snake_case DB → camelCase domain types) ─────────────────── */

/* eslint-disable @typescript-eslint/no-explicit-any */
function toLead(r: any): Lead {
  return {
    id: r.id,
    fullName: r.full_name,
    nickname: r.nickname ?? undefined,
    birthday: r.birthday ?? undefined,
    age: r.age ?? undefined,
    gender: r.gender ?? undefined,
    phone: r.phone ?? "",
    email: r.email ?? "",
    occupation: r.occupation ?? "",
    company: r.company ?? undefined,
    industry: r.industry ?? undefined,
    civilStatus: r.civil_status ?? undefined,
    dependents: r.dependents ?? undefined,
    monthlyIncome: r.monthly_income ?? undefined,
    netWorth: r.net_worth ?? undefined,
    location: r.location ?? "",
    socials: r.socials ?? [],
    stage: r.stage as PipelineStage,
    temperature: r.temperature as Temperature,
    aiScore: r.ai_score ?? 0,
    scoreReasons: r.score_reasons ?? [],
    potentialPremium: Number(r.potential_premium ?? 0),
    lastContact: iso(r.last_contact),
    createdAt: iso(r.created_at),
    source: r.source ?? "",
    avatarSeed: r.avatar_seed ?? undefined,
  };
}

function toClient(r: any): Client {
  return {
    id: r.id,
    fullName: r.full_name,
    nickname: r.nickname ?? undefined,
    age: r.age ?? 0,
    phone: r.phone ?? "",
    email: r.email ?? "",
    occupation: r.occupation ?? "",
    location: r.location ?? "",
    civilStatus: r.civil_status ?? "",
    dependents: r.dependents ?? 0,
    relationshipScore: r.relationship_score ?? 0,
    lastContact: iso(r.last_contact),
    clientSince: iso(r.client_since),
    policies: r.policies ?? [],
    beneficiaries: r.beneficiaries ?? [],
    goals: r.goals ?? [],
    notes: r.notes ?? "",
    timeline: r.timeline ?? [],
  };
}

function toTask(r: any): Task {
  return {
    id: r.id,
    title: r.title,
    due: iso(r.due),
    type: r.type,
    relatedTo: r.related_to ?? "",
    priority: r.priority,
    done: !!r.done,
  };
}

function toTicket(r: any): ServiceTicket {
  return {
    id: r.id,
    client: r.client,
    request: r.request,
    status: r.status,
    priority: r.priority,
    created: iso(r.created),
  };
}

function toClaim(r: any): Claim {
  return {
    id: r.id,
    client: r.client,
    policy: r.policy,
    type: r.type,
    amount: Number(r.amount ?? 0),
    status: r.status,
    filed: iso(r.filed),
  };
}

function toAdvisor(r: any): Advisor {
  return {
    id: r.id,
    name: r.name,
    role: r.role,
    unit: r.unit,
    appointments: r.appointments ?? 0,
    applications: r.applications ?? 0,
    production: Number(r.production ?? 0),
    persistency: r.persistency ?? 0,
    conversion: r.conversion ?? 0,
    avatarSeed: r.avatar_seed ?? r.name,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/* ── Queries (RLS scopes every result to the signed-in advisor) ───────────── */

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!data) {
    // Fallback if the profile row hasn't propagated yet.
    return {
      id: user.id,
      name: user.email?.split("@")[0] ?? "Advisor",
      role: "Financial Advisor",
      unit: "Apex Wealth Unit",
      branch: "Makati Branch",
      avatarSeed: user.email?.split("@")[0] ?? "Advisor",
    };
  }

  return {
    id: data.id,
    name: data.name,
    role: data.role,
    unit: data.unit,
    branch: data.branch,
    avatarSeed: data.avatar_seed,
  };
}

export async function getLeads(): Promise<Lead[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("leads")
    .select("*")
    .order("ai_score", { ascending: false });
  return (data ?? []).map(toLead);
}

export async function getClients(): Promise<Client[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("clients")
    .select("*")
    .order("relationship_score", { ascending: false });
  return (data ?? []).map(toClient);
}

export async function getClient(id: string): Promise<Client | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data ? toClient(data) : null;
}

export async function getTasks(): Promise<Task[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tasks")
    .select("*")
    .order("due", { ascending: true });
  return (data ?? []).map(toTask);
}

export async function getTickets(): Promise<ServiceTicket[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tickets")
    .select("*")
    .order("created", { ascending: false });
  return (data ?? []).map(toTicket);
}

export async function getClaims(): Promise<Claim[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("claims")
    .select("*")
    .order("filed", { ascending: false });
  return (data ?? []).map(toClaim);
}

export async function getTeam(): Promise<Advisor[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("team_members")
    .select("*")
    .order("production", { ascending: false });
  return (data ?? []).map(toAdvisor);
}

export async function getProductionTrend(): Promise<
  { month: string; production: number; target: number }[]
> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("production_trend")
    .select("*")
    .order("ord", { ascending: true });
  return (data ?? []).map((r) => ({
    month: r.month,
    production: Number(r.production ?? 0),
    target: Number(r.target ?? 0),
  }));
}

/** Conversion funnel computed live from the advisor's own leads. */
export async function getFunnel(): Promise<{ stage: string; value: number }[]> {
  const leads = await getLeads();
  const reached = (stages: PipelineStage[]) =>
    leads.filter((l) => stages.includes(l.stage)).length;

  const contacted: PipelineStage[] = [
    "Contacted",
    "Responded",
    "Appointment Scheduled",
    "Discovery Meeting",
    "Proposal Presented",
    "Under Consideration",
    "Follow-Up",
    "Closed Won",
  ];
  const appointments: PipelineStage[] = [
    "Appointment Scheduled",
    "Discovery Meeting",
    "Proposal Presented",
    "Under Consideration",
    "Follow-Up",
    "Closed Won",
  ];
  const proposals: PipelineStage[] = [
    "Proposal Presented",
    "Under Consideration",
    "Follow-Up",
    "Closed Won",
  ];

  return [
    { stage: "Leads", value: leads.length },
    { stage: "Contacted", value: reached(contacted) },
    { stage: "Appointments", value: reached(appointments) },
    { stage: "Proposals", value: reached(proposals) },
    { stage: "Closed Won", value: reached(["Closed Won"]) },
  ];
}
