import { z } from "zod";
import { updateSyncConfig } from "../config.js";

export const configureSyncTool = {
  name: "configure-sync",
  description: "Configure CData Sync server IP and auth token",
  inputSchema: z.object({
    protocol: z.enum(["http", "https"]).default("http").describe("Protocol to use for the Sync API"),
    ipAddress: z.string().describe("IPv4 address of CData Sync server"),
    port: z.number().default(8181).describe("Port number for the Sync API"),
    authToken: z.string().describe("Authentication token for the Sync API"),
  }),
  handler: async ({ protocol, ipAddress, port, authToken }: { protocol: string; ipAddress: string; port: number; authToken: string }) => {
    const baseUrl = `${protocol}://${ipAddress}:${port}/api.rsc`;
    updateSyncConfig({ baseUrl, authToken });
    return {
      content: [{ type: "text", text: `CData Sync API configured to ${baseUrl}` }],
    };
  },
};
