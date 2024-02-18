import { BrowserWindow, app, shell, session } from "electron";
import * as path from "path";
import { optimizer } from "@electron-toolkit/utils";

const host = "https://calendar.notion.so";

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    icon: path.join(__dirname, "..", "..", "build", "icon.png"),
    title: "Notion Calendar",
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith(host)) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  mainWindow.loadURL(host, { userAgent: "Chrome" });
}

app.whenReady().then(() => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders["User-Agent"] = "Chrome";
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();
  session.defaultSession.setUserAgent("Chrome");
});
