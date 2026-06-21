"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { PipelineStage } from "@/lib/types";

/** Move a lead to a new pipeline stage (drag & drop). */
export async function updateLeadStage(id: string, stage: PipelineStage) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };
  const { error } = await supabase
    .from("leads")
    .update({ stage, last_contact: new Date().toISOString() })
    .eq("id", id)
    .eq("advisor_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/pipeline");
  revalidatePath("/dashboard");
  return { ok: true };
}

/** Toggle a task's done state. */
export async function toggleTask(id: string, done: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };
  const { error } = await supabase
    .from("tasks")
    .update({ done })
    .eq("id", id)
    .eq("advisor_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/follow-ups");
  revalidatePath("/dashboard");
  return { ok: true };
}

/** Update a service ticket's status. */
export async function updateTicketStatus(
  id: string,
  status: "Open" | "In Progress" | "Resolved",
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };
  const { error } = await supabase
    .from("tickets")
    .update({ status })
    .eq("id", id)
    .eq("advisor_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/servicing");
  return { ok: true };
}

export interface NewLeadInput {
  fullName: string;
  occupation: string;
  phone?: string;
  email?: string;
  location?: string;
  company?: string;
  monthlyIncome?: number;
  potentialPremium?: number;
  temperature?: "Hot" | "Warm" | "Cold";
  source?: string;
}

/** Create a new lead for the signed-in advisor. */
export async function createLead(input: NewLeadInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase.from("leads").insert({
    advisor_id: user.id,
    full_name: input.fullName,
    occupation: input.occupation,
    phone: input.phone ?? "",
    email: input.email ?? "",
    location: input.location ?? "",
    company: input.company ?? null,
    monthly_income: input.monthlyIncome ?? null,
    potential_premium: input.potentialPremium ?? 0,
    temperature: input.temperature ?? "Warm",
    stage: "New Lead",
    source: input.source ?? "Manual",
    ai_score: 50,
    score_reasons: [],
    avatar_seed: input.fullName,
  });
  if (error) return { error: error.message };
  revalidatePath("/leads");
  revalidatePath("/pipeline");
  revalidatePath("/dashboard");
  return { ok: true };
}
