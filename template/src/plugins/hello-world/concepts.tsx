import React from "react";
import type { InfoModalSection } from "../../components/InfoModal/InfoModal";

export type ConceptKey = "how-plugins-work";

interface ConceptDefinition {
  title: string;
  subtitle: string;
  accentColor: string;
  sections: InfoModalSection[];
  aside?: React.ReactNode;
}

export const concepts: Record<ConceptKey, ConceptDefinition> = {
  "how-plugins-work": {
    title: "How Plugins Work",
    subtitle: "The building blocks of every playground demo",
    accentColor: "#60a5fa",
    sections: [
      {
        title: "Plugin anatomy",
        accent: "#60a5fa",
        content: (
          <>
            <p>
              Every plugin lives in <code>src/plugins/your-name/</code> and
              contains six files:
            </p>
            <ul style={{ paddingLeft: "1.2rem", marginTop: "0.5rem" }}>
              <li>
                <strong>index.ts</strong> — registers the plugin with the
                playground (id, name, steps, reducer).
              </li>
              <li>
                <strong>yourNameSlice.ts</strong> — Redux Toolkit slice for
                local state.
              </li>
              <li>
                <strong>useYourNameAnimation.ts</strong> — a hook that
                orchestrates step-by-step animations.
              </li>
              <li>
                <strong>main.tsx</strong> — the React component that renders
                nodes, edges, and UI using the plugin-kit.
              </li>
              <li>
                <strong>main.scss</strong> — plugin-specific styles.
              </li>
              <li>
                <strong>concepts.tsx</strong> — definitions for the clickable
                info pills.
              </li>
            </ul>
          </>
        ),
      },
      {
        title: "Scaffolding a new plugin",
        accent: "#34d399",
        content: (
          <p>
            Run <code>npm run generate my-plugin --category "My Category"</code>{" "}
            to create all six files and wire the plugin into the registry
            automatically.
          </p>
        ),
      },
    ],
  },
};
