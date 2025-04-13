import { syncConfig } from "./config.js";

export async function makeCDataSyncRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T | null> {
  if (!syncConfig.baseUrl || !syncConfig.authToken) {
    throw new Error("Sync configuration is missing. Please configure it using the MCP tool.");
  }

  const url = `${syncConfig.baseUrl}${path}`;
  const headers = {
    "Content-Type": "application/json",
    "x-cdata-authtoken": syncConfig.authToken,
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