import { z } from "zod";
import { makeCDataSyncRequest } from "../../api.js";

export const listJobTasksTool = {
  name: "list-job-tasks",
  description: "List all Job Tasks in CData Sync",
  inputSchema: z.object({
    jobName: z.string().describe("The name of the job"),
  }),
  handler: async ({ jobName }: { jobName: string }) => {
    const response: any = await makeCDataSyncRequest(`/tasks(${jobName})`);

    const tasks = response?.value;

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `There are no tasks for ${jobName} job.`,
          },
        ],
      };
    }

    const tableQueries = tasks.map((task: any) => `- ${task.Table}: ${task.Query}`).join("\n");

    return {
      content: [
        {
          type: "text",
          text: `List of tables/views and their associated queries for the "${jobName}" job:\n${tableQueries}`,
        },
      ],
    };
  },
};
