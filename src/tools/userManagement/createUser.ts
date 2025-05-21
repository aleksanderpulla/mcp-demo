import { z } from "zod";
import { makeCDataSyncRequest } from "../../api.js";

export const createUserTool = {
  name: "create-user",
  description: "Create a user in CData Sync",
  inputSchema: z.object({
    user: z.string().describe("The name of the user to create"),
    password: z.string().describe("The password of the user to create"),
    roles: z.enum(["cdata_admin", "cdata_standard", ]).default("cdata_admin").describe("The role of the user to create (cdata_admin, cdata_standard)"),
  }),
  handler: async ({ user, password, roles }: { user: string, password: string, roles: string[] }) => {

    const payload = {
        User: user,
        Active: true,
        Password: password,
        Roles: roles
      };

    await makeCDataSyncRequest(`/users`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return { content: [{ type: "text", text: "User created successfully." }] };
  },
};
