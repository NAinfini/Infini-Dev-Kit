import { createTheme, type MantineThemeOverride } from "@mantine/core";
import { blackGoldTheme } from "../../themes/black-gold";

/**
 * Black Gold (Aurum Noir) Theme - Frame-within-Frame
 *
 * Premium luxury with matte blacks and metallic gold accents.
 * Features: double borders, micro-grain texture, gold rails, warm halos.
 * Components: inset precision, gold focus, layered depth.
 */
export const blackGoldMantineTheme: MantineThemeOverride = createTheme({
  primaryColor: "gold",
  primaryShade: 5,

  colors: {
    // Metallic Gold (Primary)
    gold: [
      "#FAF4E6", // 0 - lightest champagne
      "#F2EDD9",
      "#E9E3C8",
      "#DDD4B0",
      "#D4C89A",
      "#D4AF37", // 5 - base metallic gold (primary shade)
      "#C4A032",
      "#B3912D",
      "#A28228",
      "#917323", // 9 - darkest
    ],
    // Gold Luster (Hover/Shine)
    goldLuster: [
      "#FFF8E6",
      "#FFF0CC",
      "#FFE8B3",
      "#FFE099",
      "#FFD880",
      "#DAAA56", // 5 - base
      "#C9994D",
      "#B88844",
      "#A7773B",
      "#966632", // 9
    ],
    // Gold Ochre (Muted)
    goldOchre: [
      "#F5EDD9",
      "#EBD9B3",
      "#E1C58C",
      "#D7B166",
      "#CD9D3F",
      "#BD8B33", // 5 - base
      "#AA7D2E",
      "#976F29",
      "#846124",
      "#71531F", // 9
    ],
    // Champagne (Text)
    champagne: [
      "#FFFFFF",
      "#F9F7F2",
      "#F5F3EB",
      "#F2F0E4", // 3 - base text color
      "#EEECD8",
      "#EAE8CC",
      "#E6E4C0",
      "#E2E0B4",
      "#DEDCA8",
      "#DAD89C", // 9
    ],
    // Pewter (Muted text)
    pewter: [
      "#E6E6E6",
      "#D9D9D9",
      "#CCCCCC",
      "#BFBFBF",
      "#B3B3B3",
      "#A6A6A6", // 5 - base
      "#999999",
      "#8C8C8C",
      "#808080",
      "#737373", // 9
    ],
  },

  white: "#F2F0E4", // Champagne
  black: "#0B0B0F", // Obsidian Black

  fontFamily: "Inter, Manrope, sans-serif",
  fontFamilyMonospace: "JetBrains Mono, monospace",
  headings: {
    fontFamily: "Space Grotesk, Manrope, sans-serif",
    fontWeight: "700",
    sizes: {
      h1: { fontSize: "3rem", lineHeight: "1.15" },
      h2: { fontSize: "2.25rem", lineHeight: "1.2" },
      h3: { fontSize: "1.75rem", lineHeight: "1.25" },
      h4: { fontSize: "1.5rem", lineHeight: "1.3" },
      h5: { fontSize: "1.25rem", lineHeight: "1.35" },
      h6: { fontSize: "1.125rem", lineHeight: "1.4" },
    },
  },

  defaultRadius: "md", // 8-10px for luxury modern
  radius: {
    xs: "4px",
    sm: "6px",
    md: "8px",
    lg: "10px",
    xl: "12px",
  },

  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },

  shadows: {
    xs: "0 1px 2px rgba(212,175,55,0.08)",
    sm: "0 2px 4px rgba(212,175,55,0.1)",
    md: "0 4px 8px rgba(212,175,55,0.12)",
    lg: "0 8px 16px rgba(212,175,55,0.15)",
    xl: "0 12px 24px rgba(212,175,55,0.18), 0 0 20px rgba(212,175,55,0.08)",
  },

  components: {
    Button: {
      defaultProps: {
        size: "md",
        radius: "md",
      },
      styles: {
        root: {
          fontWeight: 600,
          letterSpacing: "0.01em",
          transition: "all 220ms cubic-bezier(0.2, 0.8, 0.2, 1)",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            padding: "1px",
            background: "linear-gradient(135deg, #D4AF37, #DAAA56)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            opacity: 0,
            transition: "opacity 220ms ease",
          },
          "&:hover::before": {
            opacity: 1,
          },
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 0 20px rgba(212,175,55,0.18)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
        },
      },
    },

    TextInput: {
      defaultProps: {
        radius: "md",
      },
      styles: {
        input: {
          backgroundColor: "#1D1A21",
          borderColor: "#2A252E",
          color: "#F2F0E4",
          fontWeight: 500,
          transition: "all 200ms ease",
          "&:focus": {
            borderColor: "#D4AF37",
            boxShadow: "0 0 0 1px #D4AF37, 0 0 12px rgba(212,175,55,0.15)",
          },
          "&::placeholder": {
            color: "#A6A6A6",
          },
        },
        label: {
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "#A6A6A6",
          marginBottom: "0.5rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        },
      },
    },

    NumberInput: {
      defaultProps: {
        radius: "md",
      },
      styles: {
        input: {
          backgroundColor: "#1D1A21",
          borderColor: "#2A252E",
          color: "#F2F0E4",
          fontWeight: 500,
          fontFamily: "JetBrains Mono, monospace",
          "&:focus": {
            borderColor: "#D4AF37",
            boxShadow: "0 0 0 1px #D4AF37, 0 0 12px rgba(212,175,55,0.15)",
          },
        },
      },
    },

    Select: {
      defaultProps: {
        radius: "md",
      },
      styles: {
        input: {
          backgroundColor: "#1D1A21",
          borderColor: "#2A252E",
          color: "#F2F0E4",
          fontWeight: 500,
        },
        dropdown: {
          backgroundColor: "#141217",
          borderColor: "#2A252E",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4), 0 0 1px rgba(212,175,55,0.2)",
        },
        option: {
          color: "#F2F0E4",
          "&[data-selected]": {
            backgroundColor: "rgba(212,175,55,0.12)",
            color: "#D4AF37",
            borderLeft: "2px solid #D4AF37",
          },
          "&[data-hovered]": {
            backgroundColor: "rgba(212,175,55,0.06)",
          },
        },
      },
    },

    Autocomplete: {
      defaultProps: {
        radius: "md",
      },
      styles: {
        input: {
          backgroundColor: "#1D1A21",
          borderColor: "#2A252E",
          color: "#F2F0E4",
          fontWeight: 500,
        },
      },
    },

    Card: {
      defaultProps: {
        padding: "xl",
        radius: "lg",
      },
      styles: {
        root: {
          backgroundColor: "#141217",
          border: "1px solid #2A252E",
          position: "relative",
          transition: "all 260ms cubic-bezier(0.2, 0.8, 0.2, 1)",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: "4px",
            borderRadius: "inherit",
            border: "1px solid rgba(212,175,55,0.15)",
            pointerEvents: "none",
            opacity: 0,
            transition: "opacity 260ms ease",
          },
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3), 0 0 1px rgba(212,175,55,0.3)",
          },
          "&:hover::before": {
            opacity: 1,
          },
        },
      },
    },

    Switch: {
      styles: {
        track: {
          backgroundColor: "#2A252E",
          borderColor: "#2A252E",
          cursor: "pointer",
          "&[data-checked]": {
            backgroundColor: "#D4AF37",
            borderColor: "#D4AF37",
            boxShadow: "0 0 12px rgba(212,175,55,0.3)",
          },
        },
        thumb: {
          backgroundColor: "#F2F0E4",
          borderColor: "#2A252E",
        },
      },
    },

    Checkbox: {
      styles: {
        input: {
          backgroundColor: "#1D1A21",
          borderColor: "#2A252E",
          cursor: "pointer",
          "&:checked": {
            backgroundColor: "#D4AF37",
            borderColor: "#D4AF37",
          },
        },
        label: {
          color: "#F2F0E4",
          fontWeight: 500,
          cursor: "pointer",
        },
      },
    },

    Radio: {
      styles: {
        radio: {
          backgroundColor: "#1D1A21",
          borderColor: "#2A252E",
          cursor: "pointer",
          "&:checked": {
            backgroundColor: "#1D1A21",
            borderColor: "#D4AF37",
            "&::before": {
              backgroundColor: "#D4AF37",
            },
          },
        },
        label: {
          color: "#F2F0E4",
          fontWeight: 500,
          cursor: "pointer",
        },
      },
    },

    Slider: {
      styles: {
        track: {
          backgroundColor: "#2A252E",
          height: "4px",
        },
        bar: {
          background: "linear-gradient(90deg, #D4AF37, #DAAA56)",
        },
        thumb: {
          backgroundColor: "#D4AF37",
          borderColor: "#D4AF37",
          width: "16px",
          height: "16px",
          boxShadow: "0 0 12px rgba(212,175,55,0.4)",
        },
      },
    },

    Progress: {
      defaultProps: {
        radius: "sm",
      },
      styles: {
        root: {
          backgroundColor: "#2A252E",
          height: "8px",
        },
        bar: {
          background: "linear-gradient(90deg, #D4AF37, #DAAA56)",
          boxShadow: "0 0 8px rgba(212,175,55,0.3)",
        },
      },
    },

    Rating: {
      styles: {
        symbolBody: {
          color: "#2A252E",
        },
        symbolGroup: {
          "&[data-filled]": {
            color: "#D4AF37",
            filter: "drop-shadow(0 0 4px rgba(212,175,55,0.4))",
          },
        },
      },
    },

    SegmentedControl: {
      defaultProps: {
        radius: "md",
      },
      styles: {
        root: {
          backgroundColor: "#1D1A21",
          border: "1px solid #2A252E",
          padding: "4px",
        },
        label: {
          fontWeight: 600,
          fontSize: "0.875rem",
          color: "#A6A6A6",
          letterSpacing: "0.02em",
          "&[data-active]": {
            color: "#D4AF37",
          },
        },
        indicator: {
          backgroundColor: "rgba(212,175,55,0.12)",
          boxShadow: "0 0 8px rgba(212,175,55,0.2)",
          border: "1px solid rgba(212,175,55,0.3)",
        },
      },
    },

    Modal: {
      defaultProps: {
        radius: "lg",
      },
      styles: {
        content: {
          backgroundColor: "#141217",
          border: "1px solid #2A252E",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 1px rgba(212,175,55,0.3)",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: "4px",
            borderRadius: "inherit",
            border: "1px solid rgba(212,175,55,0.2)",
            pointerEvents: "none",
          },
        },
        header: {
          backgroundColor: "transparent",
          borderBottom: "1px solid #2A252E",
          paddingBottom: "1rem",
        },
        title: {
          fontWeight: 700,
          fontSize: "1.5rem",
          color: "#F2F0E4",
        },
        overlay: {
          backgroundColor: "rgba(8, 7, 10, 0.85)",
          backdropFilter: "blur(4px)",
        },
      },
    },

    Notification: {
      defaultProps: {
        radius: "md",
      },
      styles: {
        root: {
          backgroundColor: "#141217",
          border: "1px solid #2A252E",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4), 0 0 1px rgba(212,175,55,0.2)",
        },
        title: {
          fontWeight: 600,
          color: "#F2F0E4",
        },
        description: {
          color: "#A6A6A6",
        },
      },
    },

    Badge: {
      defaultProps: {
        radius: "sm",
      },
      styles: {
        root: {
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          fontSize: "0.75rem",
        },
      },
    },
  },

  other: {
    themeId: "black-gold",
    motion: blackGoldTheme.motion,
    effects: blackGoldTheme.effects,
    typography: blackGoldTheme.typography,
    button: blackGoldTheme.button,
  },
});


