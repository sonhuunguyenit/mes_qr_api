import React, { forwardRef } from "react";
import {
  View,
  ViewProps,
  StyleProp,
  ViewStyle,
  ActivityIndicator,
  DimensionValue,
  ColorValue,
} from "react-native";
import { useTheme } from "~/hooks/useTheme";

type Border = {
  width?: number;
  color?: ColorValue;
  radius?: number;
  style?: ViewStyle["borderStyle"];
};

type Shadow = {
  color?: ColorValue;
  opacity?: number;
  offsetX?: number;
  offsetY?: number;
  radius?: number;
};

type Box = number | [number, number] | [number, number, number, number];

export type RowProps = ViewProps & {
  justify?: ViewStyle["justifyContent"];
  align?: ViewStyle["alignItems"];
  center?: boolean;
  gap?: number;
  padding?: Box;
  margin?: Box;
  wrap?: boolean;
  reverse?: boolean;
  full?: boolean;
  width?: DimensionValue;
  height?: DimensionValue;
  border?: Border;
  shadow?: Shadow;
  background?: ColorValue;
  loading?: boolean;
  disabled?: boolean;
  zIndex?: number;
  style?: StyleProp<ViewStyle>;
};

function parseBox(values: Box = 0) {
  if (typeof values === "number") {
    return { top: values, right: values, bottom: values, left: values };
  }
  if (Array.isArray(values)) {
    if (values.length === 2) {
      const [vertical, horizontal] = values;
      return {
        top: vertical,
        bottom: vertical,
        left: horizontal,
        right: horizontal,
      };
    }
    if (values.length === 4) {
      const [top, right, bottom, left] = values;
      return { top, right, bottom, left };
    }
  }
  return { top: 0, right: 0, bottom: 0, left: 0 };
}

function stylePadding(values: Box) {
  const { top, right, bottom, left } = parseBox(values);
  return {
    paddingTop: top,
    paddingRight: right,
    paddingBottom: bottom,
    paddingLeft: left,
  };
}

function styleMargin(values: Box) {
  const { top, right, bottom, left } = parseBox(values);
  return {
    marginTop: top,
    marginRight: right,
    marginBottom: bottom,
    marginLeft: left,
  };
}

export const Row = forwardRef<View, RowProps>(
  (
    {
      children,
      justify = "flex-start",
      align = "center",
      center = false,
      gap = 0,
      padding = 0,
      margin = 0,
      wrap = false,
      reverse = false,
      full,
      width = "auto",
      height = "auto",
      border,
      shadow,
      background = "transparent",
      loading = false,
      disabled = false,
      zIndex,
      style,
      ...rest
    },
    ref,
  ) => {
    const { colors } = useTheme();
    const defaultShadow = {
      color: colors.black,
      opacity: 0,
      offsetX: 0,
      offsetY: 0,
      radius: 0,
    };
    const resolvedShadow = shadow ? { ...defaultShadow, ...shadow } : defaultShadow;
    const rowStyle: ViewStyle = {
      flexDirection: reverse ? "row-reverse" : "row",
      justifyContent: center ? "center" : justify,
      alignItems: center ? "center" : align,
      flexWrap: wrap ? "wrap" : "nowrap",
      height,
      ...stylePadding(padding),
      ...styleMargin(margin),
      backgroundColor: background,
      gap,
      borderWidth: border?.width,
      borderColor: border?.color,
      borderRadius: border?.radius,
      borderStyle: border?.style,
      zIndex,
      opacity: disabled ? 0.5 : 1,
      shadowColor: resolvedShadow.color,
      shadowOpacity: resolvedShadow.opacity,
      shadowOffset: {
        width: resolvedShadow.offsetX ?? 0,
        height: resolvedShadow.offsetY ?? 0,
      },
      shadowRadius: resolvedShadow.radius,
      elevation: resolvedShadow.radius,
      ...(full ? { flex: 1, width: "100%" } : {}),
      ...(width !== "auto" ? { width } : {}),
    };

    return (
      <View
        ref={ref}
        style={[rowStyle, style]}
        pointerEvents={disabled ? "none" : "auto"}
        {...rest}
      >
        {loading ? <ActivityIndicator /> : children}
      </View>
    );
  },
);

Row.displayName = "Row";
