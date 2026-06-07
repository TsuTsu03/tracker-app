import { getLeads } from "@/lib/data";
import { PipelineClient } from "./pipeline-client";

export default async function PipelinePage() {
  const leads = await getLeads();
  return <PipelineClient leads={leads} />;
}
