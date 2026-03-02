import { Select, SegmentedControl } from "@mantine/core";
import { useEffect, useRef, useState } from "react";

import type { MotionMode } from "../../utils/motion";
import type { ThemeId } from "../theme/theme-specs";
import { useBridge, useThemeSnapshot } from "./InfiniProvider";
import "./ThemeToolbar.css";

export type DemoPage = "theme" | "api";

const THEMES: { value: ThemeId; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "chibi", label: "Chibi" },
  { value: "cyberpunk", label: "Cyberpunk" },
  { value: "neu-brutalism", label: "Neu-Brutalism" },
  { value: "black-gold", label: "Black Gold" },
  { value: "red-gold", label: "Red Gold" },
];

const MOTION_OPTIONS: { value: MotionMode; label: string }[] = [
  { value: "full", label: "Full" },
  { value: "reduced", label: "Reduced" },
  { value: "minimum", label: "Minimum" },
  { value: "off", label: "Off" },
];

export interface ThemeToolbarProps {
  page: DemoPage;
  onPageChange: (next: DemoPage) => void;
  onThemeChange: (next: ThemeId) => void;
}

function getToolbarFxClass(themeId: ThemeId): string {
  if (themeId === "chibi") return "toolbar-bounce";
  if (themeId === "cyberpunk") return "toolbar-glitch";
  if (themeId === "neu-brutalism") return "toolbar-slam";
  if (themeId === "black-gold" || themeId === "red-gold") return "toolbar-glow";
  return "";
}

export function ThemeToolbar({ page, onPageChange, onThemeChange }: ThemeToolbarProps) {
  const bridge = useBridge();
  const { state, theme } = useThemeSnapshot();
  const [toolbarFxClass, setToolbarFxClass] = useState("");
  const previousThemeId = useRef(state.themeId);
  const animationKickoffTimer = useRef<number | null>(null);

  useEffect(() => {
    if (previousThemeId.current === state.themeId) {
      return;
    }

    previousThemeId.current = state.themeId;

    const nextFxClass = getToolbarFxClass(state.themeId);
    if (!nextFxClass) {
      setToolbarFxClass("");
      return;
    }

    setToolbarFxClass("");
    if (animationKickoffTimer.current !== null) {
      window.clearTimeout(animationKickoffTimer.current);
    }

    animationKickoffTimer.current = window.setTimeout(() => {
      setToolbarFxClass(nextFxClass);
      animationKickoffTimer.current = null;
    }, 0);
  }, [state.themeId]);

  useEffect(
    () => () => {
      if (animationKickoffTimer.current !== null) {
        window.clearTimeout(animationKickoffTimer.current);
      }
    },
    [],
  );

  return (
    <header
      className={`toolbar ${toolbarFxClass}`.trim()}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) {
          setToolbarFxClass("");
        }
      }}
    >
      <div className="toolbar-left">
        <div className="toolbar-mark" aria-hidden="true" />
        <div className="toolbar-brand">
          <span className="toolbar-title">Infini Demo</span>
          <span className="toolbar-subtitle">{theme.name}</span>
        </div>
      </div>

      <div className="toolbar-center">
        <SegmentedControl
          className="toolbar-segmented"
          value={page}
          onChange={(next) => onPageChange(next as DemoPage)}
          data={[
            { value: "theme", label: "Theme Lab" },
            { value: "api", label: "API Lab" },
          ]}
          aria-label="Select demo page"
          transitionDuration={160}
        />
      </div>

      <div className="toolbar-right">
        <div className="toolbar-group">
          <span className="toolbar-label">Theme</span>
          <Select
            className="toolbar-select"
            value={state.themeId}
            onChange={(v) => {
              if (v) {
                onThemeChange(v as ThemeId);
              }
            }}
            data={THEMES}
            w={162}
            allowDeselect={false}
            aria-label="Select theme"
          />
        </div>

        <div className="toolbar-group">
          <span className="toolbar-label">Motion</span>
          <SegmentedControl
            className="toolbar-segmented toolbar-segmented-motion"
            value={state.motionMode}
            onChange={(v) => bridge.setMotionMode(v as MotionMode)}
            data={MOTION_OPTIONS}
            aria-label="Motion mode"
            transitionDuration={160}
          />
        </div>
      </div>
    </header>
  );
}
