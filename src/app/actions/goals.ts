"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface GoalInput {
  title: string;
  targetApe: number;
  currentApe: number;
  deadline: string; // YYYY-MM-DD
  note?: string;
}

type Result = { ok: true; id?: string } | { error: string };

function validate(input: GoalInput): string | null {
  if (!input.title.trim()) return "Give the goal a name.";
  if (!input.deadline) return "Pick a deadline.";
  if (!(input.targetApe > 0)) return "Target APE must be greater than zero.";
  if (input.currentApe < 0) return "Current APE can't be negative.";
  return null;
}

/** Create a production goal for the signed-in advisor. */
export async function createGoal(input: GoalInput): Promise<Result> {
  const invalid = validate(input);
  if (invalid) return { error: invalid };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { data, error } = await supabase
    .from("goals")
    .insert({
      advisor_id: user.id,
      title: input.title.trim(),
      target_ape: input.targetApe,
      current_ape: input.currentApe,
      deadline: input.deadline,
      note: input.note?.trim() ?? "",
    })
    .select("id")
    .single();
  if (error) return { error: error.message };

  revalidatePath("/goals");
  revalidatePath("/dashboard");
  return { ok: true, id: data?.id };
}

/** Update a goal the advisor owns (also used by the inline current-APE editor). */
export async function updateGoal(id: string, input: GoalInput): Promise<Result> {
  const invalid = validate(input);
  if (invalid) return { error: invalid };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("goals")
    .update({
      title: input.title.trim(),
      target_ape: input.targetApe,
      current_ape: input.currentApe,
      deadline: input.deadline,
      note: input.note?.trim() ?? "",
    })
    .eq("id", id)
    .eq("advisor_id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/goals");
  revalidatePath("/dashboard");
  return { ok: true };
}

/**
 * Update ONLY the current credited APE — the quick inline edit on a goal card.
 * Separate from updateGoal so the advisor can log double/triple-credit closings
 * without re-opening the whole form.
 */
export async function updateGoalProgress(
  id: string,
  currentApe: number,
): Promise<Result> {
  if (!(currentApe >= 0)) return { error: "Current APE can't be negative." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("goals")
    .update({ current_ape: currentApe })
    .eq("id", id)
    .eq("advisor_id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/goals");
  revalidatePath("/dashboard");
  return { ok: true };
}

/** Delete a goal the advisor owns. */
export async function deleteGoal(id: string): Promise<Result> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("goals")
    .delete()
    .eq("id", id)
    .eq("advisor_id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/goals");
  revalidatePath("/dashboard");
  return { ok: true };
}
