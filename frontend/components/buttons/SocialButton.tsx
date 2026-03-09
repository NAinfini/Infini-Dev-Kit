import { motion } from "motion/react";
import { forwardRef } from "react";
import clsx from "clsx";

import type { SocialButtonProps, SocialPlatform, SocialSharePayload } from "../../theme/motion-types";
import { useThemeSnapshot } from "../../provider/InfiniProvider";
import { useMotionAllowed } from "../../hooks/use-motion-allowed";
import { useThemeTransition } from "../../hooks/use-theme-transition";

const PLATFORM_CONFIG: Record<SocialPlatform, { label: string; color: string; icon: string }> = {
  github: {
    label: "GitHub",
    color: "#24292f",
    icon: "M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z",
  },
  discord: {
    label: "Discord",
    color: "#5865F2",
    icon: "M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z",
  },
  twitter: {
    label: "Twitter",
    color: "#000000",
    icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  google: {
    label: "Google",
    color: "#4285F4",
    icon: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
  },
  facebook: {
    label: "Facebook",
    color: "#1877F2",
    icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  linkedin: {
    label: "LinkedIn",
    color: "#0A66C2",
    icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  pinterest: {
    label: "Pinterest",
    color: "#E60023",
    icon: "M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345c-.091.378-.293 1.194-.332 1.361-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z",
  },
  reddit: {
    label: "Reddit",
    color: "#FF4500",
    icon: "M12 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 01-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 01.042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 014.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 01.14-.197.35.35 0 01.238-.042l2.906.617a1.214 1.214 0 011.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 00-.231.094.33.33 0 000 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 00.029-.463.33.33 0 00-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 00-.232-.094z",
  },
  whatsapp: {
    label: "WhatsApp",
    color: "#25D366",
    icon: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z",
  },
  messenger: {
    label: "Messenger",
    color: "#0084FF",
    icon: "M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111C24 4.975 18.627 0 12 0zm1.193 14.963l-3.056-3.26-5.963 3.26L10.733 8.4l3.13 3.26L19.76 8.4l-6.567 6.563z",
  },
  mail: {
    label: "Email",
    color: "#EA4335",
    icon: "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
  },
  instagram: {
    label: "Instagram",
    color: "#E4405F",
    icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  },
};

const SHARE_URLS: Partial<Record<SocialPlatform, (payload: SocialSharePayload) => string>> = {
  facebook: (p) => `https://www.facebook.com/sharer/sharer.php?u=${enc(p.url)}`,
  twitter: (p) => `https://twitter.com/intent/tweet?url=${enc(p.url)}&text=${enc(p.message)}`,
  linkedin: (p) => `https://www.linkedin.com/sharing/share-offsite/?url=${enc(p.url)}`,
  pinterest: (p) => `https://pinterest.com/pin/create/button/?url=${enc(p.url)}&description=${enc(p.message)}&media=${enc(p.image)}`,
  reddit: (p) => `https://reddit.com/submit?url=${enc(p.url)}&title=${enc(p.message)}`,
  whatsapp: (p) => `https://wa.me/?text=${enc(`${p.message ?? ""} ${p.url ?? ""}`)}`,
  messenger: (p) => `https://www.facebook.com/dialog/send?link=${enc(p.url)}&app_id=&redirect_uri=${enc(p.url)}`,
  mail: (p) => `mailto:?subject=${enc(p.message)}&body=${enc(p.url)}`,
};

function enc(val?: string): string {
  return encodeURIComponent(val ?? "");
}

const DEFAULT_POPUP = { width: 600, height: 400 };

/**
 * Pre-styled social platform button with brand colors and icons.
 * Inspired by react-awesome-button's AwesomeButtonSocial.
 * Enhanced with 12 platforms, built-in share logic with popup windows,
 * and theme-aware borders + motion gating.
 */
export const SocialButton = forwardRef<HTMLButtonElement, SocialButtonProps>(function SocialButton({
  platform,
  label,
  href,
  sharer,
  popupDimensions,
  onClick,
  hideIcon = false,
  disabled,
  loading,
  className,
  style,
  ...rest
}, ref) {
  const { theme } = useThemeSnapshot();
  const motionAllowed = useMotionAllowed();
  const transition = useThemeTransition("press");

  const config = PLATFORM_CONFIG[platform];
  const displayLabel = label ?? config.label;
  const isLoading = Boolean(loading);
  const isDisabled = Boolean(disabled) || isLoading;

  const openSharePopup = () => {
    if (!sharer) return;
    const buildUrl = SHARE_URLS[platform];
    if (!buildUrl) {
      if (href) window.open(href, "_blank", "noopener,noreferrer");
      return;
    }

    const url = buildUrl(sharer);
    const dims = popupDimensions ?? DEFAULT_POPUP;

    if (platform === "mail") {
      window.location.href = url;
      return;
    }

    const left = Math.round(screen.width / 2 - dims.width / 2);
    const top = Math.round(screen.height / 2 - dims.height / 2);
    window.open(url, "_blank", `width=${dims.width},height=${dims.height},left=${left},top=${top},toolbar=no,menubar=no`);
  };

  const handleShare = () => {
    if (!sharer) return;

    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: sharer.message,
        url: sharer.url,
      }).catch(() => {
        openSharePopup();
      });
      return;
    }

    openSharePopup();
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) return;
    if (sharer) {
      handleShare();
    }
    onClick?.(event);
  };

  const spinner = (
    <span
      aria-hidden
      style={{
        width: 14,
        height: 14,
        borderRadius: "50%",
        border: "2px solid rgba(255,255,255,0.35)",
        borderTopColor: "#ffffff",
        display: "inline-block",
        flexShrink: 0,
        animation: "spin 0.7s linear infinite",
      }}
    />
  );

  const icon = !hideIcon ? (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden style={{ flexShrink: 0 }}>
      <path d={config.icon} />
    </svg>
  ) : null;

  const computedStyle = {
    display: "inline-flex",
    alignItems: "center" as const,
    gap: 8,
    padding: "0.5rem 1rem",
    background: config.color,
    color: "#ffffff",
    border: `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} ${theme.foundation.borderColor}`,
    borderRadius: theme.foundation.radius,
    fontFamily: theme.typography.en.body,
    fontWeight: 600,
    fontSize: 14,
    textDecoration: "none" as const,
    cursor: isDisabled ? "not-allowed" : "pointer",
    opacity: isDisabled ? 0.6 : 1,
    outline: "none",
  };

  const mergedStyle = { ...computedStyle, ...style };

  const content = (
    <>
      {isLoading ? spinner : icon}
      <span>{displayLabel}</span>
    </>
  );

  // Anchor mode
  if (href && !sharer && !isDisabled) {
    if (!motionAllowed) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={clsx(className)} style={mergedStyle}>
          {content}
        </a>
      );
    }
    return (
      <motion.a
        ref={ref as any}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(className)}
        style={mergedStyle}
        whileHover={{ scale: 1.04, boxShadow: `0 4px 16px color-mix(in srgb, ${config.color} 40%, transparent)` }}
        whileTap={{ scale: 0.97 }}
        transition={transition}
      >
        {content}
      </motion.a>
    );
  }

  // Button mode
  if (!motionAllowed) {
    return (
      <button
        ref={ref}
        type="button"
        className={clsx(className)}
        {...rest}
        onClick={handleClick}
        disabled={isDisabled}
        style={mergedStyle}
      >
        {content}
      </button>
    );
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      className={clsx(className)}
      {...rest}
      onClick={handleClick}
      disabled={isDisabled}
      style={mergedStyle}
      whileHover={!isDisabled ? { scale: 1.04, boxShadow: `0 4px 16px color-mix(in srgb, ${config.color} 40%, transparent)` } : undefined}
      whileTap={!isDisabled ? { scale: 0.97 } : undefined}
      transition={transition}
    >
      {content}
    </motion.button>
  );
});
