import { getLeads } from "@/lib/data";
import { MeetingsClient } from "./meetings-client";

export default async function MeetingsPage() {
  const leads = await getLeads();
  return <MeetingsClient leads={leads} />;
}
