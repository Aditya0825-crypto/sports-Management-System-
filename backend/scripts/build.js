const { readdirSync, statSync } = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.join(__dirname, "..");
const ignoredDirs = new Set(["node_modules", "uploads", "scripts"]);

function collectJsFiles(dir) {
  const entries = readdirSync(dir);
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      if (!ignoredDirs.has(entry)) {
        files.push(...collectJsFiles(fullPath));
      }
      continue;
    }

    if (fullPath.endsWith(".js")) {
      files.push(fullPath);
    }
  }

  return files;
}

const files = collectJsFiles(root);
if (files.length === 0) {
  console.log("No backend JS files found to validate.");
  process.exit(0);
}

for (const file of files) {
  const check = spawnSync(process.execPath, ["--check", file], {
    stdio: "inherit",
  });

  if (check.status !== 0) {
    console.error(`\nBuild validation failed at: ${file}`);
    process.exit(check.status || 1);
  }
}

console.log(`Backend build validation passed (${files.length} files checked).`);
