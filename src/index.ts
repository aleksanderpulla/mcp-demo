import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Tools
import { configureSyncTool } from "./tools/configureSync.js";
import { createConnectionTool } from "./tools/connectionManagement/createConnection.js";
import { deleteConnectionTool } from "./tools/connectionManagement/deleteConnection.js";
import { listConnectionsTool } from "./tools/connectionManagement/listConnections.js";
import { listConnectionTablesTool } from "./tools/connectionManagement/listConnectionTables.js";

const server = new McpServer({
  name: "cdata_sync",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Register tools
server.tool(
  configureSyncTool.name,
  configureSyncTool.description,
  configureSyncTool.inputSchema.shape,
  // @ts-ignore
  configureSyncTool.handler
);

server.tool(
  createConnectionTool.name,
  createConnectionTool.description,
  createConnectionTool.inputSchema.shape,
  // @ts-ignore
  createConnectionTool.handler
);

server.tool(
  deleteConnectionTool.name,
  deleteConnectionTool.description,
  deleteConnectionTool.inputSchema.shape,
  // @ts-ignore
  deleteConnectionTool.handler
);

// @ts-ignore
server.tool(
  listConnectionsTool.name,
  listConnectionsTool.description,
  listConnectionsTool.handler
);

server.tool(
  listConnectionTablesTool.name,
  listConnectionTablesTool.description,
  listConnectionTablesTool.inputSchema.shape,
  // @ts-ignore
  listConnectionTablesTool.handler
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // console.error("CData Sync MCP Server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error in main():", err);
  process.exit(1);
});
