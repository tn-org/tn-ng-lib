#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read root package.json
const rootPackageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Read library package.json
const libPackageJsonPath = 'projects/@tnlake/tn-ng-lib/package.json';
const libPackageJson = JSON.parse(fs.readFileSync(libPackageJsonPath, 'utf8'));

// Sync version
libPackageJson.version = rootPackageJson.version;

// Write back to library package.json
fs.writeFileSync(libPackageJsonPath, JSON.stringify(libPackageJson, null, 2) + '\n');

console.log(`✅ Version synced: ${rootPackageJson.version}`);