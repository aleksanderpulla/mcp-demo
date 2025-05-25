import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Tools
import { configureSyncTool } from "./tools/configureSync.js";
import { createConnectionTool } from "./tools/connectionManagement/createConnection.js";
import { deleteConnectionTool } from "./tools/connectionManagement/deleteConnection.js";
import { listConnectionsTool } from "./tools/connectionManagement/listConnections.js";
import { listConnectionTablesTool } from "./tools/connectionManagement/listConnectionTables.js";
import { listConnectionTableColumnsTool } from "./tools/connectionManagement/listConnectionTableColumns.js";
import { listJobsTool } from "./tools/jobManagement/listJobs.js";
import { executeJobTool } from "./tools/jobManagement/executeJob.js";
import { deleteJobTool } from "./tools/jobManagement/deleteJob.js";
import { listJobTasksTool } from "./tools/jobManagement/listJobTasks.js";
import { createUserTool } from "./tools/userManagement/createUser.js";
import { listUsersTool } from "./tools/userManagement/listUsers.js";
import { modifyUserTool } from "./tools/userManagement/modifyUser.js";
import { createJobTool } from "./tools/jobManagement/createJob.js";

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

server.tool(
  listConnectionTableColumnsTool.name,
  listConnectionTableColumnsTool.description,
  listConnectionTableColumnsTool.inputSchema.shape,
  // @ts-ignore
  listConnectionTableColumnsTool.handler
);

// @ts-ignore
server.tool(
  listJobsTool.name,
  listJobsTool.description,
  listJobsTool.handler
);

server.tool(
  executeJobTool.name,
  executeJobTool.description,
  executeJobTool.inputSchema.shape,
  // @ts-ignore
  executeJobTool.handler
);

server.tool(
  deleteJobTool.name,
  deleteJobTool.description,
  deleteJobTool.inputSchema.shape,
  // @ts-ignore
  deleteJobTool.handler
);

server.tool(
  listJobTasksTool.name,
  listJobTasksTool.description,
  listJobTasksTool.inputSchema.shape,
  // @ts-ignore
  listJobTasksTool.handler
);

server.tool(
  createUserTool.name,
  createUserTool.description,
  createUserTool.inputSchema.shape,
  // @ts-ignore
  createUserTool.handler
);

// @ts-ignore
server.tool(
  listUsersTool.name,
  listUsersTool.description,
  listUsersTool.handler
);

server.tool(
  modifyUserTool.name,
  modifyUserTool.description,
  modifyUserTool.inputSchema.shape,
  // @ts-ignore
  modifyUserTool.handler
);

server.tool(
  createJobTool.name,
  createJobTool.description,
  createJobTool.inputSchema.shape,
  // @ts-ignore
  createJobTool.handler
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error in main():", err);
  process.exit(1);
});
