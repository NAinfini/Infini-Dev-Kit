import { createTheme, type MantineThemeOverride } from "@mantine/core";
import { chibiTheme } from "../../themes/chibi";

/**
 * Chibi/Kawaii Theme - Squishy Pill Style
 *
 * Pastel colors with soft shadows and bouncy animations.
 * Features: rounded buttons, squish press effects, sticker badges, polka dots.
 * Components: candy buttons, soft rectangles, bubble inputs.
 */
export const chibiMantineTheme: MantineThemeOverride = createTheme({
  primaryColor: "pink",
  primaryShade: 5,

  colors: {
    // Strawberry Pink (Primary)
    pink: [
      "#FFE0F0", // 0 - lightest
      "#FFB3D9",
      "#FF99CC",
      "#FF80BF",
      "#FF99C2",
      "#FF7EB6", // 5 - base (primary shade)
      "#E06FA3",
      "#C46090",
      "#A8517D",
      "#8C426A", // 9 - darkest
    ],
    // Sky Pop Blue (Secondary)
    blue: [
      "#E0EEFF",
      "#B3D7FF",
      "#80C0FF",
      "#4DA9FF",
      "#33A0FF",
      "#7AA7FF", // 5 - base
      "#6B96E0",
      "#5C85C4",
      "#4D74A8",
      "#3E638C", // 9
    ],
    // Lavender Puff (Tertiary)
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
    // Mint Candy (Success)
    green: [
      "#E0FFF4",
      "#B3FFE8",
      "#80FFDC",
      "#4DFFD0",
      "#33FFC9",
      "#6EE7B7", // 5 - base
      "#5FD0A3",
      "#50B98F",
      "#41A27B",
      "#328B67", // 9
    ],
    // Lemon Custard (Warning)
    yellow: [
      "#FFF9E0",
      "#FFF2B3",
      "#FFEB80",
      "#FFE44D",
      "#FFDD1A",
      "#FFD166", // 5 - base
      "#E0BA5C",
      "#C4A352",
      "#A88C48",
      "#8C753E", // 9
    ],
    // Cherry Jelly (Error)
    red: [
      "#FFE0E6",
      "#FFB3C2",
      "#FF809E",
      "#FF6B6B", // 3 - base
      "#FF4D56",
      "#E04D4D",
      "#C44444",
      "#A83B3B",
      "#8C3232",
      "#702929", // 9
    ],
  },

  white: "#FFFFFF", // Marshmallow
  black: "#2B1B2E", // Cocoa Ink

  fontFamily: "M PLUS Rounded 1c, Nunito, Quicksand, sans-serif",
  fontFamilyMonospace: "JetBrains Mono, monospace",
  headings: {
    fontFamily: "M PLUS Rounded 1c, Nunito, Quicksand, sans-serif",
    fontWeight: "800",
    sizes: {
      h1: { fontSize: "2.5rem", lineHeight: "1.3" },
      h2: { fontSize: "2rem", lineHeight: "1.35" },
      h3: { fontSize: "1.5rem", lineHeight: "1.4" },
      h4: { fontSize: "1.25rem", lineHeight: "1.45" },
      h5: { fontSize: "1.125rem", lineHeight: "1.5" },
      h6: { fontSize: "1rem", lineHeight: "1.5" },
    },
  },

  defaultRadius: "xl", // Large rounded corners
  radius: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.25rem",
    xl: "1.5rem",
  },

  spacing: {
    xs: "0.75rem",
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
    xl: "2.5rem",
  },

  shadows: {
    xs: "0 2px 4px rgba(255, 126, 182, 0.08)",
    sm: "0 4px 8px rgba(255, 126, 182, 0.12)",
    md: "0 6px 12px rgba(255, 126, 182, 0.15)",
    lg: "0 10px 20px rgba(255, 126, 182, 0.18)",
    xl: "0 15px 30px rgba(255, 126, 182, 0.22)",
  },

  components: {
    Button: {
      defaultProps: {
        size: "md",
        radius: "xl",
      },
      styles: {
        root: {
          fontWeight: 700,
          transition: "all 180ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          "&:active": {
            transform: "scale(0.95)",
          },
          "&[data-variant='filled']": {
            color: "#2B1B2E",
          },
          "&[data-variant='default']": {
            color: "#2B1B2E",
          },
          "&[data-variant='outline']": {
            color: "#8C426A",
          },
          "&[data-variant='subtle']": {
            color: "#8C426A",
          },
          "&[data-variant='transparent']": {
            color: "#8C426A",
          },
          "&:disabled, &[data-disabled='true']": {
            opacity: 1,
            color: "#5A4560",
            backgroundColor: "#E8D8EA",
            borderColor: "#C2A8CD",
          },
        },
      },
    },

    TextInput: {
      defaultProps: {
        radius: "lg",
      },
      styles: {
        input: {
          backgroundColor: "#FFFFFF",
          borderColor: "rgba(255, 126, 182, 0.2)",
          borderWidth: "2px",
          color: "#2B1B2E",
          fontWeight: 500,
          transition: "all 150ms ease-out",
          "&:focus": {
            borderColor: "#FF7EB6",
            boxShadow: "0 0 0 3px rgba(255, 126, 182, 0.15)",
            transform: "translateY(-1px)",
          },
          "&::placeholder": {
            color: "rgba(43, 27, 46, 0.4)",
          },
        },
        label: {
          fontWeight: 700,
          fontSize: "0.875rem",
          color: "#2B1B2E",
          marginBottom: "0.5rem",
        },
      },
    },

    NumberInput: {
      defaultProps: {
        radius: "lg",
      },
      styles: {
        input: {
          backgroundColor: "#FFFFFF",
          borderColor: "rgba(255, 126, 182, 0.2)",
          borderWidth: "2px",
          color: "#2B1B2E",
          fontWeight: 500,
          "&:focus": {
            borderColor: "#FF7EB6",
            boxShadow: "0 0 0 3px rgba(255, 126, 182, 0.15)",
          },
        },
      },
    },

    Select: {
      defaultProps: {
        radius: "lg",
      },
      styles: {
        input: {
          backgroundColor: "#FFFFFF",
          borderColor: "rgba(255, 126, 182, 0.2)",
          borderWidth: "2px",
          color: "#2B1B2E",
          fontWeight: 500,
        },
        dropdown: {
          backgroundColor: "#FFFFFF !important",
          borderColor: "rgba(255, 126, 182, 0.2)",
          borderWidth: "2px",
          borderRadius: "1rem",
          boxShadow: "0 10px 20px rgba(255, 126, 182, 0.18)",
          opacity: 1,
        },
        option: {
          borderRadius: "0.5rem",
          fontWeight: 600,
          color: "#2B1B2E",
          "&[data-selected]": {
            backgroundColor: "rgba(255, 126, 182, 0.15)",
            color: "#2B1B2E",
          },
          "&[data-hovered]": {
            backgroundColor: "rgba(255, 126, 182, 0.08)",
            color: "#2B1B2E",
          },
        },
      },
    },

    Autocomplete: {
      defaultProps: {
        radius: "lg",
      },
      styles: {
        input: {
          backgroundColor: "#FFFFFF",
          borderColor: "rgba(255, 126, 182, 0.2)",
          borderWidth: "2px",
          color: "#2B1B2E",
          fontWeight: 500,
        },
      },
    },

    Card: {
      defaultProps: {
        padding: "xl",
        radius: "xl",
      },
      styles: {
        root: {
          backgroundColor: "#FFFFFF",
          border: "2px solid rgba(255, 126, 182, 0.15)",
          boxShadow: "0 6px 12px rgba(255, 126, 182, 0.15)",
          transition: "all 200ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 24px rgba(255, 126, 182, 0.22)",
          },
        },
      },
    },

    Switch: {
      styles: {
        track: {
          backgroundColor: "rgba(255, 126, 182, 0.2)",
          borderWidth: "2px",
          borderColor: "rgba(255, 126, 182, 0.3)",
          cursor: "pointer",
          "&[data-checked]": {
            backgroundColor: "#FF7EB6",
            borderColor: "#FF7EB6",
          },
        },
        thumb: {
          backgroundColor: "#FFFFFF",
          borderWidth: "2px",
          borderColor: "rgba(255, 126, 182, 0.3)",
        },
      },
    },

    Checkbox: {
      styles: {
        input: {
          backgroundColor: "#FFFFFF",
          borderColor: "rgba(255, 126, 182, 0.3)",
          borderWidth: "2px",
          borderRadius: "0.375rem",
          cursor: "pointer",
          "&:checked": {
            backgroundColor: "#FF7EB6",
            borderColor: "#FF7EB6",
          },
        },
        label: {
          fontWeight: 600,
          color: "#2B1B2E",
          cursor: "pointer",
        },
      },
    },

    Radio: {
      styles: {
        radio: {
          backgroundColor: "#FFFFFF",
          borderColor: "rgba(255, 126, 182, 0.3)",
          borderWidth: "2px",
          cursor: "pointer",
          "&:checked": {
            backgroundColor: "#FFFFFF",
            borderColor: "#FF7EB6",
            "&::before": {
              backgroundColor: "#FF7EB6",
            },
          },
        },
        label: {
          fontWeight: 600,
          color: "#2B1B2E",
          cursor: "pointer",
        },
      },
    },

    Slider: {
      styles: {
        track: {
          backgroundColor: "rgba(255, 126, 182, 0.2)",
          height: "8px",
        },
        bar: {
          backgroundColor: "#FF7EB6",
        },
        thumb: {
          backgroundColor: "#FFFFFF",
          borderColor: "#FF7EB6",
          borderWidth: "3px",
          width: "20px",
          height: "20px",
          boxShadow: "0 2px 8px rgba(255, 126, 182, 0.3)",
        },
      },
    },

    Progress: {
      defaultProps: {
        radius: "xl",
      },
      styles: {
        root: {
          backgroundColor: "rgba(255, 126, 182, 0.15)",
          height: "12px",
        },
        bar: {
          background: "linear-gradient(90deg, #FF7EB6 0%, #7AA7FF 100%)",
          boxShadow: "0 2px 8px rgba(255, 126, 182, 0.3)",
        },
      },
    },

    Rating: {
      styles: {
        symbolBody: {
          color: "rgba(255, 126, 182, 0.2)",
        },
        symbolGroup: {
          "&[data-filled]": {
            color: "#FFD166",
          },
        },
      },
    },

    SegmentedControl: {
      defaultProps: {
        radius: "xl",
      },
      styles: {
        root: {
          backgroundColor: "rgba(255, 126, 182, 0.1)",
          padding: "4px",
        },
        label: {
          fontWeight: 700,
          fontSize: "0.875rem",
          color: "#2B1B2E",
          padding: "0.5rem 1rem",
          "&[data-active]": {
            color: "#2B1B2E",
          },
        },
        indicator: {
          backgroundColor: "#FFFFFF",
          boxShadow: "0 2px 8px rgba(255, 126, 182, 0.2)",
        },
      },
    },

    Modal: {
      defaultProps: {
        radius: "xl",
      },
      styles: {
        content: {
          backgroundColor: "#FFFFFF",
          border: "2px solid rgba(255, 126, 182, 0.2)",
          boxShadow: "0 20px 40px rgba(255, 126, 182, 0.25)",
        },
        header: {
          backgroundColor: "#FFFFFF",
          borderBottom: "2px solid rgba(255, 126, 182, 0.15)",
          paddingBottom: "1rem",
        },
        title: {
          fontWeight: 800,
          fontSize: "1.5rem",
          color: "#2B1B2E",
        },
        overlay: {
          backgroundColor: "rgba(255, 247, 251, 0.85)",
          backdropFilter: "blur(8px)",
        },
      },
    },

    Notification: {
      defaultProps: {
        radius: "lg",
      },
      styles: {
        root: {
          backgroundColor: "#FFFFFF",
          border: "2px solid rgba(255, 126, 182, 0.2)",
          boxShadow: "0 8px 16px rgba(255, 126, 182, 0.2)",
        },
        title: {
          fontWeight: 700,
          color: "#2B1B2E",
        },
        description: {
          color: "rgba(43, 27, 46, 0.7)",
          fontWeight: 500,
        },
      },
    },

    Badge: {
      defaultProps: {
        radius: "xl",
      },
      styles: {
        root: {
          fontWeight: 700,
          textTransform: "none",
          padding: "0.5rem 1rem",
        },
      },
    },
  },

  other: {
    themeId: "chibi",
    motion: chibiTheme.motion,
    effects: chibiTheme.effects,
    typography: chibiTheme.typography,
    button: chibiTheme.button,
  },
});


