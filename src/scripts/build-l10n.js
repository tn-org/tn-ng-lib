#!/usr/bin/env node

const fs = require("fs");
const yaml = require("js-yaml");
const path = require("path");

const sourcePath = "./src/l10n.yml";
const outputDir = "./src/assets/dist/l10n";

// ライブラリのデフォルトl10nファイルのパスを取得
function getLibraryDefaultPath() {
  try {
    // node_modules内のライブラリを確認
    const libPath = path.join(process.cwd(), "node_modules", "@tnlake", "tn-ng-lib", "src", "assets", "default-l10n.yml");
    if (fs.existsSync(libPath)) return libPath;
    
    // ローカル開発時のパス
    const localPath = path.join(__dirname, "..", "assets", "default-l10n.yml");
    if (fs.existsSync(localPath)) return localPath;
    
    return null;
  } catch {
    return null;
  }
}

// 深いマージ関数（プロジェクト > ライブラリの優先度）
function deepMerge(library, project) {
  if (!library) return project;
  if (!project) return library;
  
  const merged = { ...library };
  
  for (const key in project) {
    if (typeof project[key] === 'object' && project[key] !== null && 
        typeof merged[key] === 'object' && merged[key] !== null) {
      merged[key] = deepMerge(merged[key], project[key]);
    } else {
      merged[key] = project[key]; // プロジェクトを優先
    }
  }
  
  return merged;
}

// YAMLファイルを読み込み、マージする
let yamlData = {};

// 1. ライブラリのデフォルトを読み込み
const defaultPath = getLibraryDefaultPath();
if (defaultPath) {
  try {
    const defaultData = yaml.load(fs.readFileSync(defaultPath, "utf8"));
    yamlData = defaultData;
    console.log("✔ Loaded library default l10n");
  } catch (error) {
    console.warn("⚠ Could not load library default l10n:", error.message);
  }
}

// 2. プロジェクトのl10n.ymlを読み込んでマージ
if (fs.existsSync(sourcePath)) {
  try {
    const projectData = yaml.load(fs.readFileSync(sourcePath, "utf8"));
    yamlData = deepMerge(yamlData, projectData);
    console.log("✔ Merged with project l10n.yml");
  } catch (error) {
    console.error("✗ Error reading project l10n.yml:", error.message);
    process.exit(1);
  }
} else {
  if (Object.keys(yamlData).length === 0) {
    console.error("✗ No l10n.yml found and no library defaults available");
    process.exit(1);
  }
  console.log("ℹ No project l10n.yml found, using library defaults only");
}

// 言語コード検出
function collectLangs(obj, langs = new Set()) {
  if (typeof obj !== "object" || obj === null) return langs;

  for (const key in obj) {
    const val = obj[key];
    if (
      typeof val === "object" &&
      val !== null &&
      Object.values(val).every((v) => typeof v === "string")
    ) {
      for (const lang of Object.keys(val)) {
        langs.add(lang);
      }
    } else if (typeof val === "object") {
      collectLangs(val, langs);
    }
  }

  return langs;
}

const targetLangs = Array.from(collectLangs(yamlData));

// ドット記法で flatten（leaf も node も両対応）
function flatten(obj, lang, prefix = "", out = {}) {
  if (typeof obj !== "object" || obj === null) return out;

  const keys = Object.keys(obj);
  const langValues = {};
  const nonLangKeys = [];

  // 分離：言語キーと子キー
  for (const key of keys) {
    if (targetLangs.includes(key)) {
      langValues[key] = obj[key];
    } else {
      nonLangKeys.push(key);
    }
  }

  // 翻訳部分を出力（子キーの有無に関係なく）
  if (targetLangs.every((l) => l in langValues)) {
    out[prefix] = langValues[lang];
  }

  // 子ノードを再帰処理
  for (const key of nonLangKeys) {
    const child = obj[key];
    const fullKey = prefix ? `${prefix}.${key}` : key;
    flatten(child, lang, fullKey, out);
  }

  return out;
}

// 出力処理
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

for (const lang of targetLangs) {
  const flat = flatten(yamlData, lang);
  const outFile = path.join(outputDir, `${lang}.json`);
  fs.writeFileSync(outFile, JSON.stringify(flat, null, 2), "utf8");
  console.log(`✔ ${lang}.json written`);
}
