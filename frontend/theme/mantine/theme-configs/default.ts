import { createTheme, type MantineThemeOverride } from "@mantine/core";
import { defaultTheme } from "../../themes/default";

/**
 * Default (Minimalist Modern) Theme - Gradient Focus
 *
 * Bold minimalism with electric blue gradient signature.
 * Features: gradient text, inverted sections, floating animations.
 * Components: elevated surfaces, smooth transitions, professional polish.
 */
export const defaultMantineTheme: MantineThemeOverride = createTheme({
  primaryColor: "blue",
  primaryShade: 6,

  colors: {
    // Electric Blue (Primary)
    blue: [
      "#E0F2FF", // 0
      "#B3E0FF",
      "#80CEFF",
      "#4DBCFF",
      "#1AAAFF",
      "#0EA5E9", // 5
      "#0052FF", // 6 - base electric blue (primary shade)
      "#0047E0",
      "#003CC4",
      "#0031A8", // 9
    ],
    // Sky Blue (Secondary gradient endpoint)
    skyBlue: [
      "#E8F2FF",
      "#D1E5FF",
      "#BAD8FF",
      "#A3CBFF",
      "#8CBEFF",
      "#4D7CFF", // 5 - base (gradient endpoint)
      "#4470E0",
      "#3B64C4",
      "#3258A8",
      "#294C8C", // 9
    ],
    // Slate (Text/Inverted)
    slate: [
      "#F8FAFC",
      "#F1F5F9",
      "#E2E8F0",
      "#CBD5E1",
      "#94A3B8",
      "#64748B",
      "#475569",
      "#334155",
      "#1E293B",
      "#0F172A", // 9 - base foreground
    ],
  },

  white: "#FAFAFA", // Warm off-white
  black: "#0F172A", // Deep slate

  fontFamily: "Inter, system-ui, sans-serif",
  fontFamilyMonospace: "JetBrains Mono, monospace",
  headings: {
    fontFamily: "Calistoga, Georgia, serif",
    fontWeight: "400",
    sizes: {
      h1: { fontSize: "5.25rem", lineHeight: "1.05" },
      h2: { fontSize: "3.25rem", lineHeight: "1.15" },
      h3: { fontSize: "2.25rem", lineHeight: "1.25" },
      h4: { fontSize: "1.75rem", lineHeight: "1.3" },
      h5: { fontSize: "1.5rem", lineHeight: "1.35" },
      h6: { fontSize: "1.25rem", lineHeight: "1.4" },
    },
  },

  defaultRadius: "lg",
  radius: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.25rem",
  },

  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },

  shadows: {
    xs: "0 1px 2px rgba(0,0,0,0.05)",
    sm: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
    md: "0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)",
    lg: "0 10px 15px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.05)",
    xl: "0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)",
  },

  components: {
    Button: {
      defaultProps: {
        size: "md",
        radius: "lg",
      },
      styles: {
        root: {
          fontWeight: 600,
          transition: "all 200ms cubic-bezier(0.2, 0.8, 0.2, 1)",
          "&[data-variant='filled']": {
            background: "linear-gradient(135deg, #0052FF, #4D7CFF)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 4px 14px rgba(0,82,255,0.25)",
              filter: "brightness(1.1)",
            },
            "&:active": {
              transform: "scale(0.98)",
            },
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
          borderColor: "#E2E8F0",
          color: "#0F172A",
          fontWeight: 400,
          transition: "all 150ms ease-out",
          "&:focus": {
            borderColor: "#0052FF",
            boxShadow: "0 0 0 3px rgba(0,82,255,0.1)",
          },
          "&::placeholder": {
            color: "#94A3B8",
          },
        },
        label: {
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "#475569",
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
          borderColor: "#E2E8F0",
          color: "#0F172A",
          fontWeight: 400,
          "&:focus": {
            borderColor: "#0052FF",
            boxShadow: "0 0 0 3px rgba(0,82,255,0.1)",
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
          borderColor: "#E2E8F0",
          color: "#0F172A",
          fontWeight: 400,
        },
        dropdown: {
          backgroundColor: "#FFFFFF",
          borderColor: "#E2E8F0",
          boxShadow: "0 10px 15px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.05)",
        },
        option: {
          "&[data-selected]": {
            backgroundColor: "rgba(0,82,255,0.08)",
            color: "#0052FF",
          },
          "&[data-hovered]": {
            backgroundColor: "rgba(0,82,255,0.04)",
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
          borderColor: "#E2E8F0",
          color: "#0F172A",
          fontWeight: 400,
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
          border: "1px solid #E2E8F0",
          boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
          transition: "all 300ms cubic-bezier(0.2, 0.8, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)",
          },
        },
      },
    },

    Switch: {
      styles: {
        track: {
          backgroundColor: "#E2E8F0",
          borderColor: "#E2E8F0",
          cursor: "pointer",
          "&[data-checked]": {
            background: "linear-gradient(135deg, #0052FF, #4D7CFF)",
            borderColor: "#0052FF",
          },
        },
        thumb: {
          backgroundColor: "#FFFFFF",
          borderColor: "#E2E8F0",
        },
      },
    },

    Checkbox: {
      styles: {
        input: {
          backgroundColor: "#FFFFFF",
          borderColor: "#CBD5E1",
          cursor: "pointer",
          "&:checked": {
            background: "linear-gradient(135deg, #0052FF, #4D7CFF)",
            borderColor: "#0052FF",
          },
        },
        label: {
          fontWeight: 500,
          color: "#0F172A",
          cursor: "pointer",
        },
      },
    },

    Radio: {
      styles: {
        radio: {
          backgroundColor: "#FFFFFF",
          borderColor: "#CBD5E1",
          cursor: "pointer",
          "&:checked": {
            backgroundColor: "#FFFFFF",
            borderColor: "#0052FF",
            "&::before": {
              background: "radial-gradient(circle, #0052FF, #4D7CFF)",
            },
          },
        },
        label: {
          fontWeight: 500,
          color: "#0F172A",
          cursor: "pointer",
        },
      },
    },

    Slider: {
      styles: {
        track: {
          backgroundColor: "#E2E8F0",
          height: "6px",
        },
        bar: {
          background: "linear-gradient(90deg, #0052FF, #4D7CFF)",
        },
        thumb: {
          backgroundColor: "#FFFFFF",
          borderColor: "#0052FF",
          borderWidth: "3px",
          width: "18px",
          height: "18px",
          boxShadow: "0 2px 8px rgba(0,82,255,0.25)",
        },
      },
    },

    Progress: {
      defaultProps: {
        radius: "xl",
      },
      styles: {
        root: {
          backgroundColor: "#E2E8F0",
          height: "10px",
        },
        bar: {
          background: "linear-gradient(90deg, #0052FF, #4D7CFF)",
        },
      },
    },

    Rating: {
      styles: {
        symbolBody: {
          color: "#E2E8F0",
        },
        symbolGroup: {
          "&[data-filled]": {
            color: "#0052FF",
          },
        },
      },
    },

    SegmentedControl: {
      defaultProps: {
        radius: "lg",
      },
      styles: {
        root: {
          backgroundColor: "#F1F5F9",
          padding: "4px",
        },
        label: {
          fontWeight: 600,
          fontSize: "0.875rem",
          color: "#64748B",
          "&[data-active]": {
            color: "#0052FF",
          },
        },
        indicator: {
          backgroundColor: "#FFFFFF",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
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
          border: "1px solid #E2E8F0",
          boxShadow: "0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)",
        },
        header: {
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E2E8F0",
          paddingBottom: "1rem",
        },
        title: {
          fontWeight: 700,
          fontSize: "1.5rem",
          color: "#0F172A",
        },
        overlay: {
          backgroundColor: "rgba(15, 23, 42, 0.35)",
          backdropFilter: "blur(4px)",
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
          border: "1px solid #E2E8F0",
          boxShadow: "0 10px 15px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.05)",
        },
        title: {
          fontWeight: 600,
          color: "#0F172A",
        },
        description: {
          color: "#64748B",
        },
      },
    },

    Badge: {
      defaultProps: {
        radius: "md",
      },
      styles: {
        root: {
          fontWeight: 600,
          textTransform: "none",
        },
      },
    },
  },

  other: {
    themeId: "default",
    motion: defaultTheme.motion,
    effects: defaultTheme.effects,
    typography: defaultTheme.typography,
    button: defaultTheme.button,
  },
});
