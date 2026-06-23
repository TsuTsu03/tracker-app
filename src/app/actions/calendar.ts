"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { EventCategory } from "@/lib/types";

export interface EventInput {
  title: string;
  description?: string;
  location?: string;
  startsAt: string; // ISO
  endsAt: string; // ISO
  allDay?: boolean;
  category?: EventCategory;
}

type Result = { ok: true; id?: string } | { error: string };

function validate(input: EventInput): string | null {
  if (!input.title.trim()) return "Give the event a title.";
  if (!input.startsAt || !input.endsAt) return "Pick a start and end time.";
  if (new Date(input.endsAt).getTime() < new Date(input.startsAt).getTime())
    return "The event can't end before it starts.";
  return null;
}

/** Create a calendar event for the signed-in advisor. */
export async function createEvent(input: EventInput): Promise<Result> {
  const invalid = validate(input);
  if (invalid) return { error: invalid };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { data, error } = await supabase
    .from("events")
    .insert({
      advisor_id: user.id,
      title: input.title.trim(),
      description: input.description?.trim() ?? "",
      location: input.location?.trim() ?? "",
      starts_at: input.startsAt,
      ends_at: input.endsAt,
      all_day: input.allDay ?? false,
      category: input.category ?? "Personal",
    })
    .select("id")
    .single();
  if (error) return { error: error.message };

  revalidatePath("/calendar");
  revalidatePath("/dashboard");
  return { ok: true, id: data?.id };
}

/** Update an existing event the advisor owns. */
export async function updateEvent(
  id: string,
  input: EventInput,
): Promise<Result> {
  const invalid = validate(input);
  if (invalid) return { error: invalid };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("events")
    .update({
      title: input.title.trim(),
      description: input.description?.trim() ?? "",
      location: input.location?.trim() ?? "",
      starts_at: input.startsAt,
      ends_at: input.endsAt,
      all_day: input.allDay ?? false,
      category: input.category ?? "Personal",
    })
    .eq("id", id)
    .eq("advisor_id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/calendar");
  revalidatePath("/dashboard");
  return { ok: true };
}

/** Delete an event the advisor owns. */
export async function deleteEvent(id: string): Promise<Result> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", id)
    .eq("advisor_id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/calendar");
  revalidatePath("/dashboard");
  return { ok: true };
}
