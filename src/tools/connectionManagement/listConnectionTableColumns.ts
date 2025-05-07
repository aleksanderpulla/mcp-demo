import { z } from "zod";
import { makeCDataSyncRequest } from "../../api.js";

export const listConnectionTableColumnsTool = {
  name: "list-table-columns",
  description: "List all columns for a specific table within a particular connection in CData Sync",
  inputSchema: z.object({
    connName: z.string().describe("The name of the connection"),
    table: z.string().describe("The name of the table"),
  }),
  handler: async ({ connName, table}: { connName: string; table: string; }) => {
    const payload = JSON.stringify({
      ConnectionName: connName,
      Table: table,
    });

    const result = await makeCDataSyncRequest(`/getConnectionTableColumns`, {
      method: "POST",
      body: payload,
    });

    return {
      content: [
        {
          type: "text",
          text: result ? "Columns retrieved successfully." : "Failed to retrieve columns.",
        },
      ],
    };
  },
};
