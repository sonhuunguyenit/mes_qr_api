import { Text as TextRE, TextProps as TextREProps } from "@rneui/themed";
import React from "react";
import { TextStyle, Platform, ColorValue } from "react-native";
import { useTheme } from "~/hooks/useTheme";
import { BrandConfig } from "~/styles/theme-config";

export interface TextProps extends TextREProps {
  header?: boolean;
  title?: boolean;
  label?: boolean;
  value?: boolean;
  bold?: boolean;
  light?: boolean;
  center?: boolean;
  size?: number;
  weight?: TextStyle["fontWeight"] | "extraBold" | "black";
  color?: ColorValue;
  primary?: boolean;
  type?: "success" | "info" | "warning" | "error" | "disabled";
}

// Helper để lấy Font dựa trên BrandConfig

export const getFontStyle = (
  w?: TextStyle["fontWeight"] | "extraBold" | "black",
): TextStyle => {
  if (Platform.OS === "ios") {
    let iosWeight = w;
    if (w === "black") iosWeight = "900";
    if (w === "extraBold") iosWeight = "800";
    return { fontWeight: (iosWeight as TextStyle["fontWeight"]) || "400" };
  }

  const fonts = BrandConfig.fonts;
  if (w === "900" || w === "black") return { fontFamily: fonts.black };
  if (w === "800" || w === "extraBold") return { fontFamily: fonts.extraBold };
  if (w === "700" || w === "bold") return { fontFamily: fonts.bold };
  if (w === "600" || w === "semibold") return { fontFamily: fonts.semibold };
  if (w === "500" || w === "medium") return { fontFamily: fonts.medium };

  return { fontFamily: fonts.regular };
};

import { sizes } from "~/constants/sizes";

export const Text = ({
  header,
  title,
  label,
  value,
  bold,
  light,
  center,
  size,
  weight,
  color,
  style,
  primary,
  type,
  ...props
}: TextProps) => {
  const { colors } = useTheme();

  let baseWeight = weight;
  if (!baseWeight && bold) baseWeight = "600";

  let textStyle: TextStyle = {
    ...getFontStyle(baseWeight),
    fontSize: size || sizes.fontSize.base,
  };

  let textColor: ColorValue = color || colors.text;

  // Cấu hình theo Type (Header, Title, Label, Value)
  if (header) {
    textStyle.fontSize = size || sizes.fontSize.lg;
    textColor = color || colors.header;
  } else if (title) {
    textStyle.fontSize = size || sizes.fontSize.md;
    textColor = color || colors.title;
  } else if (label) {
    textStyle.fontSize = size || sizes.fontSize.base;
    textColor = color || colors.label;
  } else if (value) {
    textStyle.fontSize = size || sizes.fontSize.base;
    textColor = color || colors.value;
  }

  // --- Semantic types (Chỉ áp dụng nếu không truyền màu cứng) ---
  if (!color) {
    if (type === "success") textColor = colors.green;
    if (type === "info") textColor = colors.blue;
    if (type === "warning") textColor = colors.yellow;
    if (type === "error") textColor = colors.red;
    if (type === "disabled") textColor = colors.disabled;
    if (primary) textColor = colors.primary;
  }

  if (center) textStyle.textAlign = "center";

  const androidStyle: TextStyle = Platform.select({
    android: { includeFontPadding: false, textAlignVertical: "center" },
    default: {},
  });

  return (
    <TextRE
      {...props}
      style={[{ color: textColor }, textStyle, androidStyle, style]}
    />
  );
};
