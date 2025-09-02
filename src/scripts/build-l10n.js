#!/usr/bin/env node

const fs = require("fs");
const yaml = require("js-yaml");
const path = require("path");

const outputDir = "./src/assets/dist/l10n";

// src内のすべてのl10n.ymlファイルを検索
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

// namespace付きでYAMLデータを処理する関数
function processYamlWithNamespace(yamlContent) {
  const data = yaml.load(yamlContent);
  
  // namespaceが定義されている場合
  if (data && data.namespace && typeof data.namespace === 'string') {
    const namespace = data.namespace;
    const { namespace: _, ...content } = data; // namespaceプロパティを除外
    
    // namespaceでラップ
    return { [namespace]: content };
  }
  
  return data || {};
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

// 2. すべてのプロジェクトl10n.ymlファイルを検索・読み込み
const l10nFiles = findL10nFiles();
console.log(`📁 Found ${l10nFiles.length} l10n.yml file(s):`);

for (const filePath of l10nFiles) {
  console.log(`   ${filePath}`);
  
  try {
    const yamlContent = fs.readFileSync(filePath, "utf8");
    const processedData = processYamlWithNamespace(yamlContent);
    yamlData = deepMerge(yamlData, processedData);
    console.log(`   ✔ Merged ${path.relative(process.cwd(), filePath)}`);
  } catch (error) {
    console.error(`   ✗ Error reading ${filePath}:`, error.message);
  }
}

// ファイルが見つからない場合のチェック
if (l10nFiles.length === 0) {
  if (Object.keys(yamlData).length === 0) {
    console.error("✗ No l10n.yml files found and no library defaults available");
    console.log("   Run 'npx tn-init-l10n' to create a sample file");
    process.exit(1);
  }
  console.log("ℹ No project l10n.yml files found, using library defaults only");
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
