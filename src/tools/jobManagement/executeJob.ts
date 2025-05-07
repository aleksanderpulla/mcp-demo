import { z } from "zod";
import { makeCDataSyncRequest } from "../../api.js";

export const executeJobTool = {
  name: "execute-job",
  description: "Execute a specific Job in CData Sync",
  inputSchema: z.object({
      jobName: z.string().describe("The name of the existing job"),
    }),
  handler: async ({ jobName }: { jobName: string }) => {
    const payload = {
        JobName: jobName,
        WaitForResults: false
      };
    const jobs = await makeCDataSyncRequest(`/executeJob`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
  },
};
