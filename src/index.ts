import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const SYNC_API_BASE = "http://192.168.1.4:8181/api.rsc";

// Create server instance
const server = new McpServer({
  name: "cdatasync",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Helper function for making CData Sync API requests
async function makeCDataSyncRequest<T>(url: string, options: RequestInit = {}): Promise<T | null> {
  const headers = {
    "Content-Type": "application/json",
    "x-cdata-authtoken": "6d8X9v7j6S0z1j5Z8r7t",
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (response.status === 204) {
      return null as T;
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error("Error making CData Sync request:", error);
    return null;
  }
}

// Define MCP tool: Create Connection
server.tool(
    "create-connection",
    "Create a connection to a data source",
    {
    connName: z.string().describe("The name of the connection"),
    providerName: z.string().describe("The provider name for the data source"),
    connectionString: z.string().describe("The connection string for the data source")
    },
  
    async ({ connName, providerName, connectionString }: { connName: string; providerName: string; connectionString: string }): Promise<{ [x: string]: unknown; content: { type: "text"; text: string }[] }> => {
    const payload = {
      Name: connName,
      ProviderName: providerName,
      ConnectionString: connectionString
    };

    // Check if the connection already exists
    const existingConnection = await makeCDataSyncRequest(`${SYNC_API_BASE}/connections(${connName})`);
    if (existingConnection) {
      return { content: [{ type: "text", text: "Connection already exists." }] };
    }

    const result = await makeCDataSyncRequest(`${SYNC_API_BASE}/connections`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!result) {
      return { content: [{ type: "text", text: "Failed to create connection." }] };
    }

    return { content: [{ type: "text", text: "Connection created successfully." }] };
  },
);

// Define MCP tool: List Connections
server.tool(
  "list-connections",
  "List all connections in CData Sync",

  async (): Promise<{ [x: string]: unknown; content: { type: "text"; text: string }[] }> => {
  
  const connections = await makeCDataSyncRequest(`${SYNC_API_BASE}/connections`);
  if (!connections) {
    return { content: [{ type: "text", text: "There are no connections in your CData Sync instance." }] };
  }

  return { content: [{ type: "text", text: `Connections: ${JSON.stringify(connections)}` }] };
  },
);

// Define MCP tool: Delete Connection
server.tool(
  "delete-connection",
  "Delete an existing connection in CData Sync",
  {
  connName: z.string().describe("The name of the connection"),
  },

  async ({ connName }: { connName: string }): Promise<{ [x: string]: unknown; content: { type: "text"; text: string }[] }> => {
  
    // Check if the connection exists before attempting to delete it
  const connection = await makeCDataSyncRequest(`${SYNC_API_BASE}/connections(${connName})`);
  if (!connection) {
    return { content: [{ type: "text", text: "Connection not found." }] };
  }
  
  // Proceed to delete the connection
  await makeCDataSyncRequest(`${SYNC_API_BASE}/connections(${connName})`, {
    method: "DELETE",
  });

  return { content: [{ type: "text", text: "Connection deleted successfully." }] };
  },
);


async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("CData Sync MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
