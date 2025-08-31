#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const l10nPath = path.join(process.cwd(), "src", "l10n.yml");

console.log("👀 Watching for l10n.yml changes...");
console.log(`   File: ${l10nPath}`);

// ファイル存在チェック
if (!fs.existsSync(l10nPath)) {
  console.error(`❌ File not found: ${l10nPath}`);
  console.log("   Make sure to run 'npx tn-init-l10n' first to create the file.");
  process.exit(1);
}

// 初回ビルド
console.log("🔨 Initial build...");
runBuild();

// ファイルウォッチング
console.log("   Starting file watcher...");
fs.watchFile(l10nPath, { interval: 1000 }, (curr, prev) => {
  console.log(`   File change detected: ${new Date().toISOString()}`);
  console.log(`   Current mtime: ${curr.mtime}`);
  console.log(`   Previous mtime: ${prev.mtime}`);
  
  if (curr.mtime > prev.mtime) {
    console.log("📄 l10n.yml updated. Running build...");
    runBuild();
  } else {
    console.log("   No actual change detected.");
  }
});

console.log("✅ Watcher started. Edit your src/l10n.yml file to test.");
console.log("   Press Ctrl+C to stop watching.");

// プロセス終了時のクリーンアップ
process.on('SIGINT', () => {
  console.log("\n👋 Stopping l10n watcher...");
  fs.unwatchFile(l10nPath);
  process.exit(0);
});

function runBuild() {
  const buildScript = path.join(__dirname, "build-l10n.js");
  console.log(`   Running: node ${buildScript}`);
  
  const child = spawn("node", [buildScript], { stdio: "inherit" });
  
  child.on("exit", (code) => {
    if (code === 0) {
      console.log("✅ Build complete.");
    } else {
      console.error("❌ Build failed with code:", code);
    }
  });
}
