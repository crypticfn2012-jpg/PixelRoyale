const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const outputDir = path.join(__dirname, "game");
const excluded = new Set([".git", ".github", "desktop", "multiplayer", "node_modules", "dist"]);
let copiedFiles = 0;
let copiedBytes = 0;

function copyGameFiles(source, destination) {
  fs.mkdirSync(destination, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    if (excluded.has(entry.name)) continue;
    if (entry.name.startsWith(".") && entry.name !== ".nojekyll") continue;
    const from = path.join(source, entry.name);
    const to = path.join(destination, entry.name);
    if (entry.isDirectory()) {
      copyGameFiles(from, to);
    } else if (entry.isFile()) {
      fs.copyFileSync(from, to);
      copiedFiles++;
      copiedBytes += fs.statSync(from).size;
    }
  }
}

if (!fs.existsSync(path.join(projectRoot, "index.html"))) {
  throw new Error("Could not find the PixelRoyale website index.html beside the desktop folder.");
}
fs.rmSync(outputDir, { recursive: true, force: true });
copyGameFiles(projectRoot, outputDir);
if (!fs.existsSync(path.join(outputDir, "index.html")) ||
    !fs.existsSync(path.join(outputDir, "pixelpass.js")) ||
    !fs.existsSync(path.join(outputDir, "game-upgrade.js")) ||
    !fs.existsSync(path.join(outputDir, "og", "index.html"))) {
  throw new Error("The local game copy is incomplete. Check that the full PixelRoyale repository was downloaded.");
}
console.log("Prepared local PixelRoyale game:", copiedFiles, "files,", (copiedBytes / 1024 / 1024).toFixed(1), "MB");
