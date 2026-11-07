# PixelRoyale Portable Windows build

This desktop build packages a **local copy of the complete game** inside the EXE. It no longer opens the live GitHub Pages website, so website outages or web cache issues do not replace the files inside an already-built desktop release.

## Build on Windows

1. Download/extract the latest complete PixelRoyale repository from GitHub (do not download only the `desktop` folder).
2. Install **Node.js LTS**.
3. Open PowerShell in the `desktop` folder.
4. Run:

   ```powershell
   npm install
   npm run build:portable
   ```

The build first copies the website, scripts, styles, images, and OG mode into `desktop/game`, then packages that local copy into Electron.

**Output:** `desktop\dist\PixelRoyale-Portable-1.0.3.exe`

## Desktop features

- Local bundled game files; no GitHub Pages request is needed to launch.
- Windows 11 exclusive skin.
- Persistent desktop save profile.
- Fullscreen toggle with F11.
- Window sizes: 1280×720, 1440×900, and 1920×1080.
- Zoom controls, always-on-top, reload, and developer tools.

## Network-dependent features

- Multiplayer still requires the PixelRoyale multiplayer Worker and an internet connection.
- CrazyGames login and platform-only APIs are unavailable in the itch.io desktop build. Desktop progress saves locally.
- Windows may show an unknown-publisher SmartScreen warning because the EXE is not code-signed.

Upload only `PixelRoyale-Portable-1.0.3.exe` to itch.io. Do not upload `node_modules` or the temporary `game` staging folder.
