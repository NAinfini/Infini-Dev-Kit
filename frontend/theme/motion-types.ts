import type { TargetAndTransition, Transition, Variants } from "motion/react";
import type { ReactNode } from "react";

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

export interface TiltCardProps {
  children: ReactNode;
  tiltDegree?: number;
  glowColor?: string;
  glowIntensity?: number;
  className?: string;
}

export interface ShimmerButtonProps {
  children: ReactNode;
  shimmerColor?: string;
  shimmerDuration?: number;
  onClick?: () => void;
  onPress?: () => void | Promise<void>;
  loadingLabel?: string;
  resultLabel?: string;
  releaseDelay?: number;
  disabled?: boolean;
  before?: ReactNode;
  after?: ReactNode;
  className?: string;
}

export interface PageTransitionProps {
  children: ReactNode;
  type?: "fade" | "slide" | "scale";
  duration?: number;
  className?: string;
}

export interface LoadingSkeletonProps {
  type?: "text" | "card" | "avatar" | "custom";
  count?: number;
  shimmer?: boolean;
  className?: string;
}

export interface GlowBorderProps {
  children: ReactNode;
  glowColor?: string;
  glowIntensity?: number;
  animated?: boolean;
  className?: string;
}

// ── awesome-buttons inspired ──

export type DepthButtonType = "primary" | "secondary" | "danger";

export interface DepthButtonProps {
  children: ReactNode;
  /** Semantic type variant (default: "primary") */
  type?: DepthButtonType;
  /** Pixel depth of the 3D raise effect (default: theme-aware) */
  raiseLevel?: number;
  /** Background color override */
  color?: string;
  /** Shadow color override */
  shadowColor?: string;
  onClick?: () => void;
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
  className?: string;
}

export type ProgressButtonPhase = "idle" | "loading" | "success" | "error";

export interface ProgressButtonProps {
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
  className?: string;
}

// ── nyxui inspired ──

