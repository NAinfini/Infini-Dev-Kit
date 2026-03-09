import type { TargetAndTransition, Transition, Variants } from "motion/react";
import type { ComponentPropsWithoutRef, CSSProperties, ElementType, MouseEventHandler, ReactNode } from "react";

/**
 * Properties that conflict between React HTML attributes and Motion's event handlers.
 * Must be omitted when component props extend HTML attributes and are spread onto motion.* elements.
 */
type MotionConflictingProps =
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onDragOver"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration";

/** Motion-safe version of ComponentPropsWithoutRef that omits conflicting handlers */
type MotionSafeProps<T extends ElementType> = Omit<ComponentPropsWithoutRef<T>, MotionConflictingProps>;

export interface SpringProfile {
  stiffness: number;
  damping: number;
  mass: number;
  bounce: number;
}

export interface MotionGestureFeedback {
  whileHover?: TargetAndTransition;
  whileTap?: TargetAndTransition;
  transition?: Transition;
}

export interface ThemeButtonVariants extends Variants {
  rest: TargetAndTransition;
  hover: TargetAndTransition;
  tap: TargetAndTransition;
  focus: TargetAndTransition;
}

// ── Cards ──

export interface TiltCardProps extends Omit<MotionSafeProps<"div">, "children"> {
  children: ReactNode;
  tiltDegree?: number;
  glowColor?: string;
  glowIntensity?: number;
  /** When false, disables tilt/hover motion effects (container-only card). Default: true */
  interactive?: boolean;
}

export type GlowCardVariant = "spotlight" | "laser" | "cosmic" | "glitch";

