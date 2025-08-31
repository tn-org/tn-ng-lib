#!/usr/bin/env node

const fs = require("fs");
const yaml = require("js-yaml");
const path = require("path");

const sourcePath = "./src/assets/l10n.yml";
const outputDir = "./src/assets/dist/l10n";

const yamlData = yaml.load(fs.readFileSync(sourcePath, "utf8"));

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
