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
        WaitForResults: true,
        Timeout: 30
      };
    const jobs: any = await makeCDataSyncRequest(`/executeJob`, {
        method: "POST",
        body: JSON.stringify(payload),
    });

    return {
      content: [
        {
          type: "text",
          text: jobs ? `Job "${jobName}" executed successfully. Details:\n` + JSON.stringify(jobs.value) + "\n" : "Failed to execute job.",
        },
      ],
    };


  },
};
