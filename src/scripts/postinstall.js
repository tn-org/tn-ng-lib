#!/usr/bin/env node

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🔧 tn-ng-lib postinstall setup");

// srcディレクトリが存在するかチェック（Angularプロジェクトの場合）
const projectSrcDir = path.join(process.cwd(), "src");
if (!fs.existsSync(projectSrcDir)) {
  console.log("ℹ  No src directory found. Skipping l10n.yml creation.");
  console.log("   (This is normal for non-Angular projects)");
  process.exit(0);
}

// l10n.ymlが既に存在するかチェック
const projectL10nPath = path.join(process.cwd(), "src", "l10n.yml");
if (fs.existsSync(projectL10nPath)) {
  console.log("✔ l10n.yml already exists in your project");
  process.exit(0);
}

// init-l10nスクリプトを実行
const initScript = path.join(__dirname, "init-l10n.js");
const child = spawn("node", [initScript], { stdio: "inherit" });

child.on("exit", (code) => {
  if (code === 0) {
    console.log("");
    console.log("📋 Next steps:");
    console.log("  1. Customize your src/l10n.yml with project-specific translations");
    console.log("  2. Run 'npx tn-build-l10n' to generate localization files");
    console.log("  3. Or add to your package.json scripts:");
    console.log("     \"prebuild\": \"npx tn-build-l10n\"");
    console.log("     \"dev\": \"npx tn-build-l10n-watch & ng serve\"");
  }
  process.exit(code);
});