import { BrowserWindow, app, shell, session } from "electron";
import * as path from "path";
import { optimizer } from "@electron-toolkit/utils";
import config from "./config";

const host = "https://calendar.notion.so";
const otherAllowedHosts = ["https://calendar-api.notion.so"];

const startsWithAny = (haystack: string, needles: string[]) => {
  return needles
    .map((needle) => haystack.startsWith(needle))
    .some((starts) => starts);
};

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: config.get("lastWindowState.width"),
    height: config.get("lastWindowState.height"),
    show: false,
    autoHideMenuBar: true,
    icon: path.join(__dirname, "..", "..", "build", "icon.png"),
    title: "Notion Calendar",
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (!startsWithAny(url, [host, ...otherAllowedHosts])) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  mainWindow.loadURL(host, { userAgent: "Chrome" });

  return mainWindow;
}

app.whenReady().then(() => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders["User-Agent"] = "Chrome";
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  const mainWindow = createWindow();
  session.defaultSession.setUserAgent("Chrome");

  app.on("before-quit", () => {
    const { width, height } = mainWindow.getNormalBounds();
    config.set("lastWindowState.width", width);
    config.set("lastWindowState.height", height);
  });
});
