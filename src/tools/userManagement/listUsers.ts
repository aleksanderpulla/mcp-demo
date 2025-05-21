import { makeCDataSyncRequest } from "../../api.js";

export const listUsersTool = {
  name: "list-users",
  description: "List all Users in CData Sync",
  handler: async () => {
    const users = await makeCDataSyncRequest(`/users`);
    return {
      content: [
        {
          type: "text",
          text: users
            ? `Jobs: ${JSON.stringify(users)}`
            : "There are no users in your CData Sync instance.",
        },
      ],
    };
  },
};
