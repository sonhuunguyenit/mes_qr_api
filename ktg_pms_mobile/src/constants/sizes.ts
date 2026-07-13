export const sizes = {
  // Spacing
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,

  // Border radius
  radius: {
    xs: 3,
    sm: 5,
    md: 10,
    lg: 12,
    xl: 16,
    round: 9999,
  },

  // Font sizes
  fontSize: {
    base: 13,
    xs: 11,
    sm: 12,
    md: 14,
    lg: 17,
    xl: 20,
  },

  // Icon sizes
  icon: {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  },

  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1.0,
  },

  // Line height
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;