export interface LiquidButtonProps {
  children: ReactNode;
  /** Primary liquid color (default: theme primary) */
  color?: string;
  /** Liquid viscosity — higher = slower morph (default: 1) */
  viscosity?: number;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export interface MorphingBlobProps {
  /** Number of blobs (default: 3) */
  count?: number;
  /** Blob colors — cycled if fewer than count */
  colors?: string[];
  /** Overall opacity (default: 0.35) */
  opacity?: number;
  /** Container className */
  className?: string;
  children?: ReactNode;
}

export interface CyberpunkCardProps {
  children: ReactNode;
  /** Neon border color (default: theme accent or cyan) */
  neonColor?: string;
  /** Enable animated scanlines (default: true) */
  scanlines?: boolean;
  /** Enable corner decorations (default: true) */
  cornerClips?: boolean;
  className?: string;
}

export interface RippleBackgroundProps {
  children: ReactNode;
  /** Ripple color (default: theme primary) */
  color?: string;
  /** Number of concurrent ripple rings (default: 3) */
  rings?: number;
  /** Cycle duration in seconds (default: 4) */
  duration?: number;
  className?: string;
}

// ── powerglitch inspired ──

export interface GlitchOverlayProps {
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
  className?: string;
}

export interface GlitchOverlayAPI {
  startGlitch: () => void;
  stopGlitch: () => void;
}

// ── batch 2 ──

export interface ImageComparisonProps {
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
  className?: string;
}

export interface AnimatedCodeBlockProps {
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
  className?: string;
}

export interface ScrollAnimationTriggerProps {
  children: ReactNode;
  /** Keyframes to interpolate across the scroll range */
  keyframes: Record<string, [start: number | string, end: number | string]>;
  /** Viewport threshold where animation begins (0–1, default: 0) */
  startOffset?: number;
  /** Viewport threshold where animation ends (0–1, default: 1) */
  endOffset?: number;
  className?: string;
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

export interface SocialButtonProps {
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
  onClick?: () => void;
  /** Hide the icon (default: false) */
  hideIcon?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface MarqueeProps {
  children: ReactNode;
  /** Scroll speed in px/s (default: 40) */
  speed?: number;
  /** Direction of scroll (default: "left") */
  direction?: "left" | "right" | "up" | "down";
  /** Pause on hover (default: true) */
  pauseOnHover?: boolean;
  /** Gap between repeated items in px (default: 24) */
  gap?: number;
  className?: string;
}

export interface GradientTextProps {
  children: string;
  /** Gradient color stops (default: theme-aware) */
  colors?: string[];
  /** Gradient angle in degrees (default: 90) */
  angle?: number;
  /** Animate the gradient position (default: true) */
  animated?: boolean;
  /** Animation cycle duration in seconds (default: 3) */
  duration?: number;
  className?: string;
  style?: import("react").CSSProperties;
}

export interface MagneticElementProps {
  children: ReactNode;
  /** Max pull distance in px (default: 12) */
  strength?: number;
  /** Spring damping — higher = less bouncy (default: 20) */
  damping?: number;
  /** Spring stiffness (default: 150) */
  stiffness?: number;
  /** Only activate within this radius in px from center (default: Infinity) */
  radius?: number;
  className?: string;
}

// ── batch 3: new components ──

export type AnimatedTextPreset = "fade" | "slide" | "typewriter" | "scramble";

export interface AnimatedTextProps {
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
  className?: string;
  style?: import("react").CSSProperties;
}

export type GlowCardVariant = "spotlight" | "laser" | "cosmic" | "glitch";

export interface GlowCardProps {
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
  className?: string;
}

export interface RevealCardProps {
  children: ReactNode;
  /** Content revealed on hover */
  revealContent: ReactNode;
  /** Reveal direction (default: "up") */
  direction?: "up" | "down" | "left" | "right";
  /** Reveal duration in seconds (default: 0.35) */
  duration?: number;
  className?: string;
}

export interface LampHeadingProps {
  children: ReactNode;
  /** Lamp cone color (default: theme primary) */
  lampColor?: string;
  /** Cone width at the bottom in px (default: 400) */
  coneWidth?: number;
  /** Cone height in px (default: 200) */
  coneHeight?: number;
  /** Animate the lamp (default: true) */
  animated?: boolean;
  className?: string;
}

export interface GlassEffectProps {
  children: ReactNode;
  /** Blur amount in px (default: 12) */
  blur?: number;
  /** Background opacity 0–1 (default: 0.15) */
  opacity?: number;
  /** Border opacity 0–1 (default: 0.2) */
  borderOpacity?: number;
  /** Tint color (default: theme surface) */
  tint?: string;
  className?: string;
}

export interface MatrixCodeRainProps {
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
  className?: string;
}

export interface TerminalCommand {
  /** Command text to display */
  command: string;
  /** Output lines after the command */
  output?: string[];
  /** Delay before typing this command in ms (default: 500) */
  delay?: number;
}

export interface TerminalProps {
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
  className?: string;
}

export interface BubbleBackgroundProps {
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
  className?: string;
}

export interface CustomCursorProps {
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
  className?: string;
}

export interface ImageScannerProps {
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
  className?: string;
}

// ── batch 4: final nyxui components ──

export interface GlitchButtonProps {
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
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  className?: string;
}

export interface LayeredCardProps {
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
  className?: string;
}

export interface GrainyBackgroundProps {
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
  className?: string;
}

// ── batch 5: tier 1 + tier 2 components ──

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

export interface AnimatedTabsProps {
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
  className?: string;
}

export interface MotionToastData {
  /** Unique id (auto-generated if omitted) */
  id?: string;
  /** Toast title */
  title?: string;
  /** Toast message */
  message: ReactNode;
  /** Toast variant */
  variant?: "info" | "success" | "warning" | "error";
  /** Auto-dismiss duration in ms (default: 4000, 0 = manual) */
  duration?: number;
  /** Action button */
  action?: { label: string; onClick: () => void };
}

export interface MotionToastProps {
  /** Toast data */
  toast: MotionToastData;
  /** Dismiss callback */
  onDismiss: (id: string) => void;
}

export interface MotionToastContainerProps {
  /** Position on screen (default: "top-right") */
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
  /** Max visible toasts (default: 5) */
  maxVisible?: number;
  /** Toast entrance direction (default: "right") */
  entranceFrom?: "left" | "right" | "top" | "bottom";
  className?: string;
}

export interface FloatingLabelInputProps {
  /** Input label */
  label: string;
  /** Current value (controlled) */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Change callback */
  onChange?: (value: string) => void;
  /** Input type (default: "text") */
  type?: string;
  /** Placeholder shown when focused and empty */
  placeholder?: string;
  /** Error message */
  error?: string;
  disabled?: boolean;
  /** Focus ring glow effect (default: false) */
  focusGlow?: boolean;
  /** Focus ring glow color (default: theme primary) */
  focusGlowColor?: string;
  /** Shake animation on error (default: true) */
  shakeOnError?: boolean;
  className?: string;
}

export interface MotionAccordionItem {
  /** Unique key */
  key: string;
  /** Header label */
  title: ReactNode;
  /** Expandable content */
  content: ReactNode;
  /** Disable this item */
  disabled?: boolean;
}

export interface MotionAccordionProps {
  /** Accordion items */
  items: MotionAccordionItem[];
  /** Allow multiple items open (default: false) */
  multiple?: boolean;
  /** Default open item keys */
  defaultOpenKeys?: string[];
  /** Chevron position (default: "right") */
  chevronPosition?: "left" | "right";
  /** Entrance animation style (default: "height") */
  expandStyle?: "height" | "fade" | "slide";
  /** Active header highlight intensity 0–1 (default: 0.05) */
  activeHighlight?: number;
  className?: string;
}

export interface ProgressRingProps {
  /** Progress value 0–100 */
  value: number;
  /** Ring size in px (default: 80) */
  size?: number;
  /** Stroke width in px (default: 6) */
  strokeWidth?: number;
  /** Ring color (default: theme primary) */
  color?: string;
  /** Track color (default: theme border) */
  trackColor?: string;
  /** Show percentage label (default: true) */
  showLabel?: boolean;
  /** Custom label */
  label?: ReactNode;
  /** Enable glow effect (default: false) */
  glow?: boolean;
  className?: string;
}

export interface ConfirmDialogProps {
  /** Whether the dialog is open */
  opened: boolean;
  /** Close callback */
  onClose: () => void;
  /** Confirm callback */
  onConfirm: () => void;
  /** Dialog title */
  title?: ReactNode;
  /** Dialog message */
  message: ReactNode;
  /** Confirm button label (default: "Confirm") */
  confirmLabel?: string;
  /** Cancel button label (default: "Cancel") */
  cancelLabel?: string;
  /** Confirm button variant (default: "danger") */
  confirmVariant?: "primary" | "danger";
  /** Enable backdrop blur (default: true) */
  blur?: boolean;
  /** Entrance animation style (default: "scale") */
  entranceStyle?: "scale" | "slide-up" | "fade" | "drop";
  /** Overlay opacity 0–1 (default: 0.5) */
  overlayOpacity?: number;
  className?: string;
}

export interface MotionTooltipProps {
  children: ReactNode;
  /** Tooltip content */
  label: ReactNode;
  /** Tooltip position (default: "top") */
  position?: "top" | "bottom" | "left" | "right";
  /** Show delay in ms (default: 200) */
  delay?: number;
  /** Disable the tooltip */
  disabled?: boolean;
  /** Entrance animation style (default: "fade") */
  entranceStyle?: "fade" | "scale" | "slide";
  className?: string;
}

export interface NumberTickerProps {
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
  className?: string;
  style?: import("react").CSSProperties;
}

export interface ShinyTextProps {
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
  className?: string;
  style?: import("react").CSSProperties;
}

export type ParticlePreset = "confetti" | "sparkle" | "rain" | "snow" | "firework";

export interface ParticleEffectProps {
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
  className?: string;
}

// ── batch 6: tier 3 components ──

export interface MotionStepperItem {
  /** Unique key */
  key: string;
  /** Step label */
  label: ReactNode;
  /** Step description */
  description?: ReactNode;
  /** Step content */
  content?: ReactNode;
}

export interface MotionStepperProps {
  /** Stepper items */
  items: MotionStepperItem[];
  /** Current active step index (0-based) */
  activeStep: number;
  /** Callback when step changes */
  onStepChange?: (step: number) => void;
  /** Allow clicking previous steps (default: true) */
  allowStepClick?: boolean;
  /** Orientation (default: "horizontal") */
  orientation?: "horizontal" | "vertical";
  /** Step indicator color (default: theme primary) */
  color?: string;
  /** Completed step indicator style (default: "check") */
  completedIcon?: "check" | "filled" | "number";
  /** Connector animation (default: true) */
  animatedConnector?: boolean;
  /** Active step pulse glow effect (default: false) */
  activeGlow?: boolean;
  className?: string;
}

export interface MotionBreadcrumbItem {
  /** Display label */
  label: ReactNode;
  /** Navigation href */
  href?: string;
  /** Click handler (alternative to href) */
  onClick?: () => void;
}

export interface MotionBreadcrumbProps {
  /** Breadcrumb items (last is current page) */
  items: MotionBreadcrumbItem[];
  /** Separator element (default: "/") */
  separator?: ReactNode;
  className?: string;
}

export interface MotionPaginationProps {
  /** Total number of pages */
  total: number;
  /** Current page (1-based) */
  page: number;
  /** Page change callback */
  onChange: (page: number) => void;
  /** Number of sibling pages to show (default: 1) */
  siblings?: number;
  /** Active page color (default: theme primary) */
  color?: string;
  /** Button shape (default: "rounded") */
  shape?: "rounded" | "pill" | "square";
  /** Active button scale on hover (default: 1.05) */
  hoverScale?: number;
  /** Active button glow effect (default: false) */
  activeGlow?: boolean;
  className?: string;
}

export interface HoverCardProps {
  children: ReactNode;
  /** Content revealed on hover */
  content: ReactNode;
  /** Card position (default: "bottom") */
  position?: "top" | "bottom" | "left" | "right";
  /** Show delay in ms (default: 300) */
  delay?: number;
  /** Card width in px (default: 280) */
  width?: number;
  disabled?: boolean;
  className?: string;
}

export interface GradientBorderProps {
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
  className?: string;
}

export interface SidebarCollapseProps {
  children: ReactNode;
  /** Whether sidebar is collapsed */
  collapsed: boolean;
  /** Toggle collapse callback */
  onToggle: () => void;
  /** Expanded width in px (default: 260) */
  expandedWidth?: number;
  /** Collapsed width in px (default: 60) */
  collapsedWidth?: number;
  /** Collapse button position (default: "top") */
  togglePosition?: "top" | "bottom";
  /** Collapse animation style (default: "width") */
  collapseStyle?: "width" | "slide" | "fade";
  /** Show subtle border glow (default: false) */
  borderGlow?: boolean;
  className?: string;
}
