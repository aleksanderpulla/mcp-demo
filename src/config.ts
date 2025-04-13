export type SyncConfig = {
    baseUrl: string;
    authToken: string;
  };
  
  export let syncConfig: SyncConfig = {
    baseUrl: "",
    authToken: "",
  };
  
  export function updateSyncConfig(newConfig: Partial<SyncConfig>) {
    syncConfig = { ...syncConfig, ...newConfig };
  }
  