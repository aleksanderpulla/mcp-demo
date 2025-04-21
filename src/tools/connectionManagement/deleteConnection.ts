import { z } from "zod";
import { makeCDataSyncRequest } from "../../api.js";

export const deleteConnectionTool = {
  name: "delete-connection",
  description: "Delete an existing connection in CData Sync",
  inputSchema: z.object({
    connName: z.string().describe("The name of the connection"),
  }),
  handler: async ({ connName }: { connName: string }) => {
    const connection = await makeCDataSyncRequest(`/connections(${connName})`);
    if (!connection) {
      return { content: [{ type: "text", text: "Connection not found." }] };
    }

    await makeCDataSyncRequest(`/connections(${connName})`, {
      method: "DELETE",
    });

    return { content: [{ type: "text", text: "Connection deleted successfully." }] };
  },
};
