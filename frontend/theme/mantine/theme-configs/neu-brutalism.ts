import { createTheme, type MantineThemeOverride } from "@mantine/core";
import { neuBrutalismTheme } from "../../themes/neu-brutalism";

/**
 * Neo-Brutalism Theme - Maximum Chaos
 *
 * Rebellious design with thick borders, hard shadows, and sticker layering.
 * Features: 4px black borders, offset shadows, rotated elements, halftone patterns.
 * Components: mechanical press, brutal cards, aggressive contrast.
 */
export const neuBrutalismMantineTheme: MantineThemeOverride = createTheme({
  primaryColor: "red",
  primaryShade: 5,

  colors: {
    // Hot Red (Accent)
    red: [
      "#FFE8E8", // 0
      "#FFD1D1",
      "#FFBABA",
      "#FFA3A3",
      "#FF8C8C",
      "#FF6B6B", // 5 - base (primary shade)
      "#E06060",
      "#C45555",
      "#A84A4A",
      "#8C3F3F", // 9
    ],
    // Vivid Yellow (Secondary)
    yellow: [
      "#FFF9E0",
      "#FFF3B3",
      "#FFED80",
      "#FFE74D",
      "#FFE11A",
      "#FFD93D", // 5 - base
      "#E0C237",
      "#C4AB31",
      "#A8942B",
      "#8C7D25", // 9
    ],
    // Soft Violet (Muted)
    violet: [
      "#EDE8FF",
      "#D4C9FF",
      "#C4B5FD", // 2 - base
      "#B5A6F0",
      "#A697E3",
      "#9788D6",
      "#8879C9",
      "#796ABC",
      "#6A5BAF",
      "#5B4CA2", // 9
    ],
  },

  white: "#FFFDF5", // Cream/Off-White
  black: "#000000", // Pure Black

  fontFamily: "Space Grotesk, sans-serif",
  fontFamilyMonospace: "JetBrains Mono, monospace",
  headings: {
    fontFamily: "Space Grotesk, sans-serif",
    fontWeight: "900",
    sizes: {
      h1: { fontSize: "4rem", lineHeight: "0.95" },
      h2: { fontSize: "3rem", lineHeight: "1" },
      h3: { fontSize: "2.25rem", lineHeight: "1.1" },
      h4: { fontSize: "1.75rem", lineHeight: "1.15" },
      h5: { fontSize: "1.5rem", lineHeight: "1.2" },
      h6: { fontSize: "1.25rem", lineHeight: "1.25" },
    },
  },

  defaultRadius: 0, // Sharp corners
  radius: {
    xs: "0px",
    sm: "0px",
    md: "0px",
    lg: "0px",
    xl: "9999px", // Only for pills/badges
  },

  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },

  shadows: {
    xs: "4px 4px 0px 0px #000",
    sm: "6px 6px 0px 0px #000",
    md: "8px 8px 0px 0px #000",
    lg: "12px 12px 0px 0px #000",
    xl: "16px 16px 0px 0px #000",
  },

  components: {
    Button: {
      defaultProps: {
        size: "md",
        radius: 0,
      },
      styles: {
        root: {
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          border: "4px solid #000",
          boxShadow: "6px 6px 0px 0px #000",
          transition: "all 100ms ease-linear",
          "&:hover": {
            transform: "translate(-2px, -2px)",
            boxShadow: "8px 8px 0px 0px #000",
          },
          "&:active": {
            transform: "translate(2px, 2px)",
            boxShadow: "4px 4px 0px 0px #000",
          },
        },
      },
    },

    TextInput: {
      defaultProps: {
        radius: 0,
      },
      styles: {
        input: {
          backgroundColor: "#FFFFFF",
          border: "4px solid #000",
          color: "#000",
          fontWeight: 700,
          fontSize: "1.125rem",
          height: "56px",
          transition: "all 100ms ease-linear",
          "&:focus": {
            backgroundColor: "#FFD93D",
            boxShadow: "4px 4px 0px 0px #000",
            outline: "none",
          },
          "&::placeholder": {
            color: "rgba(0,0,0,0.4)",
            fontWeight: 700,
          },
        },
        label: {
          fontWeight: 900,
          fontSize: "0.875rem",
          color: "#000",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: "0.5rem",
        },
      },
    },

    NumberInput: {
      defaultProps: {
        radius: 0,
      },
      styles: {
        input: {
          backgroundColor: "#FFFFFF",
          border: "4px solid #000",
          color: "#000",
          fontWeight: 700,
          fontSize: "1.125rem",
          height: "56px",
          fontFamily: "Space Grotesk, sans-serif",
          "&:focus": {
            backgroundColor: "#FFD93D",
            boxShadow: "4px 4px 0px 0px #000",
          },
        },
      },
    },

    Select: {
      defaultProps: {
        radius: 0,
      },
      styles: {
        input: {
          backgroundColor: "#FFFFFF",
          border: "4px solid #000",
          color: "#000",
          fontWeight: 700,
          fontSize: "1.125rem",
          height: "56px",
        },
        dropdown: {
          backgroundColor: "#FFFFFF",
          border: "4px solid #000",
          boxShadow: "8px 8px 0px 0px #000",
        },
        option: {
          fontWeight: 700,
          color: "#000",
          "&[data-selected]": {
            backgroundColor: "#FF6B6B",
            color: "#FFFFFF",
          },
          "&[data-hovered]": {
            backgroundColor: "#FFD93D",
            color: "#000",
          },
        },
      },
    },

    Autocomplete: {
      defaultProps: {
        radius: 0,
      },
      styles: {
        input: {
          backgroundColor: "#FFFFFF",
          border: "4px solid #000",
          color: "#000",
          fontWeight: 700,
          fontSize: "1.125rem",
          height: "56px",
        },
      },
    },

    Card: {
      defaultProps: {
        padding: "xl",
        radius: 0,
      },
      styles: {
        root: {
          backgroundColor: "#FFFFFF",
          border: "4px solid #000",
          boxShadow: "8px 8px 0px 0px #000",
          transition: "all 200ms ease-linear",
          "&:hover": {
            transform: "translate(-2px, -2px)",
            boxShadow: "12px 12px 0px 0px #000",
          },
        },
      },
    },

    Switch: {
      styles: {
        track: {
          backgroundColor: "#FFFFFF",
          border: "3px solid #000",
          cursor: "pointer",
          "&[data-checked]": {
            backgroundColor: "#FF6B6B",
            borderColor: "#000",
          },
        },
        thumb: {
          backgroundColor: "#000",
          border: "none",
        },
      },
    },

    Checkbox: {
      styles: {
        input: {
          backgroundColor: "#FFFFFF",
          border: "3px solid #000",
          cursor: "pointer",
          "&:checked": {
            backgroundColor: "#FF6B6B",
            borderColor: "#000",
          },
        },
        label: {
          fontWeight: 700,
          color: "#000",
          cursor: "pointer",
        },
      },
    },

    Radio: {
      styles: {
        radio: {
          backgroundColor: "#FFFFFF",
          border: "3px solid #000",
          cursor: "pointer",
          "&:checked": {
            backgroundColor: "#FFFFFF",
            borderColor: "#000",
            "&::before": {
              backgroundColor: "#FF6B6B",
            },
          },
        },
        label: {
          fontWeight: 700,
          color: "#000",
          cursor: "pointer",
        },
      },
    },

    Slider: {
      styles: {
        track: {
          backgroundColor: "#000",
          height: "8px",
          border: "2px solid #000",
        },
        bar: {
          backgroundColor: "#FF6B6B",
        },
        thumb: {
          backgroundColor: "#FFD93D",
          border: "3px solid #000",
          width: "24px",
          height: "24px",
          boxShadow: "4px 4px 0px 0px #000",
        },
      },
    },

    Progress: {
      defaultProps: {
        radius: 0,
      },
      styles: {
        root: {
          backgroundColor: "#FFFFFF",
          border: "3px solid #000",
          height: "24px",
        },
        bar: {
          backgroundColor: "#FF6B6B",
        },
      },
    },

    Rating: {
      styles: {
        symbolBody: {
          color: "#FFFFFF",
          stroke: "#000",
          strokeWidth: "2px",
        },
        symbolGroup: {
          "&[data-filled]": {
            color: "#FFD93D",
            stroke: "#000",
            strokeWidth: "2px",
          },
        },
      },
    },

    SegmentedControl: {
      defaultProps: {
        radius: 0,
      },
      styles: {
        root: {
          backgroundColor: "#FFFFFF",
          border: "4px solid #000",
          padding: "4px",
        },
        label: {
          fontWeight: 900,
          fontSize: "0.875rem",
          color: "#000",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          padding: "0.5rem 1rem",
          "&[data-active]": {
            color: "#FFFFFF",
          },
        },
        indicator: {
          backgroundColor: "#FF6B6B",
          boxShadow: "4px 4px 0px 0px #000",
          border: "3px solid #000",
        },
      },
    },

    Modal: {
      defaultProps: {
        radius: 0,
      },
      styles: {
        content: {
          backgroundColor: "#FFFFFF",
          border: "4px solid #000",
          boxShadow: "16px 16px 0px 0px #000",
        },
        header: {
          backgroundColor: "#FFD93D",
          borderBottom: "4px solid #000",
          padding: "1.5rem",
        },
        title: {
          fontWeight: 900,
          fontSize: "2rem",
          color: "#000",
          textTransform: "uppercase",
        },
        overlay: {
          backgroundColor: "rgba(255, 253, 245, 0.9)",
        },
      },
    },

    Notification: {
      defaultProps: {
        radius: 0,
      },
      styles: {
        root: {
          backgroundColor: "#FFFFFF",
          border: "4px solid #000",
          boxShadow: "8px 8px 0px 0px #000",
        },
        title: {
          fontWeight: 900,
          color: "#000",
          textTransform: "uppercase",
        },
        description: {
          color: "#000",
          fontWeight: 700,
        },
      },
    },

    Badge: {
      defaultProps: {
        radius: "xl",
      },
      styles: {
        root: {
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontSize: "0.75rem",
          border: "3px solid #000",
          boxShadow: "4px 4px 0px 0px #000",
          padding: "0.5rem 1rem",
        },
      },
    },
  },

  other: {
    themeId: "neu-brutalism",
    motion: neuBrutalismTheme.motion,
    effects: neuBrutalismTheme.effects,
    typography: neuBrutalismTheme.typography,
    button: neuBrutalismTheme.button,
  },
});


