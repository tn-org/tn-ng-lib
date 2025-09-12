#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const readline = require("readline");

class VersionUpdater {
  constructor() {
    this.packageJsonPath = path.join(process.cwd(), "package.json");
    this.changelogPath = path.join(process.cwd(), "CHANGELOG.md");
    this.changes = [];
  }

  parseVersion(version) {
    const [major, minor, patch] = version.split(".").map(Number);
    return { major, minor, patch };
  }

  formatVersion(major, minor, patch) {
    return `${major}.${minor}.${patch}`;
  }

  incrementVersion(version, type) {
    const { major, minor, patch } = this.parseVersion(version);

    switch (type) {
      case "patch":
        return this.formatVersion(major, minor, patch + 1);
      case "minor":
        return this.formatVersion(major, minor + 1, 0);
      case "major":
        return this.formatVersion(major + 1, 0, 0);
      default:
        throw new Error(`Invalid version type: ${type}`);
    }
  }

  getCurrentVersion() {
    const packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, "utf8"));
    return packageJson.version;
  }

  updatePackageJson(newVersion) {
    const packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, "utf8"));
    packageJson.version = newVersion;
    fs.writeFileSync(this.packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
  }

  updateChangelog(version, versionType) {
    if (!fs.existsSync(this.changelogPath) || this.changes.length === 0) {
      return;
    }

    const content = fs.readFileSync(this.changelogPath, "utf8");
    const today = new Date().toISOString().split("T")[0];

    let sectionType;
    if (versionType === "major") {
      sectionType = "Changed";
    } else if (versionType === "minor") {
      sectionType = "Added";
    } else {
      sectionType = "Fixed";
    }

    let newEntry = `## [${version}] - ${today}\n\n`;
    newEntry += `### ${sectionType}\n\n`;
    this.changes.forEach((change) => {
      newEntry += `- ${change}\n`;
    });
    newEntry += "\n";

    const lines = content.split("\n");
    let insertIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("## [") && !lines[i].includes("Unreleased")) {
        insertIndex = i;
        break;
      }
    }

    if (insertIndex === -1) {
      insertIndex = lines.findIndex((line) => line.trim() === "") + 1;
    }

    const newEntryLines = newEntry.split("\n");
    lines.splice(insertIndex, 0, ...newEntryLines);
    fs.writeFileSync(this.changelogPath, lines.join("\n"));
  }

  showVersionSelection() {
    const currentVersion = this.getCurrentVersion();
    const patchVersion = this.incrementVersion(currentVersion, "patch");
    const minorVersion = this.incrementVersion(currentVersion, "minor");
    const majorVersion = this.incrementVersion(currentVersion, "major");

    const options = [`Patch -> ${patchVersion}`, `Minor -> ${minorVersion}`, `Major -> ${majorVersion}`];

    const versionTypes = ["patch", "minor", "major"];
    const newVersions = [patchVersion, minorVersion, majorVersion];

    return new Promise((resolve) => {
      let selectedIndex = 0;

      const render = () => {
        console.clear();
        console.log("Select the version type (arrow keys and Enter to select):\n");
        console.log(`Current version: ${currentVersion}\n`);

        options.forEach((option, index) => {
          const marker = index === selectedIndex ? "❯" : " ";
          console.log(`${marker} ${option}`);
        });
      };

      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.setEncoding("utf8");

      render();

      process.stdin.on("data", (key) => {
        if (key === "\u0003" || key === "q" || key === "\u001b") {
          process.exit();
        }

        if (key === "\u001b[A" && selectedIndex > 0) {
          selectedIndex--;
          render();
        }

        if (key === "\u001b[B" && selectedIndex < options.length - 1) {
          selectedIndex++;
          render();
        }

        if (key === "\r") {
          process.stdin.setRawMode(false);
          resolve({
            versionType: versionTypes[selectedIndex],
            newVersion: newVersions[selectedIndex],
            currentVersion: currentVersion,
          });
        }
      });
    });
  }

  async collectChanges(versionInfo) {
    console.clear();
    console.log(
      `選択: ${versionInfo.versionType}バージョン更新 (${versionInfo.currentVersion} -> ${versionInfo.newVersion})\n`
    );
    console.log("変更内容を入力してください（1行ずつ入力、空行で完了）:\n");

    return new Promise((resolve) => {
      let index = 1;

      const askForChange = () => {
        // 毎回新しいreadlineインスタンスを作成
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        rl.question(`${index}. `, (answer) => {
          rl.close(); // すぐにクローズ
          
          if (answer.trim() === "") {
            resolve();
          } else {
            this.changes.push(answer.trim());
            index++;
            askForChange();
          }
        });
      };

      askForChange();
    });
  }

  async run() {
    try {
      const versionInfo = await this.showVersionSelection();
      await this.collectChanges(versionInfo);

      this.updatePackageJson(versionInfo.newVersion);

      if (this.changes.length > 0) {
        this.updateChangelog(versionInfo.newVersion, versionInfo.versionType);
      }

      console.log(
        `\n✓ ${versionInfo.versionType}バージョンを ${versionInfo.currentVersion} から ${versionInfo.newVersion} に更新しました。`
      );

      if (this.changes.length > 0) {
        console.log("✓ CHANGELOG.md を更新しました。");
        console.log("\n追加された変更内容:");
        this.changes.forEach((change, i) => {
          console.log(`  ${i + 1}. ${change}`);
        });
      } else {
        console.log("変更内容は追加されませんでした。");
      }
    } catch (error) {
      console.error("エラーが発生しました:", error.message);
      process.exit(1);
    }
  }
}

if (require.main === module) {
  const updater = new VersionUpdater();
  updater.run();
}
