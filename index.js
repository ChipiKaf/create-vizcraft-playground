#!/usr/bin/env node

import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templateDir = path.join(__dirname, "template");

// ── Readline helpers ───────────────────────────────────────
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question, fallback) =>
  new Promise((resolve) => {
    const suffix = fallback ? ` (${fallback}): ` : ": ";
    rl.question(question + suffix, (answer) => {
      resolve(answer.trim() || fallback || "");
    });
  });

// ── Helpers ────────────────────────────────────────────────
const toSlug = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// ── Main ───────────────────────────────────────────────────
async function main() {
  const projectArg = process.argv[2];

  console.log("");
  console.log("╔═══════════════════════════════════════════════╗");
  console.log("║    create-vizcraft-playground                 ║");
  console.log("║    Scaffold a new interactive playground      ║");
  console.log("╚═══════════════════════════════════════════════╝");
  console.log("");

  // ── Project directory ──────────────────────────────────
  const projectName =
    projectArg || (await ask("  Project directory name", "my-playground"));
  const targetDir = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
    console.error(`\n  ✖ Directory "${projectName}" already exists and is not empty.\n`);
    rl.close();
    process.exit(1);
  }

  // ── Prompts ────────────────────────────────────────────
  const title = await ask("  Playground title", projectName.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()));
  const subtitle = await ask(
    "  Subtitle (one-liner for the landing page)",
    "Explore interactive visualizations.",
  );
  const accent = await ask("  Primary accent colour (hex)", "#3b82f6");
  const slug = toSlug(title);

  console.log("");
  console.log("  ─── Summary ───────────────────────────────");
  console.log("  Directory : " + projectName);
  console.log("  Title     : " + title);
  console.log("  Subtitle  : " + subtitle);
  console.log("  Accent    : " + accent);
  console.log("  ────────────────────────────────────────────");
  console.log("");

  // ── 1. Copy template ──────────────────────────────────
  console.log("  Scaffolding project…");
  copyDirSync(templateDir, targetDir);
  console.log("  ✔ Copied template");

  // ── 2. Write playground.config.ts ──────────────────────
  const configContent = `/* ═══════════════════════════════════════════════════════
 *  Playground Configuration
 *
 *  Single source of truth for branding & metadata.
 *  Run \`npm run init\` to regenerate this file interactively,
 *  or edit the values below directly.
 * ═══════════════════════════════════════════════════════ */

export interface PlaygroundConfig {
  /** Project slug (kebab-case), used in package.json name */
  name: string;
  /** Display title shown on the landing page */
  title: string;
  /** One-liner shown below the title on the landing page */
  subtitle: string;
  /** Primary accent colour (hex) */
  accent: string;
}

const playgroundConfig: PlaygroundConfig = {
  name: "${slug}",
  title: "${title.replace(/"/g, '\\"')}",
  subtitle:
    "${subtitle.replace(/"/g, '\\"')}",
  accent: "${accent}",
};

export default playgroundConfig;
`;
  fs.writeFileSync(path.join(targetDir, "src/playground.config.ts"), configContent);
  console.log("  ✔ Configured playground.config.ts");

  // ── 3. Update package.json ─────────────────────────────
  const pkgPath = path.join(targetDir, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  pkg.name = slug;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log("  ✔ Set package.json name → " + slug);

  // ── 4. Update index.html <title> ──────────────────────
  const htmlPath = path.join(targetDir, "index.html");
  let html = fs.readFileSync(htmlPath, "utf-8");
  html = html.replace(/<title>.*<\/title>/, "<title>" + title + "</title>");
  fs.writeFileSync(htmlPath, html);
  console.log("  ✔ Set index.html title → " + title);

  // ── 5. Update README ──────────────────────────────────
  const readmePath = path.join(targetDir, "README.md");
  let readme = fs.readFileSync(readmePath, "utf-8");
  readme = readme.replace(/^# .*$/m, "# " + title);
  readme = readme.replace(
    /^Explore interactive visualizations\.$/m,
    subtitle,
  );
  fs.writeFileSync(readmePath, readme);
  console.log("  ✔ Updated README.md");

  // ── Done ──────────────────────────────────────────────
  console.log("");
  console.log("  ✔ Project ready at ./" + projectName);
  console.log("");
  console.log("  Next steps:");
  console.log("");
  console.log("    cd " + projectName);
  console.log("    npm install");
  console.log("    npm run dev");
  console.log("");
  console.log("  Then scaffold your first plugin:");
  console.log("");
  console.log('    npm run generate my-concept --category "My Category"');
  console.log("");

  rl.close();
}

main().catch((err) => {
  console.error(err);
  rl.close();
  process.exit(1);
});
