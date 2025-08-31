#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// プロジェクトのl10n.ymlパス
const projectL10nPath = path.join(process.cwd(), "src", "assets", "l10n.yml");
const projectAssetsDir = path.join(process.cwd(), "src", "assets");

// ライブラリのサンプルファイルパス
function getSamplePath() {
  try {
    // node_modules内のライブラリを確認
    const libPath = path.join(process.cwd(), "node_modules", "tn-ng-lib", "src", "assets", "sample-l10n.yml");
    if (fs.existsSync(libPath)) return libPath;
    
    // ローカル開発時のパス
    const localPath = path.join(__dirname, "..", "assets", "sample-l10n.yml");
    if (fs.existsSync(localPath)) return localPath;
    
    return null;
  } catch {
    return null;
  }
}

console.log("🔧 Initializing l10n.yml for your project");

// src/assetsディレクトリが存在するかチェック
if (!fs.existsSync(projectAssetsDir)) {
  console.log("✗ No src/assets directory found.");
  console.log("  Please make sure you're running this in an Angular project root.");
  process.exit(1);
}

// l10n.ymlが既に存在するかチェック
if (fs.existsSync(projectL10nPath)) {
  console.log("✔ l10n.yml already exists in your project");
  console.log("  Delete it first if you want to recreate from template");
  process.exit(0);
}

// サンプルファイルが存在するかチェック
const samplePath = getSamplePath();
if (!samplePath) {
  console.log("✗ Sample l10n.yml not found in library");
  console.log("  Please check tn-ng-lib installation");
  process.exit(1);
}

try {
  // サンプルファイルをプロジェクトにコピー
  const sampleContent = fs.readFileSync(samplePath, "utf8");
  fs.writeFileSync(projectL10nPath, sampleContent, "utf8");
  
  console.log("✔ Created l10n.yml in src/assets/");
  console.log("  Customize it with your project-specific translations");
  console.log("  Run 'npx tn-build-l10n' to build localization files");
} catch (error) {
  console.error("✗ Failed to create l10n.yml:", error.message);
  process.exit(1);
}