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
          //@ts-ignore
          text: result ? `Columns retrieved successfully. Below is the list of columns for the ${table} table: ${JSON.stringify(result.value)}` : "Failed to retrieve columns.",
        },
      ],
    };
  },
};
