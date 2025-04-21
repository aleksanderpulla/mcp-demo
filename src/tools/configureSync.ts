import { z } from "zod";
import { updateSyncConfig } from "../config.js";

export const configureSyncTool = {
  name: "configure-sync",
  description: "Configure CData Sync server IP and auth token",
  inputSchema: z.object({
    ipAddress: z.string().describe("IPv4 address of CData Sync server"),
    authToken: z.string().describe("Authentication token for the Sync API"),
  }),
  handler: async ({ ipAddress, authToken }: { ipAddress: string; authToken: string }) => {
    const baseUrl = `http://${ipAddress}:8181/api.rsc`;
    updateSyncConfig({ baseUrl, authToken });
    return {
      content: [{ type: "text", text: `CData Sync API configured to ${baseUrl}` }],
    };
  },
};
