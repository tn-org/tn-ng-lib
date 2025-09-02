#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

// src内のすべてのl10n.ymlファイルを検索（build-l10n.jsと同じ関数）
function findL10nFiles(dir = "./src") {
  const files = [];
  
  function scanDirectory(currentDir) {
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        
        if (entry.isDirectory()) {
          // node_modules, .git, dist などのディレクトリは除外
          if (!entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== 'dist') {
            scanDirectory(fullPath);
          }
        } else if (entry.name === 'l10n.yml') {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // アクセス権限エラーなどは無視
    }
  }
  
  scanDirectory(dir);
  return files;
}

const l10nFiles = findL10nFiles();

console.log("👀 Watching for l10n.yml changes...");
console.log(`📁 Found ${l10nFiles.length} l10n.yml file(s):`);
for (const file of l10nFiles) {
  console.log(`   ${file}`);
}

// ファイル存在チェック
if (l10nFiles.length === 0) {
  console.error("❌ No l10n.yml files found in src directory");
  console.log("   Make sure to run 'npx tn-init-l10n' first to create a file.");
  process.exit(1);
}

// 初回ビルド
console.log("🔨 Initial build...");
runBuild();

// ファイルウォッチング
console.log("   Starting file watchers...");
for (const filePath of l10nFiles) {
  fs.watchFile(filePath, { interval: 1000 }, (curr, prev) => {
    const relativePath = path.relative(process.cwd(), filePath);
    console.log(`   File change detected: ${relativePath} at ${new Date().toISOString()}`);
    
    if (curr.mtime > prev.mtime) {
      console.log(`📄 ${relativePath} updated. Running build...`);
      runBuild();
    }
  });
}

console.log("✅ Watchers started. Edit any l10n.yml files to trigger rebuild.");
console.log("   Press Ctrl+C to stop watching.");

// プロセス終了時のクリーンアップ
process.on('SIGINT', () => {
  console.log("\n👋 Stopping l10n watchers...");
  for (const filePath of l10nFiles) {
    fs.unwatchFile(filePath);
  }
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
