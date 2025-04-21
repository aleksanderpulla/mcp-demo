// src/tools/connection/create.ts
import { z } from "zod";
import { makeCDataSyncRequest } from "../../api.js";

export const createConnectionTool = {
  name: "create-connection",
  description: "Create a connection to a data source in CData Sync",
  inputSchema: z.object({
    connName: z.string().describe("The name of the connection"),
    providerName: z.string().describe("The provider name for the data source"),
    connectionString: z.string().describe("The connection string for the data source"),
  }),
  handler: async ({ connName, providerName, connectionString }: { connName: string; providerName: string; connectionString: string }) => {
    const payload = {
      Name: connName,
      ProviderName: providerName,
      ConnectionString: connectionString,
    };

    const existing = await makeCDataSyncRequest(`/connections(${connName})`);
    if (existing) {
      return { content: [{ type: "text", text: "Connection already exists." }] };
    }

    const result = await makeCDataSyncRequest(`/connections`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return {
      content: [
        {
          type: "text",
          text: result ? "Connection created successfully." : "Failed to create connection.",
        },
      ],
    };
  },
};
