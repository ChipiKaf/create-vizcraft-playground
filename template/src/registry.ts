import type { DemoPlugin } from "./types/ModelPlugin";
import HelloWorldPlugin from "./plugins/hello-world";

/* ──────────────────────────────────────────────────────────
 *  Plugin Category Registry
 *
 *  To add a new category:
 *    1. Push a new PluginCategory into `categories` below.
 *
 *  To add a plugin to an existing category:
 *    1. Import the plugin.
 *    2. Add it to the `plugins` array of the target category.
 *
 *  The store, routes, and landing page all derive from this
 *  single source of truth — no other files need to change.
 * ────────────────────────────────────────────────────────── */

export interface PluginCategory {
  /** URL slug, e.g. "system-design" */
  id: string;
  /** Display name shown on the landing page */
  name: string;
  /** One-liner for the landing card */
  description: string;
  /** Accent colour for the card / heading */
  accent: string;
  /** Plugins that belong to this category */
  plugins: DemoPlugin[];
}

export const categories: PluginCategory[] = [
  {
    id: "examples",
    name: "Examples",
    description:
      "Reference plugins that demonstrate how the playground engine works.",
    accent: "#6366f1",
    plugins: [HelloWorldPlugin],
  },
];

/* ── Helpers ─────────────────────────────────────────────── */

/** Flat list of every registered plugin. */
export const allPlugins: DemoPlugin[] = categories.flatMap((c) => c.plugins);

/** kebab-case → camelCase  ("event-streaming" → "eventStreaming") */
export const toCamelCase = (s: string) =>
  s.replace(/-(\w)/g, (_, c: string) => c.toUpperCase());

/**
 * Build a `{ [camelKey]: reducer }` map for configureStore.
 */
export const pluginReducerMap = Object.fromEntries(
  allPlugins.map((p) => [toCamelCase(p.id), p.reducer]),
);

/** Look up which category a plugin belongs to. */
export function categoryForPlugin(
  pluginId: string,
): PluginCategory | undefined {
  return categories.find((c) => c.plugins.some((p) => p.id === pluginId));
}

/** Look up a plugin by id. */
export function findPlugin(pluginId: string): DemoPlugin | undefined {
  return allPlugins.find((p) => p.id === pluginId);
}

/** Look up a category by id. */
export function findCategory(categoryId: string): PluginCategory | undefined {
  return categories.find((c) => c.id === categoryId);
}
