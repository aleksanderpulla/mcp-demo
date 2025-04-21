import { syncConfig } from "./config.js";

import http from "http";
import https from "https";
import fetch from "node-fetch";



export async function makeCDataSyncRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T | null> {
  if (!syncConfig.baseUrl || !syncConfig.authToken) {
    throw new Error("Sync configuration is missing. Please configure it using the MCP tool.");
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  const url = `${syncConfig.baseUrl}${path}`;
  const isHttps = url.startsWith("https://");

  const headers = {
    "Content-Type": "application/json",
    "x-cdata-authtoken": syncConfig.authToken,
    ...options.headers,
  };

// Add this agent to bypass self-signed cert errors (ONLY for dev)
const agent = isHttps
    ? new https.Agent({ rejectUnauthorized: false }) // or with custom CA
    : new http.Agent(); // support http too

    const response = await fetch(url, { ...options, headers, agent: agent, signal: controller.signal } as any);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (response.status === 204) {
      return null as T;
    }
    try {
    return (await response.json()) as T;
  } catch (error) {
    console.error("Error making CData Sync request:", error);
    return null;
  }
}