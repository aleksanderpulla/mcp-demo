import { z } from "zod";
import { makeCDataSyncRequest } from "../../api.js";

export const modifyUserTool = {
  name: "modify-user",
  description: "Modify a user in CData Sync",
  inputSchema: z.object({
    user: z.string().describe("The name of the existing user to update"),
    newPassword: z.string().describe("The password of the existing user to update"),    
    newRole: z.enum(["cdata_admin", "cdata_standard", ]).default("cdata_admin").describe("The role of the existing user to update (cdata_admin, cdata_standard)"),
  }),
  handler: async ({user, newPassword, newRole }: { user: string, newPassword: string, newRole: string }) => {
    const users = await makeCDataSyncRequest(`/users`);
    //@ts-ignore
    if (!users.value.find((u: any) => u.User === user)) {
        return { content: [{ type: "text", text: "User not found." }] };
    }

    const payload = {
        User: user,
        Active: true,
        Password: newPassword,
        Roles: newRole
      };

    await makeCDataSyncRequest(`/users(${user})`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    return { content: [{ type: "text", text: "User updated successfully." }] };
  },
};
