import React, { forwardRef } from "react";
import {
  View,
  ViewProps,
  StyleProp,
  ViewStyle,
  ActivityIndicator,
  DimensionValue,
} from "react-native";
import { useTheme } from "~/hooks/useTheme";

type Border = {
  width?: number;
  color?: string;
  radius?: number;
  style?: ViewStyle["borderStyle"];
};

type Shadow = {
  color?: string;
  opacity?: number;
  offsetX?: number;
  offsetY?: number;
  radius?: number;
};

type Box = number | [number, number] | [number, number, number, number];

export type ColumnProps = ViewProps & {
  justify?: ViewStyle["justifyContent"];
  align?: ViewStyle["alignItems"];
  center?: boolean;
  gap?: number;
  padding?: Box;
  margin?: Box;
  wrap?: boolean;
  reverse?: boolean;
  width?: DimensionValue;
  height?: DimensionValue;
  full?: boolean;
  border?: Border;
  shadow?: Shadow;
  background?: string;
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

export const Column = forwardRef<View, ColumnProps>(
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
    const columnStyle: ViewStyle = {
      flexDirection: reverse ? "column-reverse" : "column",
      justifyContent: center ? "center" : justify,
      alignItems: center ? "center" : align,
      flexWrap: wrap ? "wrap" : "nowrap",
      ...stylePadding(padding),
      ...styleMargin(margin),
      backgroundColor: background,
      gap,
      width,
      borderWidth: border?.width,
      borderColor: border?.color,
      borderRadius: border?.radius,
      borderStyle: border?.style,
      zIndex,
      opacity: disabled ? 0.5 : 1,
      shadowColor: resolvedShadow.color,
      shadowOpacity: resolvedShadow.opacity,
      shadowOffset: {
        width: resolvedShadow.offsetX || 0,
        height: resolvedShadow.offsetY || 0,
      },
      shadowRadius: resolvedShadow.radius,
      elevation: resolvedShadow.radius,
      ...(full ? { flex: 1, height: "100%" } : {}),
      ...(height !== "auto" ? { height } : {}),
    };

    return (
      <View
        ref={ref}
        style={[columnStyle, style]}
        pointerEvents={disabled ? "none" : "auto"}
        {...rest}
      >
        {loading ? <ActivityIndicator /> : children}
      </View>
    );
  },
);

Column.displayName = "Column";
