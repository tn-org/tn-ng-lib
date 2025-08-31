#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// プロジェクトのl10n.ymlパス
const projectL10nPath = path.join(process.cwd(), "src", "assets", "l10n.yml");
const projectAssetsDir = path.join(process.cwd(), "src", "assets");

// ライブラリのサンプルファイルパス
const samplePath = path.join(__dirname, "..", "assets", "sample-l10n.yml");

console.log("🔧 tn-ng-lib postinstall setup");

// src/assetsディレクトリが存在するかチェック（Angularプロジェクトの場合）
if (!fs.existsSync(projectAssetsDir)) {
  console.log("ℹ  No src/assets directory found. Skipping l10n.yml creation.");
  console.log("   (This is normal for non-Angular projects)");
  process.exit(0);
}

// l10n.ymlが既に存在するかチェック
if (fs.existsSync(projectL10nPath)) {
  console.log("✔ l10n.yml already exists in your project");
  process.exit(0);
}

// サンプルファイルが存在するかチェック
if (!fs.existsSync(samplePath)) {
  console.log("⚠  Sample l10n.yml not found in library");
  process.exit(0);
}

try {
  // サンプルファイルをプロジェクトにコピー
  const sampleContent = fs.readFileSync(samplePath, "utf8");
  fs.writeFileSync(projectL10nPath, sampleContent, "utf8");
  
  console.log("✔ Created sample l10n.yml in src/assets/");
  console.log("  You can customize it with your project-specific translations");
  console.log("  Run 'npx tn-build-l10n' to build localization files");
} catch (error) {
  console.error("✗ Failed to create sample l10n.yml:", error.message);
  process.exit(1);
}