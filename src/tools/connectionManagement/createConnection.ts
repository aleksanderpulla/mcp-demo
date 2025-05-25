import { z } from "zod";
import { makeCDataSyncRequest } from "../../api.js";

export const createConnectionTool = {
  name: "create-connection",
  description: "Create a connection to a data source in CData Sync",
  inputSchema: z.object({
    Name: z.string().describe("The name of the connection"),
    ProviderName: z.string().describe("The provider name for the data source"),
    ConnectionString: z.string().describe("The connection string for the data source"),
  }),
  handler: async ({ Name, ProviderName, ConnectionString }: { Name: string; ProviderName: string; ConnectionString: string }) => {
    const payload = {
      Name: Name,
      ProviderName: ProviderName,
      ConnectionString: ConnectionString,
    };
    
    try {
      const existing = await makeCDataSyncRequest(`/connections(${Name})`, {method: "GET",});
      if (existing) {
        return { content: [{ type: "text", text: `The connection name [${Name}] already exists. Please choose a different name.` }] };
      }
    } 
    catch (error) {
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
    }
  },
};
