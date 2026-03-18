import { sizes } from "~/constants/sizes";
import { StyleSheet } from "react-native";

export const typography = StyleSheet.create({
  h1: {
    fontSize: sizes.fontSize.xxxl,
    fontWeight: "bold",
    lineHeight: 40,
  },
  h2: {
    fontSize: sizes.fontSize.xxl,
    fontWeight: "bold",
    lineHeight: 32,
  },
  h3: {
    fontSize: sizes.fontSize.xl,
    fontWeight: "600",
    lineHeight: 28,
  },
  h4: {
    fontSize: sizes.fontSize.lg,
    fontWeight: "600",
    lineHeight: 24,
  },
  body: {
    fontSize: sizes.fontSize.base,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: sizes.fontSize.xs,
    lineHeight: 18,
  },
  caption: {
    fontSize: sizes.fontSize.xs,
    lineHeight: 16,
  },
  button: {
    fontSize: sizes.fontSize.base,
    fontWeight: "600",
  },
  label: {
    fontSize: sizes.fontSize.base,
  },
  value: {
    fontSize: sizes.fontSize.base,
  },
});
