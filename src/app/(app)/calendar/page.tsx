import { getEvents, getTasks } from "@/lib/data";
import { CalendarClient } from "./calendar-client";

export default async function CalendarPage() {
  // Personal events (editable) + CRM tasks (read-only overlay), merged client-side.
  const [events, tasks] = await Promise.all([getEvents(), getTasks()]);
  return <CalendarClient events={events} tasks={tasks} />;
}
