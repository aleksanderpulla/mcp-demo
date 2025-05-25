import { z } from "zod";
import { makeCDataSyncRequest } from "../../api.js";
import { writeLog } from "../../utils/logger.js";

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

    // const existing = await makeCDataSyncRequest(`/connections(${Name})`);
    // if (existing) {
    //   return { content: [{ type: "text", text: "Connection already exists." }] };
    // }
    
    const result = await makeCDataSyncRequest(`/connections`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    writeLog("create-connection.log", result)

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
