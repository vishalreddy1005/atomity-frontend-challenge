/**
 * Design token definitions.
 * CSS custom properties are in globals.css.
 * These TypeScript references ensure type-safety and colocation.
 */

export const tokens = {
  colors: {
    // Backgrounds (darkest → lightest)
    bg0: "var(--color-bg0)",
    bg1: "var(--color-bg1)",
    bg2: "var(--color-bg2)",
    bg3: "var(--color-bg3)",
    bgHover: "var(--color-bg-hover)",

    // Text
    textPrimary:   "var(--color-text-primary)",
    textSecondary: "var(--color-text-secondary)",
    textMuted:     "var(--color-text-muted)",

    // Accents
    accentGreen:    "var(--color-accent-green)",
    accentGreen10:  "var(--color-accent-green-10)",
    accentGreen20:  "var(--color-accent-green-20)",
    accentGreen40:  "var(--color-accent-green-40)",
    accentBlue:     "var(--color-accent-blue)",
    accentAmber:    "var(--color-accent-amber)",
    accentRed:      "var(--color-accent-red)",

    // Borders
    border:       "var(--color-border)",
    borderGreen:  "var(--color-border-green)",
  },

  radius: {
    sm: "var(--radius-sm)",
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
    xl: "var(--radius-xl)",
  },

  font: {
    sans: "var(--font-sans)",
    mono: "var(--font-mono)",
  },
} as const;

/** Provider-level brand colours. */
export const providerMeta = {
  aws: {
    name: "Amazon AWS",
    shortName: "AWS",
    icon: "⬡",
    color: "#FF9900",
    rgb: "255,153,0",
  },
  gcp: {
    name: "Google Cloud",
    shortName: "GCP",
    icon: "◈",
    color: "#4285F4",
    rgb: "66,133,244",
  },
  azure: {
    name: "Microsoft Azure",
    shortName: "Azure",
    icon: "◆",
    color: "#0EA5E9",
    rgb: "14,165,233",
  },
  oci: {
    name: "Oracle Cloud",
    shortName: "OCI",
    icon: "◉",
    color: "#F05A28",
    rgb: "240,90,40",
  },
} as const;

export type ProviderId = keyof typeof providerMeta;
