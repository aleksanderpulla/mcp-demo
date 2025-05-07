import { makeCDataSyncRequest } from "../../api.js";

export const listJobsTool = {
  name: "list-jobs",
  description: "List all Jobs in CData Sync",
  handler: async () => {
    const jobs = await makeCDataSyncRequest(`/jobs`);
    return {
      content: [
        {
          type: "text",
          text: jobs
            ? `Jobs: ${JSON.stringify(jobs)}`
            : "There are no Jobs in your CData Sync instance.",
        },
      ],
    };
  },
};