export interface GlowCardProps extends Omit<MotionSafeProps<"div">, "children" | "onClick"> {
  children: ReactNode;
  /** Glow variant (default: "spotlight") */
  variant?: GlowCardVariant;
  /** Glow color (default: theme primary) */
  glowColor?: string;
  /** Glow intensity 0–1 (default: 0.6) */
  glowIntensity?: number;
  /** Glow radius in px (default: 200) */
  glowRadius?: number;
  /** Enable mouse-tracking glow (default: true) */
  trackMouse?: boolean;
  /** Laser spin speed in degrees per frame (default: 1.5). Lower = slower. */
  spinSpeed?: number;
  /** When false, disables hover/glow motion effects (container-only card). Default: true */
  interactive?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export interface CyberpunkCardProps extends Omit<MotionSafeProps<"div">, "children" | "onClick"> {
  children: ReactNode;
  /** Neon border color (default: theme accent or cyan) */
  neonColor?: string;
  /** Enable animated scanlines (default: true) */
  scanlines?: boolean;
  /** Enable corner decorations (default: true) */
  cornerClips?: boolean;
  /** When false, disables hover scale motion effects (container-only card). Default: true */
  interactive?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export interface NeuBrutalCardProps extends Omit<MotionSafeProps<"div">, "children" | "onClick"> {
  children: ReactNode;
  /** Shadow color (default: theme text/black) */
  shadowColor?: string;
  /** Border width in px (default: theme borderWidth or 4) */
  borderWidth?: number;
  /** Accent stripe color (default: theme primary) */
  accentColor?: string;
  /** When false, disables hover/tap motion effects (container-only card). Default: true */
  interactive?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export interface ChibiCardProps extends Omit<MotionSafeProps<"div">, "children" | "onClick"> {
  children: ReactNode;
  /** Accent / glow color (default: theme primary — strawberry pink) */
  glowColor?: string;
  /** Custom shadow layers array (default: chibi cloud shadow) */
  shadowLayers?: string[];
  /** When false, disables hover/tap motion effects (container-only card). Default: true */
  interactive?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export interface RevealCardProps extends Omit<MotionSafeProps<"div">, "children"> {
  children: ReactNode;
  /** Content revealed on hover */
  revealContent: ReactNode;
  /** Reveal direction (default: "up") */
  direction?: "up" | "down" | "left" | "right";
  /** Reveal duration in seconds (default: 0.35) */
  duration?: number;
}

export interface LayeredCardProps extends Omit<MotionSafeProps<"div">, "children"> {
  /** Layers from back to front — each is a ReactNode */
  layers: ReactNode[];
  /** Max tilt angle in degrees (default: 15) */
  tiltDegree?: number;
  /** Depth separation between layers in px (default: 30) */
  layerDepth?: number;
  /** Enable parallax on mouse move (default: true) */
  parallax?: boolean;
  /** Card width */
  width?: number | string;
  /** Card height */
  height?: number | string;
}

export type FlipDirection = "horizontal" | "vertical";

export interface FlipCardProps extends Omit<MotionSafeProps<"div">, "children" | "onClick"> {
  /** Front face content */
  front: ReactNode;
  /** Back face content */
  back: ReactNode;
  /** Controlled flipped state */
  flipped?: boolean;
  /** Callback when flip state changes */
  onFlipChange?: (flipped: boolean) => void;
  /** Flip direction (default: "horizontal") */
  direction?: FlipDirection;
  /** CSS perspective value (default: 1000) */
  perspective?: number;
  /** Flip animation duration in seconds (default: 0.6) */
  duration?: number;
  /** Whether clicking toggles the flip (default: true) */
  clickToFlip?: boolean;
}

// ── Buttons ──

export interface ShimmerButtonProps extends Omit<MotionSafeProps<"button">, "children" | "onClick" | "type" | "disabled" | "color"> {
  children: ReactNode;
  shimmerColor?: string;
  shimmerDuration?: number;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onPress?: () => void | Promise<void>;
  /** HTML button type attribute (default: "button") */
  htmlType?: "button" | "submit" | "reset";
  loadingLabel?: string;
  resultLabel?: string;
  releaseDelay?: number;
  disabled?: boolean;
  before?: ReactNode;
  after?: ReactNode;
}

export type DepthButtonType = "primary" | "secondary" | "danger" | "success";

export interface DepthButtonProps extends Omit<MotionSafeProps<"button">, "children" | "onClick" | "type" | "disabled" | "color"> {
  children: ReactNode;
  /** Semantic type variant (default: "primary") */
  type?: DepthButtonType;
  /** HTML button type attribute (default: "button") */
  htmlType?: "button" | "submit" | "reset";
  /** Pixel depth of the 3D raise effect (default: theme-aware) */
  raiseLevel?: number;
  /** Background color override */
  color?: string;
  /** Shadow color override */
  shadowColor?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** Render as anchor link */
  href?: string;
  /** Link target (default: "_blank" when href is set) */
  target?: string;
  /** Content before the label (e.g. icon) */
  before?: ReactNode;
  /** Content after the label (e.g. icon) */
  after?: ReactNode;
  /** Show ripple effect on press (default: true) */
  ripple?: boolean;
  /** Enable pointer-position-aware 3D tilt on hover (default: true) */
  hoverTilt?: boolean;
  /** Tilt pressure intensity — higher = more skew (default: 1) */
  hoverPressure?: number;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export type ProgressButtonPhase = "idle" | "loading" | "success" | "error";

export interface ProgressButtonProps extends Omit<MotionSafeProps<"button">, "children" | "type" | "disabled" | "color"> {
  children: ReactNode;
  /** Async callback — button tracks its promise lifecycle. Throw to trigger error state. Throw an Error with a message to use it as the error label. */
  onPress: () => Promise<void>;
  /** Label shown during loading (default: "Processing…") */
  loadingLabel?: string;
  /** Label shown on success (default: "Done") */
  successLabel?: string;
  /** Label shown on error (default: "Failed") */
  errorLabel?: string;
  /** Ms to hold the result state before returning to idle (default: 1200) */
  resultHoldMs?: number;
  /** Whether to show a progress bar or spinner (default: "bar") */
  indicator?: "bar" | "spinner";
  /** Programmatically trigger the press cycle (default: false) */
  fakePress?: boolean;
  disabled?: boolean;
  /** Content before the label (e.g. icon) */
  before?: ReactNode;
  /** Content after the label (e.g. icon) */
  after?: ReactNode;
}

export interface LiquidButtonProps extends Omit<MotionSafeProps<"button">, "children" | "onClick" | "type" | "disabled" | "color"> {
  children: ReactNode;
  /** Primary liquid color (default: theme primary) */
  color?: string;
  /** Liquid viscosity — higher = slower morph (default: 1) */
  viscosity?: number;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  /** Content before the label (e.g. icon) */
  before?: ReactNode;
  /** Content after the label (e.g. icon) */
  after?: ReactNode;
}

export interface GlitchButtonProps extends Omit<MotionSafeProps<"button">, "children" | "onClick" | "type" | "disabled" | "color"> {
  children: ReactNode;
  /** Glitch intensity (default: "medium") */
  intensity?: "subtle" | "medium" | "heavy";
  /** Glitch trigger (default: "hover") */
  trigger?: "hover" | "click" | "always";
  /** Button background color (default: theme primary) */
  color?: string;
  /** Enable chromatic aberration split (default: true) */
  chromatic?: boolean;
  /** Enable text distortion (default: true) */
  textDistort?: boolean;
  /** HTML button type attribute (default: "button") */
  htmlType?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  href?: string;
  disabled?: boolean;
  /** Show loading state — disables button and shows spinner */
  loading?: boolean;
}

export type SocialPlatform = "github" | "discord" | "twitter" | "google" | "facebook" | "linkedin" | "pinterest" | "reddit" | "whatsapp" | "messenger" | "mail" | "instagram";

export interface SocialSharePayload {
  /** URL to share */
  url?: string;
  /** Message / description */
  message?: string;
  /** Image URL (for Pinterest) */
  image?: string;
}

export interface SocialButtonProps extends Omit<MotionSafeProps<"button">, "children" | "onClick" | "type" | "disabled" | "color"> {
  /** Social platform — determines icon and default color */
  platform: SocialPlatform;
  /** Button label (default: platform name) */
  label?: string;
  /** Custom href — opens in new tab */
  href?: string;
  /** Share payload — enables native share popup */
  sharer?: SocialSharePayload;
  /** Popup window dimensions */
  popupDimensions?: { width: number; height: number };
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** Hide the icon (default: false) */
  hideIcon?: boolean;
  disabled?: boolean;
  /** Show loading state */
  loading?: boolean;
}

// ── Text (span root) ──

export type AnimatedTextPreset = "fade" | "slide" | "typewriter" | "scramble";

export interface AnimatedTextProps extends Omit<MotionSafeProps<"span">, "children"> {
  /** Text content to animate */
  children: string;
  /** Animation preset (default: "fade") */
  preset?: AnimatedTextPreset;
  /** Duration per character / per cycle in seconds (default: preset-dependent) */
  duration?: number;
  /** Stagger delay between characters in seconds (default: 0.03) */
  stagger?: number;
  /** Trigger animation on mount (default: true) */
  autoStart?: boolean;
  /** Loop the animation (default: false) */
  loop?: boolean;
  /** Characters used for scramble preset (default: "!@#$%^&*") */
  scrambleChars?: string;
}

export interface GradientTextProps extends Omit<MotionSafeProps<"span">, "children"> {
  children: string;
  /** Gradient color stops (default: theme-aware) */
  colors?: string[];
  /** Gradient angle in degrees (default: 90) */
  angle?: number;
  /** Animate the gradient position (default: true) */
  animated?: boolean;
  /** Animation cycle duration in seconds (default: 3) */
  duration?: number;
}

export interface ShinyTextProps extends Omit<MotionSafeProps<"span">, "children"> {
  children: string;
  /** Shine color (default: white with opacity) */
  shineColor?: string;
  /** Shine width as percentage of text (default: 30) */
  shineWidth?: number;
  /** Animation duration in seconds (default: 3) */
  duration?: number;
  /** Shine angle in degrees (default: -45) */
  angle?: number;
  /** Enable animation (default: true) */
  animated?: boolean;
}

// ── Layout ──

export interface PageTransitionProps extends Omit<MotionSafeProps<"div">, "children"> {
  children: ReactNode;
  type?: "fade" | "slide" | "slide-x" | "scale";
  duration?: number;
}

export interface GlassEffectProps extends Omit<MotionSafeProps<"div">, "children"> {
  children: ReactNode;
  /** Blur amount in px (default: 12) */
  blur?: number;
  /** Background opacity 0–1 (default: 0.15) */
  opacity?: number;
  /** Border opacity 0–1 (default: 0.2) */
  borderOpacity?: number;
  /** Tint color (default: theme surface) */
  tint?: string;
}

export interface MarqueeProps extends Omit<MotionSafeProps<"div">, "children"> {
  children: ReactNode;
  /** Scroll speed in px/s (default: 40) */
  speed?: number;
  /** Direction of scroll (default: "left") */
  direction?: "left" | "right" | "up" | "down";
  /** Pause on hover (default: true) */
  pauseOnHover?: boolean;
  /** Gap between repeated items in px (default: 24) */
  gap?: number;
}

// ── Effects ──

export interface MagneticElementProps extends Omit<MotionSafeProps<"div">, "children"> {
  children: ReactNode;
  /** Max pull distance in px (default: 12) */
  strength?: number;
  /** Spring damping — higher = less bouncy (default: 20) */
  damping?: number;
  /** Spring stiffness (default: 150) */
  stiffness?: number;
  /** Only activate within this radius in px from center (default: Infinity) */
  radius?: number;
}

export interface ScrollAnimationTriggerProps extends Omit<MotionSafeProps<"div">, "children"> {
  children: ReactNode;
  /** Keyframes to interpolate across the scroll range */
  keyframes: Record<string, [start: number | string, end: number | string]>;
  /** Viewport threshold where animation begins (0–1, default: 0) */
  startOffset?: number;
  /** Viewport threshold where animation ends (0–1, default: 1) */
  endOffset?: number;
}

export interface GlitchOverlayProps extends Omit<MotionSafeProps<"div">, "children" | "display"> {
  children: ReactNode;
  /** Intensity of the glitch effect */
  intensity?: "subtle" | "medium" | "heavy";
  /** When to activate the glitch */
  trigger?: "hover" | "interval" | "always" | "click" | "manual";
  /** Interval in ms for interval trigger (default: 5000) */
  intervalMs?: number;
  /** Number of clone layers (default: 6). More layers = richer glitch */
  layerCount?: number;
  /** Number of horizontal slices per layer (default: 5) */
  sliceCount?: number;
  /** Max horizontal displacement in px (default: 10) */
  displacement?: number;
  /** Enable chromatic aberration color shift (default: true) */
  chromatic?: boolean;
  /** Enable shake effect (default: true) */
  shake?: boolean;
  /** Enable pulse layer — scale + fade echo (default: false) */
  pulse?: boolean;
  /** Pulse max scale (default: 1.4) */
  pulseScale?: number;
  /** Glitch time envelope — fraction of loop where glitch peaks (default: full loop) */
  glitchTimeSpan?: { start: number; end: number };
  /** Custom CSS filter chain for slice layers (e.g. "blur(3px) brightness(0.8)"). Overrides hue-rotate when set. */
  cssFilters?: string;
  /** Clip glitch layers to the element bounds (default: false) */
  hideOverflow?: boolean;
  /** Imperative API ref for manual trigger mode */
  apiRef?: import("react").MutableRefObject<GlitchOverlayAPI | null>;
  /** CSS display mode for the wrapper (default: "inline-block") */
  display?: CSSProperties["display"];
}

export interface GlitchOverlayAPI {
  startGlitch: () => void;
  stopGlitch: () => void;
}

export interface ImageComparisonProps extends Omit<MotionSafeProps<"div">, "children"> {
  /** URL or element for the "before" side */
  before: ReactNode;
  /** URL or element for the "after" side */
  after: ReactNode;
  /** Initial slider position 0–100 (default: 50) */
  initialPosition?: number;
  /** Before label text (default: "Before") */
  beforeLabel?: string;
  /** After label text (default: "After") */
  afterLabel?: string;
  /** Height of the comparison container */
  height?: number | string;
}

export interface ImageScannerProps extends Omit<MotionSafeProps<"div">, "children"> {
  children: ReactNode;
  /** Scan line color (default: theme primary) */
  scanColor?: string;
  /** Scan duration in seconds (default: 2) */
  duration?: number;
  /** Scan direction (default: "down") */
  direction?: "down" | "up" | "left" | "right";
  /** Auto-start scan on mount (default: true) */
  autoStart?: boolean;
  /** Loop the scan (default: true) */
  loop?: boolean;
  /** Scan line thickness in px (default: 2) */
  lineWidth?: number;
  /** Glow spread around scan line in px (default: 20) */
  glowSpread?: number;
}

export interface CustomCursorProps extends Omit<MotionSafeProps<"div">, "children"> {
  children: ReactNode;
  /** Cursor size in px (default: 24) */
  size?: number;
  /** Cursor color (default: theme primary) */
  color?: string;
  /** Cursor shape (default: "circle") */
  shape?: "circle" | "ring" | "dot";
  /** Enable trail effect (default: false) */
  trail?: boolean;
  /** Trail length (default: 5) */
  trailLength?: number;
  /** Spring stiffness (default: 300) */
  stiffness?: number;
  /** Spring damping (default: 25) */
  damping?: number;
}

export interface LampHeadingProps extends Omit<MotionSafeProps<"div">, "children"> {
  children: ReactNode;
  /** Lamp cone color (default: theme primary) */
  lampColor?: string;
  /** Cone width at the bottom in px (default: 400) */
  coneWidth?: number;
  /** Cone height in px (default: 200) */
  coneHeight?: number;
  /** Animate the lamp (default: true) */
  animated?: boolean;
}

// ── Borders ──

export interface GlowBorderProps extends Omit<MotionSafeProps<"div">, "children"> {
  children: ReactNode;
  glowColor?: string;
  glowIntensity?: number;
  animated?: boolean;
}

export interface GradientBorderProps extends Omit<MotionSafeProps<"div">, "children"> {
  children: ReactNode;
  /** Gradient color stops (default: theme-aware) */
  colors?: string[];
  /** Border width in px (default: 2) */
  borderWidth?: number;
  /** Animation duration in seconds (default: 3) */
  duration?: number;
  /** Enable animation (default: true) */
  animated?: boolean;
  /** Border radius override (default: theme radius) */
  radius?: number;
}

// ── Backgrounds ──

export interface MorphingBlobProps extends Omit<MotionSafeProps<"div">, "children" | "color"> {
  /** Number of blobs (default: 3) */
  count?: number;
  /** Blob colors — cycled if fewer than count */
  colors?: string[];
  /** Overall opacity (default: 0.35) */
  opacity?: number;
  children?: ReactNode;
}

export interface RippleBackgroundProps extends Omit<MotionSafeProps<"div">, "children" | "color"> {
  children: ReactNode;
  /** Ripple color (default: theme primary) */
  color?: string;
  /** Number of concurrent ripple rings (default: 3) */
  rings?: number;
  /** Cycle duration in seconds (default: 4) */
  duration?: number;
}

export interface BubbleBackgroundProps extends Omit<MotionSafeProps<"div">, "children" | "color"> {
  children?: ReactNode;
  /** Number of bubbles (default: 20) */
  count?: number;
  /** Bubble colors — cycled (default: theme-aware) */
  colors?: string[];
  /** Min bubble size in px (default: 8) */
  minSize?: number;
  /** Max bubble size in px (default: 60) */
  maxSize?: number;
  /** Speed multiplier (default: 1) */
  speed?: number;
  /** Enable interactive repulsion on hover (default: true) */
  interactive?: boolean;
}

export interface GrainyBackgroundProps extends Omit<MotionSafeProps<"div">, "children" | "color"> {
  children?: ReactNode;
  /** Base color (default: theme primary) */
  color?: string;
  /** Secondary color for gradient shift (default: theme accent) */
  colorSecondary?: string;
  /** Grain opacity 0–1 (default: 0.3) */
  grainOpacity?: number;
  /** Grain size in px (default: 2) */
  grainSize?: number;
  /** Animate the color shift (default: true) */
  animated?: boolean;
  /** Animation cycle duration in seconds (default: 8) */
  duration?: number;
}

export interface MatrixCodeRainProps extends Omit<MotionSafeProps<"div">, "color"> {
  /** Canvas width (default: "100%") */
  width?: number | string;
  /** Canvas height (default: 300) */
  height?: number | string;
  /** Character color (default: theme primary / "#00ff41") */
  color?: string;
  /** Font size in px (default: 14) */
  fontSize?: number;
  /** Characters to rain (default: katakana + latin + digits) */
  charset?: string;
  /** Speed multiplier (default: 1) */
  speed?: number;
  /** Density 0–1 (default: 0.6) */
  density?: number;
}

export type ParticlePreset = "confetti" | "sparkle" | "rain" | "snow" | "firework";

export interface ParticleEffectProps extends Omit<MotionSafeProps<"div">, "color"> {
  /** Particle preset (default: "confetti") */
  preset?: ParticlePreset;
  /** Number of particles per burst (default: 30) */
  count?: number;
  /** Particle colors — cycled (default: theme-aware) */
  colors?: string[];
  /** Particle spread radius in px (default: 200) */
  spread?: number;
  /** Duration of effect in seconds (default: 2) */
  duration?: number;
  /** Trigger the effect (flip to true to fire) */
  trigger?: boolean;
  /** Loop the effect (default: false) */
  loop?: boolean;
  /** Gravity multiplier (default: 1) */
  gravity?: number;
  /** Origin position as fraction 0–1 (default: { x: 0.5, y: 0.5 }) */
  origin?: { x: number; y: number };
}

// ── Code ──

export interface AnimatedCodeBlockProps extends Omit<MotionSafeProps<"div">, "children"> {
  /** Code string to type out */
  code: string;
  /** Language label shown in the header (default: "code") */
  language?: string;
  /** Typing speed in characters per second (default: 40) */
  speed?: number;
  /** Whether to show a blinking cursor (default: true) */
  cursor?: boolean;
  /** Auto-start typing on mount (default: true) */
  autoStart?: boolean;
  /** Callback when typing completes */
  onComplete?: () => void;
}

export interface TerminalCommand {
  /** Command text to display */
  command: string;
  /** Output lines after the command */
  output?: string[];
  /** Delay before typing this command in ms (default: 500) */
  delay?: number;
}

export interface TerminalProps extends Omit<MotionSafeProps<"div">, "children"> {
  /** Commands to type and display */
  commands: TerminalCommand[];
  /** Typing speed in characters per second (default: 30) */
  speed?: number;
  /** Prompt prefix (default: "$ ") */
  prompt?: string;
  /** Terminal title (default: "Terminal") */
  title?: string;
  /** Auto-start typing on mount (default: true) */
  autoStart?: boolean;
  /** Loop the sequence (default: false) */
  loop?: boolean;
  /** Callback when all commands are done */
  onComplete?: () => void;
}

// ── Navigation ──

export interface AnimatedTabItem {
  /** Unique key for this tab */
  key: string;
  /** Tab label */
  label: ReactNode;
  /** Tab content */
  content: ReactNode;
  /** Disable this tab */
  disabled?: boolean;
}

export interface AnimatedTabsProps extends Omit<MotionSafeProps<"div">, "children" | "onChange"> {
  /** Tab items */
  items: AnimatedTabItem[];
  /** Currently active tab key (controlled) */
  activeKey?: string;
  /** Default active tab key (uncontrolled) */
  defaultActiveKey?: string;
  /** Callback when tab changes */
  onChange?: (key: string) => void;
  /** Underline indicator color (default: theme primary) */
  indicatorColor?: string;
  /** Content transition type (default: "fade") */
  contentTransition?: "fade" | "slide" | "none";
}

export interface SelectStepperItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectStepperProps extends Omit<MotionSafeProps<"div">, "children" | "onChange" | "defaultValue"> {
  /** List of options to step through */
  items: SelectStepperItem[];
  /** Current value (controlled) */
  value?: string | null;
  /** Default value (uncontrolled) */
  defaultValue?: string | null;
  /** Callback when value changes */
  onChange?: (value: string, item: SelectStepperItem) => void;
  /** Loop around when reaching end (default: false) */
  loop?: boolean;
  /** Disable the component */
  disabled?: boolean;
  /** Width of the visible value area in px (default: 120) */
  viewWidth?: number;
  /** Enable slide animation (default: true) */
  animated?: boolean;
  /** Custom left icon */
  leftIcon?: ReactNode;
  /** Custom right icon */
  rightIcon?: ReactNode;
  /** Render custom option content */
  renderOption?: (item: SelectStepperItem, active: boolean) => ReactNode;
}

// ── Data Display ──

export interface NumberTickerProps extends Omit<MotionSafeProps<"span">, "children"> {
  /** Target number to animate to */
  value: number;
  /** Duration of the animation in seconds (default: 1.5) */
  duration?: number;
  /** Number of decimal places (default: 0) */
  decimals?: number;
  /** Prefix string (e.g. "$") */
  prefix?: string;
  /** Suffix string (e.g. "%") */
  suffix?: string;
  /** Direction of digit roll (default: "up") */
  direction?: "up" | "down";
  /** Trigger animation on scroll into view (default: true) */
  triggerOnView?: boolean;
}

export interface RingsProgressSection {
  value: number;
  color: string;
  tooltip?: string;
}

export interface RingsProgressProps extends Omit<MotionSafeProps<"div">, "children"> {
  /** Ring sections, rendered as concentric rings */
  rings: RingsProgressSection[];
  /** Overall size in px (default: 120) */
  size?: number;
  /** Ring stroke thickness in px (default: 8) */
  thickness?: number;
  /** Gap between rings in px (default: 4) */
  gap?: number;
  /** Round stroke caps (default: true) */
  roundCaps?: boolean;
  /** Label in center */
  label?: ReactNode;
  /** Animate on mount (default: true) */
  animated?: boolean;
  /** Animation duration in seconds (default: 0.8) */
  animationDuration?: number;
  /** Root track color alpha 0–1 (default: 0.15) */
  trackAlpha?: number;
}
