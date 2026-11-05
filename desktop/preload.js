// Keep the renderer isolated. The game currently needs no privileged Node APIs.
window.addEventListener("DOMContentLoaded", () => {
  document.documentElement.dataset.pixelroyaleDesktop = "true";
});
