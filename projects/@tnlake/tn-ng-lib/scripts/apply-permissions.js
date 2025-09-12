#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const stComment = "<!-- MANAGED PERMISSIONS START -->";
const edComment = "<!-- MANAGED PERMISSIONS END -->";

function createDefaultPermissionsJson(permissionsPath) {
  const defaultPermissions = {
    ios: {},
    android: {
      permissions: [],
      features: [],
    },
  };

  fs.writeFileSync(permissionsPath, JSON.stringify(defaultPermissions, null, 2));

  console.log("📄 Created default permissions.json");
  console.log("");
  console.log("🔧 Please edit permissions.json to customize your app permissions:");
  console.log("   - iOS: Add NSUsageDescription strings with your app-specific messages");
  console.log("   - Android: Add permissions and features as needed");
  console.log("");
  console.log("📖 Common iOS permission keys:");
  console.log("   - NSCameraUsageDescription (camera access)");
  console.log("   - NSPhotoLibraryUsageDescription (photo library access)");
  console.log("   - NSLocationWhenInUseUsageDescription (location access)");
  console.log("   - NSMicrophoneUsageDescription (microphone access)");
  console.log("");
  console.log("📖 Common Android permissions:");
  console.log("   - android.permission.CAMERA");
  console.log("   - android.permission.ACCESS_FINE_LOCATION");
  console.log("   - android.permission.RECORD_AUDIO");
  console.log("");
  console.log("✨ Run tn-permissions again after editing permissions.json");
  console.log("");
}

function applyIosPermissions(permissions) {
  const iosInfoPlistPath = path.join(process.cwd(), "ios", "App", "App", "Info.plist");
  const iosPermissions = permissions.ios;

  // 既存のInfo.plistを読み込んで権限を追加
  if (fs.existsSync(iosInfoPlistPath)) {
    let existingContent = fs.readFileSync(iosInfoPlistPath, "utf8");

    // 新しい権限エントリを作成
    const permissionEntries = Object.entries(iosPermissions)
      .map(([key, value]) => `\t<key>${key}</key>\n\t<string>${value}</string>`)
      .join("\n");

    const managedSection = `${stComment}\n${permissionEntries}\n\t${edComment}`;

    // 既存の管理セクションがあるかチェック
    if (existingContent.includes(stComment) && existingContent.includes(edComment)) {
      // 既存の管理セクションを置き換え
      const managedPattern = new RegExp(`${stComment}[\\s\\S]*?${edComment}`, "g");
      existingContent = existingContent.replace(managedPattern, managedSection);
    } else {
      // 管理セクションがない場合は新規追加
      existingContent = existingContent.replace("</dict>\n</plist>", `${managedSection}\n</dict>\n</plist>`);
    }

    fs.writeFileSync(iosInfoPlistPath, existingContent);
    console.log("✅ iOS permissions updated in ios/App/App/Info.plist");
  } else {
    console.log("⚠️  iOS platform not found. Run `npx cap add ios` first.");
  }
}

function applyAndroidPermissions(permissions) {
  const androidManifestPath = path.join(process.cwd(), "android", "app", "src", "main", "AndroidManifest.xml");
  const androidConfig = permissions.android;

  // 既存のAndroidManifest.xmlを読み込んで権限を追加
  if (fs.existsSync(androidManifestPath)) {
    let existingContent = fs.readFileSync(androidManifestPath, "utf8");

    // 新しい権限とフィーチャーエントリを作成
    const permissionEntries = androidConfig.permissions
      .map((permission) => `    <uses-permission android:name="${permission}" />`)
      .join("\n");

    const featureEntries = androidConfig.features
      .map((feature) => `    <uses-feature android:name="${feature.name}" android:required="${feature.required}" />`)
      .join("\n");

    const managedSection = `${stComment}\n${permissionEntries}\n\n${featureEntries}\n    ${edComment}`;

    // 既存の管理セクションがあるかチェック
    if (existingContent.includes(stComment) && existingContent.includes(edComment)) {
      // 既存の管理セクションを置き換え
      const managedPattern = new RegExp(`${stComment}[\\s\\S]*?${edComment}`, "g");
      existingContent = existingContent.replace(managedPattern, managedSection);
    } else {
      // 管理セクションがない場合は新規追加
      if (existingContent.includes("<application")) {
        existingContent = existingContent.replace("<application", `${managedSection}\n\n    <application`);
      } else {
        existingContent = existingContent.replace("</manifest>", `${managedSection}\n\n</manifest>`);
      }
    }

    fs.writeFileSync(androidManifestPath, existingContent);
    console.log("✅ Android permissions updated in android/app/src/main/AndroidManifest.xml");
  } else {
    console.log("⚠️  Android platform not found. Run `npx cap add android` first.");
  }
}

function main() {
  const permissionsPath = path.join(process.cwd(), "permissions.json");

  // permissions.jsonが存在しない場合は作成
  if (!fs.existsSync(permissionsPath)) {
    createDefaultPermissionsJson(permissionsPath);
    return;
  }

  console.log("🚀 Applying permissions to platforms...");

  try {
    const permissions = JSON.parse(fs.readFileSync(permissionsPath, "utf8"));

    // iOS権限の適用
    console.log("📱 Applying iOS permissions...");
    applyIosPermissions(permissions);

    // Android権限の適用
    console.log("🤖 Applying Android permissions...");
    applyAndroidPermissions(permissions);

    console.log("✅ All permissions applied successfully!");
  } catch (error) {
    console.error("❌ Error applying permissions:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
