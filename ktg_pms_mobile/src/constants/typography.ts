import { sizes } from "~/constants/sizes";
import { StyleSheet } from "react-native";

export const typography = StyleSheet.create({
  header: {
    fontFamily: "Inter-Regular",
    fontSize: sizes.fontSize.xl,
  },
  title: {
    fontFamily: "Inter-SemiBold",
    fontSize: sizes.fontSize.lg,
  },
  label: {
    fontFamily: "Inter-Regular",
    fontSize: sizes.fontSize.base,
  },
  value: {
    fontFamily: "Inter-Regular",
    fontSize: sizes.fontSize.base,
  },
  text: {
    fontFamily: "Inter-Regular",
    fontSize: sizes.fontSize.base,
  },
  description: {
    fontFamily: "Inter-Regular",
    fontSize: sizes.fontSize.base,
  },
  input: {
    fontFamily: "Inter-Regular",
    fontSize: sizes.fontSize.base,
  },
  placeholder: {
    fontFamily: "Inter-Regular",
    fontSize: sizes.fontSize.base,
  },
  bold: {
    fontFamily: "Inter-Bold",
    fontSize: sizes.fontSize.base,
    fontWeight: "700",
  },
  medium: {
    fontFamily: "Inter-Medium",
    fontSize: sizes.fontSize.base,
    fontWeight: "500",
  },
  light: {
    fontFamily: "Inter-Light",
    fontSize: sizes.fontSize.base,
    fontWeight: "300",
  },
  italic: {
    fontFamily: "Inter-Medium",
    fontSize: sizes.fontSize.base,
    fontWeight: "400",
    fontStyle: "italic",
  },
  underline: {
    fontFamily: "Inter-Medium",
    fontSize: sizes.fontSize.base,
    fontWeight: "400",
    textDecorationLine: "underline",
  },
  strikethrough: {
    fontFamily: "Inter-Medium",
    fontSize: sizes.fontSize.base,
    fontWeight: "400",
    textDecorationLine: "line-through",
  },
  uppercase: {
    fontFamily: "Inter-Medium",
    fontSize: sizes.fontSize.base,
    fontWeight: "400",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
});
