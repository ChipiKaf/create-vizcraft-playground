import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, "..");

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

// ── Main ───────────────────────────────────────────────────
async function main() {
  console.log("");
  console.log("╔═══════════════════════════════════════════════╗");
  console.log("║       VizCraft Playground — Init Wizard       ║");
  console.log("╚═══════════════════════════════════════════════╝");
  console.log("");
  console.log("  Configure your playground branding.");
  console.log("");

  const title = await ask("  Playground title", "My Playground");
  const subtitle = await ask(
    "  Subtitle (one-liner for the landing page)",
    "Explore interactive visualizations.",
  );
  const accent = await ask("  Primary accent colour (hex)", "#3b82f6");
  const slug = toSlug(title);

  console.log("");

  // ── 1. Write playground.config.ts ──────────────────────
  const configPath = path.join(root, "src/playground.config.ts");
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
  fs.writeFileSync(configPath, configContent);
  console.log("  ✔ src/playground.config.ts");

  // ── 2. Update package.json name ────────────────────────
  const pkgPath = path.join(root, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  pkg.name = slug;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log("  ✔ package.json  (name → " + slug + ")");

  // ── 3. Update index.html <title> ──────────────────────
  const htmlPath = path.join(root, "index.html");
  let html = fs.readFileSync(htmlPath, "utf-8");
  html = html.replace(/<title>.*<\/title>/, "<title>" + title + "</title>");
  fs.writeFileSync(htmlPath, html);
  console.log("  ✔ index.html  (title → " + title + ")");

  // ── 4. Update README headline + subtitle ───────────────
  const readmePath = path.join(root, "README.md");
  if (fs.existsSync(readmePath)) {
    let readme = fs.readFileSync(readmePath, "utf-8");
    readme = readme.replace(/^# .*$/m, "# " + title);
    fs.writeFileSync(readmePath, readme);
    console.log("  ✔ README.md");
  }

  console.log("");
  console.log("  All done! Run `npm run dev` to start.");
  console.log("");

  rl.close();
}

main().catch((err) => {
  console.error(err);
  rl.close();
  process.exit(1);
});
