import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { makeCDataSyncRequest } from "./api.js";
import { updateSyncConfig } from "./config.js";

const server = new McpServer({
  name: "cdata_sync",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Configure tool
server.tool(
  "configure-sync",
  "Configure CData Sync server IP and auth token",
{
    ipAddress: z.string().describe("IPv4 address of the CData Sync server"),
    authToken: z.string().describe("Authentication token for the Sync API"),
  },
  async ({ ipAddress, authToken }) => {
    const baseUrl = `http://${ipAddress}:8181/api.rsc`;
    updateSyncConfig({ baseUrl, authToken });
    return {
      content: [{ type: "text", text: `CData Sync API configured to ${baseUrl}` }],
    };
  }
);

// Create connection tool
server.tool(
  "create-connection",
  "Create a connection to a data source in CData Sync",
  {
    connName: z.string().describe("The name of the connection"),
    providerName: z.string().describe("The provider name for the data source"),
    connectionString: z.string().describe("The connection string for the data source"),
  },
  async ({ connName, providerName, connectionString }) => {
    const payload = {
      Name: connName,
      ProviderName: providerName,
      ConnectionString: connectionString,
    };

    const existing = await makeCDataSyncRequest(`/connections(${connName})`);
    if (existing) {
      return { content: [{ type: "text", text: "Connection already exists." }] };
    }

    const result = await makeCDataSyncRequest(`/connections`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return {
      content: [
        {
          type: "text",
          text: result ? "Connection created successfully." : "Failed to create connection.",
        },
      ],
    };
  }
);

// List connections tool
server.tool(
  "list-connections",
  "List all connections in CData Sync",
  async () => {
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
  }
);

// Delete connection tool
server.tool(
  "delete-connection",
  "Delete an existing connection in CData Sync",
  {
    connName: z.string().describe("The name of the connection"),
  },
  async ({ connName }) => {
    const connection = await makeCDataSyncRequest(`/connections(${connName})`);
    if (!connection) {
      return { content: [{ type: "text", text: "Connection not found." }] };
    }

    await makeCDataSyncRequest(`/connections(${connName})`, {
      method: "DELETE",
    });

    return { content: [{ type: "text", text: "Connection deleted successfully." }] };
  }
);

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("CData Sync MCP Server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error in main():", err);
  process.exit(1);
});