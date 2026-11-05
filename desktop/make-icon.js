const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");
const pngToIco = require("png-to-ico");

async function main() {
  const root = path.resolve(__dirname, "..");
  const svgPath = path.join(root, "PixelRoyale.svg");
  const buildDir = path.join(__dirname, "build");
  const pngPath = path.join(buildDir, "icon.png");
  const icoPath = path.join(buildDir, "icon.ico");

  await fs.mkdir(buildDir, { recursive: true });
  const svg = await fs.readFile(svgPath);
  const png = await sharp(svg, { density: 384 })
    .resize(256, 256, { fit: "contain" })
    .png()
    .toBuffer();

  await fs.writeFile(pngPath, png);
  await fs.writeFile(icoPath, await pngToIco(png));
  console.log("Created Windows icon from PixelRoyale.svg");
}

main().catch(error => {
  console.error("Could not create PixelRoyale icon:", error);
  process.exitCode = 1;
});
