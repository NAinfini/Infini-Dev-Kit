import { createTheme, type MantineThemeOverride } from "@mantine/core";
import { redGoldTheme } from "../../themes/red-gold";

/**
 * Red Gold Imperial Theme - Command Console
 *
 * Regal authority with imperial red and metallic gold.
 * Features: gold rails, red gradients, seal badges, warm halos.
 * Components: command controls, vault panels, ceremonial hierarchy.
 */
export const redGoldMantineTheme: MantineThemeOverride = createTheme({
  primaryColor: "red",
  primaryShade: 6,

  colors: {
    // Imperial Red (Primary)
    red: [
      "#FFE8EC", // 0
      "#FFD1D9",
      "#FFBAC6",
      "#FFA3B3",
      "#FF8CA0",
      "#ED2939", // 5 - base imperial red
      "#D42533",
      "#BB212D",
      "#A21D27", // 8 - primary shade dark
      "#891921", // 9
    ],
    // Deep Crimson (Depth)
    crimson: [
      "#FFE0E6",
      "#FFB3C2",
      "#FF809E",
      "#FF4D7A",
      "#E02E5C",
      "#900101", // 5 - base deep crimson
      "#7D0101",
      "#6A0101",
      "#570101",
      "#440101", // 9
    ],
    // Metallic Gold (Secondary)
    gold: [
      "#FAF4E6",
      "#F2EDD9",
      "#E9E3C8",
      "#DDD4B0",
      "#D4C89A",
      "#D4AF37", // 5 - base metallic gold
      "#C4A032",
      "#B3912D",
      "#A28228",
      "#917323", // 9
    ],
    // Gold Luster (Hover)
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
    // Champagne (Text)
    champagne: [
      "#FFFFFF",
      "#F9F7F2",
      "#F5F3EB",
      "#F2F0E4", // 3 - base text
      "#EEECD8",
      "#EAE8CC",
      "#E6E4C0",
      "#E2E0B4",
      "#DEDCA8",
      "#DAD89C", // 9
    ],
  },

  white: "#F2F0E4", // Champagne
  black: "#08070A", // Royal Void

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

  defaultRadius: "md",
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
    xs: "0 2px 4px rgba(237,41,57,0.08)",
    sm: "0 4px 8px rgba(237,41,57,0.12)",
    md: "0 6px 12px rgba(237,41,57,0.15)",
    lg: "0 10px 20px rgba(237,41,57,0.18), 0 0 22px rgba(237,41,57,0.08)",
    xl: "0 15px 30px rgba(237,41,57,0.22), 0 0 30px rgba(212,175,55,0.12)",
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
          letterSpacing: "0.02em",
          transition: "all 200ms cubic-bezier(0.2, 0.8, 0.2, 1)",
          background: "linear-gradient(135deg, #900101, #ED2939)",
          border: "1px solid rgba(212,175,55,0.3)",
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            inset: "2px",
            borderRadius: "inherit",
            border: "1px solid rgba(212,175,55,0.2)",
            pointerEvents: "none",
            opacity: 0,
            transition: "opacity 200ms ease",
          },
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 0 22px rgba(237,41,57,0.18), 0 0 12px rgba(212,175,55,0.15)",
          },
          "&:hover::after": {
            opacity: 1,
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
            boxShadow: "0 0 0 1px #D4AF37, 0 0 12px rgba(212,175,55,0.18)",
            borderLeft: "3px solid #D4AF37",
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
            boxShadow: "0 0 0 1px #D4AF37, 0 0 12px rgba(212,175,55,0.18)",
            borderLeft: "3px solid #D4AF37",
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
          boxShadow: "0 10px 30px rgba(0,0,0,0.5), 0 0 1px rgba(212,175,55,0.3)",
        },
        option: {
          color: "#F2F0E4",
          "&[data-selected]": {
            backgroundColor: "rgba(237,41,57,0.15)",
            color: "#F2F0E4",
            borderLeft: "3px solid #D4AF37",
          },
          "&[data-hovered]": {
            backgroundColor: "rgba(212,175,55,0.08)",
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
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, #D4AF37, #DAAA56)",
            opacity: 0,
            transition: "opacity 260ms ease",
          },
          "&::after": {
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
            boxShadow: "0 10px 30px rgba(0,0,0,0.4), 0 0 1px rgba(237,41,57,0.3)",
          },
          "&:hover::before, &:hover::after": {
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
            background: "linear-gradient(90deg, #900101, #ED2939)",
            borderColor: "#ED2939",
            boxShadow: "0 0 12px rgba(237,41,57,0.3)",
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
            background: "linear-gradient(135deg, #900101, #ED2939)",
            borderColor: "#ED2939",
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
            borderColor: "#ED2939",
            "&::before": {
              background: "radial-gradient(circle, #ED2939, #900101)",
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
          background: "linear-gradient(90deg, #900101, #ED2939)",
        },
        thumb: {
          background: "linear-gradient(135deg, #D4AF37, #DAAA56)",
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
          background: "linear-gradient(90deg, #900101, #ED2939)",
          boxShadow: "0 0 8px rgba(237,41,57,0.3)",
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
            color: "#F2F0E4",
          },
        },
        indicator: {
          background: "linear-gradient(135deg, rgba(144,1,1,0.15), rgba(237,41,57,0.15))",
          boxShadow: "0 0 8px rgba(237,41,57,0.2)",
          border: "1px solid rgba(237,41,57,0.3)",
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
          boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 1px rgba(237,41,57,0.4)",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #D4AF37, #ED2939, #D4AF37)",
          },
          "&::after": {
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
          marginTop: "0.5rem",
        },
        title: {
          fontWeight: 700,
          fontSize: "1.5rem",
          color: "#F2F0E4",
        },
        overlay: {
          backgroundColor: "rgba(8, 7, 10, 0.88)",
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
          borderLeft: "3px solid #D4AF37",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4), 0 0 1px rgba(237,41,57,0.3)",
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
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          fontSize: "0.75rem",
          background: "linear-gradient(135deg, #900101, #ED2939)",
          border: "1px solid rgba(212,175,55,0.3)",
        },
      },
    },
  },

  other: {
    themeId: "red-gold",
    motion: redGoldTheme.motion,
    effects: redGoldTheme.effects,
    typography: redGoldTheme.typography,
    button: redGoldTheme.button,
  },
});


