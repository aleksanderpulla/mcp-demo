import { makeCDataSyncRequest } from "../../api.js";

export const listConnectionsTool = {
  name: "list-connections",
  description: "List all connections in CData Sync",
  handler: async () => {
    const connections = await makeCDataSyncRequest(`/connections`);
    return {
      content: [
        {
          type: "text",
          text: connections
            ? `Connections: ${JSON.stringify(connections)}`
            : "There are no connections in your CData Sync instance.",
        },
      ],
    };
  },
};
