import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("API", {
  getSettings: () => ipcRenderer.invoke("API:settings:get"),
  setSettings: (settings: SettingsType) => ipcRenderer.invoke("API:settings:set", settings),
  sendNotification: (options: NotificationType) => ipcRenderer.invoke("API:notification:show", options),
});
