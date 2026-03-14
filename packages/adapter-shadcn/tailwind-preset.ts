import type { ThemeId } from "@infini-dev-kit/theme-core";
import { buildShadcnVariables } from "./shadcn-variables";

/**
 * Create a Tailwind CSS preset that wires Infini theme colors into
 * shadcn/ui's expected CSS variable contract.
 *
 * Usage in tailwind.config.ts:
 *
 *   import { infiniTailwindPreset } from "@infini-dev-kit/adapter-shadcn";
 *   export default {
 *     presets: [infiniTailwindPreset("cyberpunk")],
 *     content: ["./src/STAR-STAR/STAR.tsx"],  // use actual glob
 *   };
 *
 * The preset injects a base layer rule with all --background,
 * --primary, etc. variables so shadcn components pick them up
 * automatically. No manual CSS editing required.
 */
export function infiniTailwindPreset(themeId: ThemeId) {
  const vars = buildShadcnVariables(themeId);

  return {
    theme: {
      extend: {
        colors: {
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
          popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
          primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
          secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
          muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
          accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
          destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
          border: "hsl(var(--border))",
          input: "hsl(var(--input))",
          ring: "hsl(var(--ring))",
        },
        borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
        },
      },
    },
    plugins: [
      // Inject CSS variables into :root via a Tailwind plugin
      function ({ addBase }: { addBase: (styles: Record<string, Record<string, string>>) => void }) {
        addBase({ ":root": Object.fromEntries(Object.entries(vars).map(([k, v]) => [k, v])) });
      },
    ],
  };
}
