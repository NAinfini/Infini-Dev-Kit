import { createTheme, type MantineThemeOverride } from "@mantine/core";
import { cyberpunkTheme } from "../../themes/cyberpunk";

/**
 * Cyberpunk 2077 Theme - Full Immersion
 *
 * Classic CP2077 palette with neon yellow, electric cyan, and magenta.
 * Features: scanlines, chromatic aberration, glitch effects, HUD corners.
 * Components: chamfered buttons, terminal inputs, HUD panels.
 */
export const cyberpunkMantineTheme: MantineThemeOverride = createTheme({
  primaryColor: "cyan",
  primaryShade: 6,

  colors: {
    // Neon Cyan (Primary)
    cyan: [
      "#E0FCFF", // 0 - lightest
      "#B3F5FF",
      "#80EDFF",
      "#4DE5FF",
      "#1ADDFF",
      "#00D4E0", // 5 - base
      "#00B8C7", // 6 - primary shade
      "#009CAD",
      "#008094",
      "#00647A", // 9 - darkest
    ],
    // Neon Yellow (Secondary)
    yellow: [
      "#FFFCE0",
      "#FFF9B3",
      "#FFF580",
      "#FFF14D",
      "#FFED1A",
      "#FCEE0A", // 5 - base
      "#E0D509",
      "#C4BC08",
      "#A8A307",
      "#8C8A06", // 9
    ],
    // Magenta (Accent/Glitch)
    magenta: [
      "#FFE0F0",
      "#FFB3D9",
      "#FF80C2",
      "#FF4DAB",
      "#FF2A94",
      "#FF2A6D", // 5 - base
      "#E02560",
      "#C42053",
      "#A81B46",
      "#8C1639", // 9
    ],
    // Neon Green (Success)
    green: [
      "#E0FFF4",
      "#B3FFE8",
      "#80FFDC",
      "#4DFFD0",
      "#1AFFC4",
      "#05FFA1", // 5 - base
      "#04E08E",
      "#04C47B",
      "#03A868",
      "#038C55", // 9
    ],
    // Neon Orange (Warning)
    orange: [
      "#FFE8D9",
      "#FFD1B3",
      "#FFBA8C",
      "#FFA366",
      "#FF8C3F",
      "#FF7A00", // 5 - base
      "#E06D00",
      "#C46000",
      "#A85300",
      "#8C4600", // 9
    ],
    // Danger Red-Pink
    red: [
      "#FFE0E6",
      "#FFB3C2",
      "#FF809E",
      "#FF4D7A",
      "#FF3366", // 4 - base
      "#E02E5C",
      "#C42952",
      "#A82448",
      "#8C1F3E",
      "#701A34", // 9
    ],
  },

  fontFamily: "JetBrains Mono, Fira Code, Consolas, monospace",
  fontFamilyMonospace: "JetBrains Mono, Fira Code, Consolas, monospace",
  headings: {
    fontFamily: "Orbitron, Rajdhani, Share Tech Mono, sans-serif",
    fontWeight: "700",
    sizes: {
      h1: { fontSize: "2.5rem", lineHeight: "1.2" },
      h2: { fontSize: "2rem", lineHeight: "1.25" },
      h3: { fontSize: "1.5rem", lineHeight: "1.3" },
      h4: { fontSize: "1.25rem", lineHeight: "1.35" },
      h5: { fontSize: "1.125rem", lineHeight: "1.4" },
      h6: { fontSize: "1rem", lineHeight: "1.45" },
    },
  },

  defaultRadius: "xs", // 2px - minimal radius for cyberpunk
  radius: {
    xs: "2px",
    sm: "4px",
    md: "4px",
    lg: "4px",
    xl: "4px",
  },

  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },

  shadows: {
    xs: "0 0 6px rgba(0,240,255,0.22)",
    sm: "0 0 0 1px rgba(0,240,255,0.35), 0 0 10px rgba(0,240,255,0.24)",
    md: "0 0 0 1px rgba(0,240,255,0.35), 0 0 10px rgba(0,240,255,0.24), 0 0 22px rgba(0,240,255,0.12)",
    lg: "0 0 0 1px rgba(252,238,10,0.45), 0 0 14px rgba(0,240,255,0.3), 0 0 30px rgba(255,42,109,0.2)",
    xl: "0 0 0 1px rgba(0,255,213,0.5), 0 0 16px rgba(0,240,255,0.4), 0 0 34px rgba(255,42,109,0.24)",
  },

  components: {
    Button: {
      defaultProps: {
        size: "md",
      },
      styles: {
        root: {
          fontFamily: "Share Tech Mono, JetBrains Mono, monospace",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          transition: "all 120ms cubic-bezier(0.22, 1, 0.36, 1)",
        },
      },
    },

    TextInput: {
      styles: {
        input: {
          fontFamily: "JetBrains Mono, monospace",
          backgroundColor: "#10101C",
          borderColor: "#2A2A44",
          color: "#E9E9EF",
          "&:focus": {
            borderColor: "#00D4E0",
            boxShadow: "0 0 0 1px #00D4E0, 0 0 8px rgba(0,212,224,0.3)",
          },
        },
        label: {
          fontFamily: "Share Tech Mono, monospace",
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "#B7BAC6",
        },
      },
    },

    NumberInput: {
      styles: {
        input: {
          fontFamily: "JetBrains Mono, monospace",
          backgroundColor: "#10101C",
          borderColor: "#2A2A44",
          color: "#E9E9EF",
          "&:focus": {
            borderColor: "#00D4E0",
            boxShadow: "0 0 0 1px #00D4E0, 0 0 8px rgba(0,212,224,0.3)",
          },
        },
      },
    },

    Select: {
      styles: {
        input: {
          fontFamily: "JetBrains Mono, monospace",
          backgroundColor: "#10101C",
          borderColor: "#2A2A44",
          color: "#E9E9EF",
        },
        dropdown: {
          backgroundColor: "#10101C",
          borderColor: "#2A2A44",
          boxShadow: "0 0 14px rgba(0,240,255,0.16)",
        },
        option: {
          fontFamily: "JetBrains Mono, monospace",
          "&[data-selected]": {
            backgroundColor: "rgba(0,212,224,0.15)",
            color: "#00D4E0",
          },
          "&[data-hovered]": {
            backgroundColor: "rgba(0,212,224,0.08)",
          },
        },
      },
    },

    Card: {
      defaultProps: {
        padding: "lg",
        radius: "xs",
      },
      styles: {
        root: {
          backgroundColor: "#10101C",
          borderColor: "#2A2A44",
          boxShadow: "inset 0 0 0 1px rgba(0,240,255,0.12)",
          transition: "all 200ms cubic-bezier(0.22, 1, 0.36, 1)",
          "&:hover": {
            boxShadow: "inset 0 0 0 1px rgba(0,240,255,0.3), 0 0 12px rgba(0,240,255,0.15)",
          },
        },
      },
    },

    Switch: {
      styles: {
        track: {
          backgroundColor: "#2A2A44",
          borderColor: "#2A2A44",
          "&[data-checked]": {
            backgroundColor: "#00D4E0",
            borderColor: "#00D4E0",
            boxShadow: "0 0 8px rgba(0,240,255,0.4)",
          },
        },
        thumb: {
          borderColor: "#2A2A44",
        },
      },
    },

    Checkbox: {
      styles: {
        input: {
          backgroundColor: "#10101C",
          borderColor: "#2A2A44",
          "&:checked": {
            backgroundColor: "#00D4E0",
            borderColor: "#00D4E0",
          },
        },
        label: {
          fontFamily: "JetBrains Mono, monospace",
          color: "#E9E9EF",
        },
      },
    },

    Radio: {
      styles: {
        radio: {
          backgroundColor: "#10101C",
          borderColor: "#2A2A44",
          "&:checked": {
            backgroundColor: "#00D4E0",
            borderColor: "#00D4E0",
          },
        },
        label: {
          fontFamily: "JetBrains Mono, monospace",
          color: "#E9E9EF",
        },
      },
    },

    Slider: {
      styles: {
        track: {
          backgroundColor: "#2A2A44",
        },
        bar: {
          backgroundColor: "#00D4E0",
        },
        thumb: {
          backgroundColor: "#00D4E0",
          borderColor: "#00D4E0",
          boxShadow: "0 0 8px rgba(0,240,255,0.4)",
        },
      },
    },

    Progress: {
      styles: {
        root: {
          backgroundColor: "#2A2A44",
        },
        bar: {
          backgroundColor: "#FCEE0A",
          boxShadow: "0 0 10px rgba(252,238,10,0.4)",
        },
      },
    },

    Rating: {
      styles: {
        symbolBody: {
          color: "#2A2A44",
        },
        symbolGroup: {
          "&[data-filled]": {
            color: "#FCEE0A",
            filter: "drop-shadow(0 0 4px rgba(252,238,10,0.5))",
          },
        },
      },
    },

    SegmentedControl: {
      styles: {
        root: {
          backgroundColor: "#10101C",
          borderColor: "#2A2A44",
        },
        label: {
          fontFamily: "Share Tech Mono, monospace",
          fontSize: "0.875rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "#B7BAC6",
          "&[data-active]": {
            color: "#00D4E0",
          },
        },
        indicator: {
          backgroundColor: "rgba(0,212,224,0.15)",
          boxShadow: "0 0 8px rgba(0,240,255,0.3)",
        },
      },
    },

    Modal: {
      styles: {
        content: {
          backgroundColor: "#10101C",
          borderColor: "#2A2A44",
          boxShadow: "0 0 0 1px rgba(0,240,255,0.3), 0 0 30px rgba(0,240,255,0.2)",
        },
        header: {
          backgroundColor: "#10101C",
          borderBottom: "1px solid #2A2A44",
        },
        title: {
          fontFamily: "Orbitron, sans-serif",
          color: "#E9E9EF",
        },
        overlay: {
          backgroundColor: "rgba(7, 7, 12, 0.82)",
          backdropFilter: "blur(4px)",
        },
      },
    },

    Notification: {
      styles: {
        root: {
          backgroundColor: "#10101C",
          borderColor: "#2A2A44",
          boxShadow: "0 0 0 1px rgba(0,240,255,0.3), 0 0 20px rgba(0,240,255,0.15)",
        },
        title: {
          fontFamily: "Share Tech Mono, monospace",
          color: "#E9E9EF",
        },
        description: {
          fontFamily: "JetBrains Mono, monospace",
          color: "#B7BAC6",
        },
      },
    },
  },

  other: {
    themeId: "cyberpunk",
    motion: cyberpunkTheme.motion,
    effects: cyberpunkTheme.effects,
    typography: cyberpunkTheme.typography,
    button: cyberpunkTheme.button,
  },
});


