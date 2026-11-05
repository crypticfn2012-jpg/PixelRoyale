# PixelRoyale Portable Windows build

This folder packages PixelRoyale in an Electron desktop window. It uses the existing live game URL, so it keeps the same game code, multiplayer Worker, matchmaking/private rooms, and game updates as the web version.

## Build on Windows

1. Install **Node.js LTS** from https://nodejs.org/ (if it is not already installed).
2. Open Command Prompt or PowerShell.
3. Enter this folder:
   `cd path\to\PixelRoyale\desktop`
4. Install the build dependencies:
   `npm install`
5. Build the portable executable:
   `npm run build:portable`
6. Find the output in `desktop\dist\PixelRoyale-Portable-1.0.0.exe`.

The portable EXE does not need an installer. You can upload that EXE to itch.io as a Windows download.

## Desktop features

- Separate persistent desktop browser storage for game progress/settings.
- Fullscreen toggle with F11.
- Window sizes: 1280×720, 1440×900, and 1920×1080.
- Zoom controls and reset.
- Always-on-top option.
- Reload and developer tools.

## Important limitations

- **Internet required:** the app loads the live GitHub Pages game, rather than bundling all game assets. It will not start the game offline. A future fully offline-capable package would need the complete game and every asset copied into the Electron app.
- **Separate save profile:** desktop progress is stored persistently on that PC. It does not automatically merge with browser localStorage.
- **CrazyGames login:** CrazyGames account authentication/data APIs are platform-specific and are not available as a normal itch.io desktop login. This build can save locally, but it does not provide cross-device cloud account sync. Do not advertise it as doing so.
- **Multiplayer:** it uses the existing public multiplayer Worker and therefore still requires an internet connection and the Worker to be online.
- The app is not signed with a code-signing certificate, so Windows SmartScreen may show an unknown-publisher warning on first launch.

Do not upload the contents of `node_modules`; upload only the portable EXE.
