// scripts/watch-l10n.js
const chokidar = require("chokidar");
const { exec } = require("child_process");

const watcher = chokidar.watch("./src/assets/l10n.yml", {
  ignoreInitial: true,
});

watcher.on("change", () => {
  console.log("📄 l10n.yml updated. Running build...");
  exec("node scripts/build-l10n.js", (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Build error:", stderr);
    } else {
      console.log("✅ Build complete.\n" + stdout);
    }
  });
});
