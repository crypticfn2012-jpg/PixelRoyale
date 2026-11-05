const { app, BrowserWindow, Menu, shell } = require("electron");
const path = require("node:path");

const GAME_URL = "https://crypticfn2012-jpg.github.io/PixelRoyale/?desktop=1";
const APP_ICON = path.join(__dirname, "build", "icon.ico");
let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 960,
    minHeight: 600,
    show: false,
    backgroundColor: "#101a33",
    title: "PixelRoyale",
    icon: APP_ICON,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      partition: "persist:pixelroyale-desktop"
    }
  });

  win.once("ready-to-show", () => win.show());
  win.loadURL(GAME_URL);

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://") || url.startsWith("http://")) shell.openExternal(url);
    return { action: "deny" };
  });

  win.webContents.on("will-navigate", (event, url) => {
    if (url.startsWith("https://crypticfn2012-jpg.github.io/PixelRoyale/") ||
        url.startsWith("https://pixelroyal-multiplayer.pixelroyal-21513.workers.dev/")) return;
    if (url.startsWith("https://")) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  win.on("closed", () => { win = null; });
  buildMenu();
}

function buildMenu() {
  const template = [
    {
      label: "PixelRoyale",
      submenu: [
        { label: "Reload game", accelerator: "Ctrl+R", click: () => win && win.loadURL(GAME_URL) },
        { type: "separator" },
        { label: "Quit", accelerator: "Alt+F4", role: "quit" }
      ]
    },
    {
      label: "View",
      submenu: [
        { label: "Toggle fullscreen", accelerator: "F11", click: () => win && win.setFullScreen(!win.isFullScreen()) },
        { label: "Windowed mode", click: () => win && win.setFullScreen(false) },
        { type: "separator" },
        { label: "Zoom in", accelerator: "Ctrl+Plus", click: () => changeZoom(0.1) },
        { label: "Zoom out", accelerator: "Ctrl+-", click: () => changeZoom(-0.1) },
        { label: "Reset zoom", accelerator: "Ctrl+0", click: () => win && win.webContents.setZoomFactor(1) },
        { type: "separator" },
        { label: "Always on top", type: "checkbox", click: item => win && win.setAlwaysOnTop(item.checked) },
        { label: "Developer tools", accelerator: "F12", click: () => win && win.webContents.toggleDevTools() }
      ]
    },
    {
      label: "Window",
      submenu: [
        { label: "1280 × 720", click: () => resize(1280, 720) },
        { label: "1440 × 900", click: () => resize(1440, 900) },
        { label: "1920 × 1080", click: () => resize(1920, 1080) },
        { role: "minimize" }
      ]
    },
    {
      label: "Help",
      submenu: [
        { label: "PixelRoyale on itch.io", click: () => shell.openExternal("https://itch.io/") },
        { label: "Game website", click: () => shell.openExternal("https://crypticfn2012-jpg.github.io/PixelRoyale/") }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function changeZoom(delta) {
  if (!win) return;
  const current = win.webContents.getZoomFactor();
  win.webContents.setZoomFactor(Math.max(0.75, Math.min(1.5, current + delta)));
}

function resize(width, height) {
  if (!win) return;
  win.setFullScreen(false);
  win.setSize(width, height);
  win.center();
}

app.whenReady().then(() => {
  app.setAppUserModelId("com.pixelroyale.desktop");
  createWindow();
  app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
