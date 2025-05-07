import { z } from "zod";
import { makeCDataSyncRequest } from "../../api.js";

export const deleteJobTool = {
  name: "delete-job",
  description: "Delete an existing job in CData Sync",
  inputSchema: z.object({
    jobName: z.string().describe("The name of the job to delete"),
  }),
  handler: async ({ jobName }: { jobName: string }) => {
    const job = await makeCDataSyncRequest(`/jobs(${jobName})`);
    if (!job) {
      return { content: [{ type: "text", text: "Job not found." }] };
    }

    await makeCDataSyncRequest(`/jobs(${jobName})`, {
      method: "DELETE",
    });

    return { content: [{ type: "text", text: "Job deleted successfully." }] };
  },
};
