#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const l10nPath = path.join(process.cwd(), "src", "l10n.yml");

console.log("👀 Watching for l10n.yml changes...");
console.log(`   File: ${l10nPath}`);

// 初回ビルド
console.log("🔨 Initial build...");
runBuild();

// ファイルウォッチング
try {
  fs.watchFile(l10nPath, { interval: 1000 }, (curr, prev) => {
    if (curr.mtime > prev.mtime) {
      console.log("📄 l10n.yml updated. Running build...");
      runBuild();
    }
  });
} catch (error) {
  console.error("❌ Error watching file:", error.message);
  process.exit(1);
}

function runBuild() {
  const buildScript = path.join(__dirname, "build-l10n.js");
  const child = spawn("node", [buildScript], { stdio: "inherit" });
  
  child.on("exit", (code) => {
    if (code === 0) {
      console.log("✅ Build complete.");
    } else {
      console.error("❌ Build failed.");
    }
  });
}
