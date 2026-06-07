import { getLeads, getTasks } from "@/lib/data";
import { FollowUpsClient } from "./follow-ups-client";

export default async function FollowUpsPage() {
  const [leads, tasks] = await Promise.all([getLeads(), getTasks()]);
  return <FollowUpsClient leads={leads} tasks={tasks} />;
}
