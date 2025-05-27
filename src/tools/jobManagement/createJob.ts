import { z } from "zod";
import { makeCDataSyncRequest } from "../../api.js";

interface SyncJobPayload {
  JobName:       string;
  Source:        string;
  Destination:   string;
  [key: string]: string;
}

export const createJobTool = {
  name: "create-job",
  description: `
    1) Ask the user: “What would you like to name this job?”
    2) Invoke the “list-connections” tool to fetch all available connections.
    3) Render the returned array as a markdown table (columns: id, name, type, etc.).
    4) Ask the user: “Which connection should be the SOURCE? (pick one from the table)”
    5) Ask the user: “Which connection should be the DESTINATION? (pick one from the table)”
    6) Ask the user: “How many tables (queries) do you want to replicate?”
    7) For each 1…N, ask: “Please enter SQL query:”  
    8) When you have jobName, source, destination, and the list of queries, call "create-job" tool to create a job in CData Sync.
  `,
  inputSchema: z.object({
    jobName: z.string().describe("The name of the job"),
    source: z.string().describe("The name of the source connection"),
    destination: z.string().describe("The name of the destination connection"),
    queries: z.array(z.string()).min(1).describe("A list of SQL queries to replicate"),
  }),
  handler: async ({ jobName, source, destination, queries }: { jobName: string, source: string, destination: string, queries: string[] }) => {
    
    const payload: SyncJobPayload = {
      JobName:     jobName,
      Source:      source,
      Destination: destination,
    };

    queries.forEach((sql, idx) => {
      payload[`Query#${idx+1}`] = sql; 
    });

    const result = await makeCDataSyncRequest(`/jobs`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return {
      content: [
        {
          type: "text",
          text: result ? "Job created successfully. Details of the created job:\n" + JSON.stringify(result) + "\n" : "Failed to create job.",
        },
      ],
    };
  },
};
