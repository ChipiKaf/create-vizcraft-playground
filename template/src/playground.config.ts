/* ═══════════════════════════════════════════════════════
 *  Playground Configuration
 *
 *  Single source of truth for branding & metadata.
 *  Run `npm run init` to regenerate this file interactively,
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
  name: "vizcraft-playground",
  title: "VizCraft Playground",
  subtitle: "Explore interactive visualizations.",
  accent: "#3b82f6",
};

export default playgroundConfig;
