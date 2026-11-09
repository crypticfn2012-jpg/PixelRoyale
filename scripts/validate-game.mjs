import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = process.cwd();
const temp = mkdtempSync(join(tmpdir(), "pixelroyale-check-"));
const files = [
  "pixelpass.js",
  "game-upgrade.js",
  "quality-overhaul.js",
  "pulse-trailer.js",
  "desktop/main.js",
  "desktop/preload.js",
  "desktop/prepare-game.js",
  "desktop/make-icon.js"
];
let checked = 0;
try {
  for (const file of files) {
    execFileSync(process.execPath, ["--check", join(root, file)], { stdio: "inherit" });
    checked++;
  }
  const html = readFileSync(join(root, "index.html"), "utf8");
  const inlineScripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)]
    .filter((match) => !/\bsrc\s*=/.test(match[1]) && match[2].trim());
  for (let i = 0; i < inlineScripts.length; i++) {
    const file = join(temp, `inline-${i}.js`);
    writeFileSync(file, inlineScripts[i][2]);
    execFileSync(process.execPath, ["--check", file], { stdio: "inherit" });
    checked++;
  }
  console.log(`PixelRoyale syntax checks passed: ${checked} JavaScript files/blocks.`);
} finally {
  rmSync(temp, { recursive: true, force: true });
}
