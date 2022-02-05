import { app, BrowserWindow, ipcMain, Menu, Tray, Notification } from "electron";
import { join } from "path";
import { Settings, SocketServer, Discord } from "./lib";

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

function createWindow() {
  if (!mainWindow) {
    mainWindow = new BrowserWindow({
      height: 600,
      width: 800,
      icon: join(__dirname, "../icon.png"),
      webPreferences: {
        preload: join(__dirname, "preload.js"),
      },
    });
    mainWindow.loadFile(join(__dirname, "../index.html"));
    mainWindow.setMenu(Menu.buildFromTemplate([]));
    mainWindow.on("close", (e) => {
      e.preventDefault();
      mainWindow.hide();
    });
  } else mainWindow.show();
}

async function createTray() {
  const iconPath = join(__dirname, "../icon.png");
  tray = new Tray(iconPath);
  tray.setToolTip("Youtube Music Presence");
  tray.setContextMenu(Menu.buildFromTemplate([{ label: "Quit", click: () => process.exit(0) }]));
  tray.on("click", createWindow);
  const settings = await Settings.getSettings();
  if (settings.enabled) SocketServer.start(settings.port);
}

app.on("ready", () => {
  createTray();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("API:settings:get", async (event, args) => {
  return Settings.getSettings();
});

ipcMain.handle("API:settings:set", async (event, args) => {
  await Settings.setSettings(args);
  if (args.enabled) await SocketServer.start(args.port);
  else await SocketServer.stop();
});

ipcMain.handle("API:notification:show", async (event, { body, title }) => {
  new Notification({ title, body, icon: "./icon.ico" }).show();
});

SocketServer.on("yt-music", async (value: MusicInfo) => {
  if (!Discord.isLoggedIn()) await Discord.login();
  if (value.playing) {
    const label = value.url?.includes("playlist") ? "playlist" : "song";
    Discord.setActivity({
      details: `Title: ${value.title}`,
      state: `Artist: ${value.artist}`,
      largeImageKey: "music",
      largeImageText: "Listen to some music!",
      buttons: value.url ? [{ label: `Listen to this ${label}`, url: value.url }] : undefined,
    });
  } else {
    Discord.setActivity({
      details: "Nothing playing",
      largeImageKey: "music",
      largeImageText: "Listen to some music!",
    });
  }
});

SocketServer.on("yt-music-clear", () => {
  if (!Discord.isLoggedIn()) return;
  Discord.clearActivity();
});
