const { app, BrowserWindow, Menu, shell } = require("electron");
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const GAME_DIR = path.join(__dirname, "game");
const WEBSITE_URL = "https://crypticfn2012-jpg.github.io/PixelRoyale/";
const APP_ICON = path.join(__dirname, "build", "icon.ico");
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".png": "image/png",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".gif": "image/gif", ".svg": "image/svg+xml", ".ico": "image/x-icon",
  ".mp3": "audio/mpeg", ".wav": "audio/wav", ".ogg": "audio/ogg",
  ".mp4": "video/mp4", ".webm": "video/webm", ".woff": "font/woff",
  ".woff2": "font/woff2", ".ttf": "font/ttf", ".wasm": "application/wasm"
};

let win;
let gameServer;
let gameOrigin = "";

function startGameServer() {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(path.join(GAME_DIR, "index.html"))) {
      reject(new Error("Bundled game files are missing. Rebuild from the full repository."));
      return;
    }

    gameServer = http.createServer((req, res) => {
      let pathname;
      try {
        pathname = decodeURIComponent(new URL(req.url, "http://127.0.0.1").pathname);
      } catch (_) {
        res.writeHead(400).end("Bad request");
        return;
      }

      const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
      const filePath = path.resolve(GAME_DIR, relativePath);
      if (filePath !== GAME_DIR && !filePath.startsWith(GAME_DIR + path.sep)) {
        res.writeHead(403).end("Forbidden");
        return;
      }

      if (req.method !== "GET" && req.method !== "HEAD") {
        res.writeHead(405, { "Allow": "GET, HEAD" }).end();
        return;
      }

      fs.stat(filePath, (error, stat) => {
        const actualFile = !error && stat.isDirectory() ? path.join(filePath, "index.html") : filePath;
        fs.stat(actualFile, (fileError, fileStat) => {
          if (fileError || !fileStat.isFile()) {
            res.writeHead(404, { "Cache-Control": "no-store" }).end("Not found");
            return;
          }
          res.writeHead(200, {
            "Content-Type": MIME_TYPES[path.extname(actualFile).toLowerCase()] || "application/octet-stream",
            "Content-Length": fileStat.size,
            "Cache-Control": "no-cache",
            "X-Content-Type-Options": "nosniff"
          });
          if (req.method === "HEAD") res.end();
          else fs.createReadStream(actualFile).pipe(res);
        });
      });
    });

    gameServer.once("error", reject);
    gameServer.listen(0, "127.0.0.1", () => {
      gameOrigin = `http://127.0.0.1:${gameServer.address().port}`;
      resolve();
    });
  });
}

function loadGame() {
  if (win && gameOrigin) win.loadURL(gameOrigin + "/?desktop=1");
}

function createWindow() {
  win = new BrowserWindow({
    width: 1440, height: 900, minWidth: 960, minHeight: 600,
    show: false, backgroundColor: "#101a33", title: "PixelRoyale",
    icon: APP_ICON, autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true, nodeIntegration: false, sandbox: true,
      partition: "persist:pixelroyale-desktop"
    }
  });

  win.once("ready-to-show", () => win.show());
  win.webContents.on("did-fail-load", (_event, code, description, url) => {
    console.error("PixelRoyale failed to load:", code, description, url);
  });
  loadGame();

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://") || url.startsWith("http://")) shell.openExternal(url);
    return { action: "deny" };
  });

  win.webContents.on("will-navigate", (event, url) => {
    if (url.startsWith(gameOrigin + "/") ||
        url.startsWith("https://pixelroyal-multiplayer.pixelroyal-21513.workers.dev/")) return;
    if (url.startsWith("https://") || url.startsWith("http://")) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  win.on("closed", () => { win = null; });
  buildMenu();
}

function buildMenu() {
  const template = [
    { label: "PixelRoyale", submenu: [
      { label: "Reload game", accelerator: "Ctrl+R", click: () => win && loadGame() },
      { type: "separator" }, { label: "Quit", accelerator: "Alt+F4", role: "quit" }
    ]},
    { label: "View", submenu: [
      { label: "Toggle fullscreen", accelerator: "F11", click: () => win && win.setFullScreen(!win.isFullScreen()) },
      { label: "Windowed mode", click: () => win && win.setFullScreen(false) },
      { type: "separator" },
      { label: "Zoom in", accelerator: "Ctrl+Plus", click: () => changeZoom(0.1) },
      { label: "Zoom out", accelerator: "Ctrl+-", click: () => changeZoom(-0.1) },
      { label: "Reset zoom", accelerator: "Ctrl+0", click: () => win && win.webContents.setZoomFactor(1) },
      { type: "separator" },
      { label: "Always on top", type: "checkbox", click: item => win && win.setAlwaysOnTop(item.checked) },
      { label: "Developer tools", accelerator: "F12", click: () => win && win.webContents.toggleDevTools() }
    ]},
    { label: "Window", submenu: [
      { label: "1280 × 720", click: () => resize(1280, 720) },
      { label: "1440 × 900", click: () => resize(1440, 900) },
      { label: "1920 × 1080", click: () => resize(1920, 1080) },
      { role: "minimize" }
    ]},
    { label: "Help", submenu: [
      { label: "PixelRoyale on itch.io", click: () => shell.openExternal("https://itch.io/") },
      { label: "Game website", click: () => shell.openExternal(WEBSITE_URL) }
    ]}
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function changeZoom(delta) {
  if (!win) return;
  win.webContents.setZoomFactor(Math.max(0.75, Math.min(1.5, win.webContents.getZoomFactor() + delta)));
}

function resize(width, height) {
  if (!win) return;
  win.setFullScreen(false);
  win.setSize(width, height);
  win.center();
}

app.whenReady().then(async () => {
  app.setAppUserModelId("com.pixelroyale.desktop");
  await startGameServer();
  createWindow();
  app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
}).catch(error => {
  console.error("Could not start PixelRoyale:", error);
  app.quit();
});

app.on("before-quit", () => { if (gameServer) gameServer.close(); });
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
