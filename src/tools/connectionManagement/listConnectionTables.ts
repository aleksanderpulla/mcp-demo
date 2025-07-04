import { z } from "zod";
import { makeCDataSyncRequest } from "../../api.js";

export const listConnectionTablesTool = {
  name: "list-connection-tables",
  description: "List all connection tables for a specific connection in CData Sync",
  inputSchema: z.object({
    connName: z.string().describe("The name of the connection"),
  }),
  handler: async ({ connName}: { connName: string; }) => {
    const payload = JSON.stringify({
      ConnectionName: connName,
      TableOrView: 'ALL',
      IncludeSchema: 'True',
    });

    const result = await makeCDataSyncRequest(`/getConnectionTables`, {
      method: "POST",
      body: payload,
    });

    return {
      content: [
        {
          type: "text",
          //@ts-ignore
          text: result ? `Tables retrieved successfully. Below is the list of tables for ${connName}: ${JSON.stringify(result.value)}` : "Failed to retrieve tables.",
        },
      ],
    };
  },
};
