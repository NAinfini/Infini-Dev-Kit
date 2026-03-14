// Feedback
export { Result } from "./feedback/Result";
export type { ResultProps, ResultStatus } from "./feedback/Result";
export { ErrorBoundary } from "./feedback/ErrorBoundary";
export type { ErrorBoundaryProps } from "./feedback/ErrorBoundary";

// Backgrounds
export * from "./backgrounds/BubbleBackground";
export * from "./backgrounds/GrainyBackground";
export * from "./backgrounds/MatrixCodeRain";
export * from "./backgrounds/MorphingBlob";
export * from "./backgrounds/ParticleEffect";
export * from "./backgrounds/RippleBackground";

// Borders (re-exported via effects/composable)

// Buttons
export * from "./buttons/DepthButton";
export * from "./buttons/ProgressButton";
export * from "./buttons/SocialButton";
export * from "./buttons/SoftClayButton";
export * from "./buttons/LiquidFillButton";
export * from "./buttons/CrystalPrismButton";
export * from "./buttons/SlideRevealButton";

// Cards
export * from "./cards/ChibiCard";
export * from "./cards/NeuBrutalCard";

// Code
export * from "./code/AnimatedCodeBlock";
export * from "./code/Terminal";

// Controls
export * from "./controls/DepthToggle";
export * from "./controls/ImageGridEditor";
export * from "./controls/LayoutIndicator";
export { InfiniForm } from "./controls/InfiniForm";
export { InfiniTagInput } from "./controls/InfiniTagInput";
export type { InfiniTagInputProps } from "./controls/InfiniTagInput";

// Data display
export * from "./data-display/AnimatedCounter";
export * from "./data-display/NumberTicker";
export * from "./data-display/RingsProgress";
export * from "./data-display/ScrollProgress";
export { InfiniStatCard } from "./data-display/InfiniStatCard";
export type { InfiniStatCardProps } from "./data-display/InfiniStatCard";

// Effects (composable, visual, animation)
export * from "./effects";

// Layout
export * from "./layout/GlassEffect";
export * from "./layout/Marquee";
export * from "./layout/PageTransition";
export * from "./layout/Parallax";
export * from "./layout/StaggerList";
export { InfiniSplitView } from "./layout/InfiniSplitView";
export type { InfiniSplitViewProps } from "./layout/InfiniSplitView";

// Navigation
export * from "./navigation/AnimatedTabs";
export * from "./navigation/SelectStepper";

// Text
export * from "./text/AnimatedText";
export * from "./text/GlitchText";
export * from "./text/GradientText";
export * from "./text/ShinyText";
