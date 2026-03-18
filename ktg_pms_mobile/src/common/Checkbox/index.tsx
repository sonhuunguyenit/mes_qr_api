import {
  CheckBox as CheckBoxRE,
  CheckBoxProps as CheckBoxREProps,
} from "@rneui/base";
import React from "react";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { useTheme } from "~/hooks/useTheme";
import { sizes } from "~/constants/sizes";
import { Text } from "../Text";

// ─── Types ───────────────────────────────────────────────────────
export type SemanticColor =
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "info";

export interface CheckboxProps extends Omit<CheckBoxREProps, "title"> {
  /** Label text */
  label?: string | React.ReactElement;
  /** Mô tả phụ dưới label */
  description?: string;
  /** Màu khi checked – theo semantic hoặc custom string */
  color?: SemanticColor;
  /** Custom color override (ưu tiên hơn `color`) */
  activeColor?: string;
  /** Kích thước icon: sm(18) | md(22) | lg(26). Default "md" */
  sizeVariant?: "sm" | "md" | "lg";
  /** Trái hay Phải label. Default "left" */
  align?: "left" | "right";
  /** Error message */
  errorMessage?: string;
}

const SIZE_MAP = { sm: 18, md: 22, lg: 26 } as const;

// ─── Component ───────────────────────────────────────────────────
export const Checkbox = ({
  color = "primary",
  activeColor,
  label,
  description,
  sizeVariant = "md",
  containerStyle,
  textStyle,
  wrapperStyle,
  align = "left",
  errorMessage,
  ...props
}: CheckboxProps) => {
  const { colors, fonts } = useTheme();

  // ── Resolve colors ──
  const COLOR_MAP: Record<SemanticColor, string> = {
    primary: colors.primary,
    success: colors.green,
    error: colors.red,
    warning: colors.yellow,
    info: colors.blue,
  };
  const checkedColor = activeColor || COLOR_MAP[color];
  const iconSize = SIZE_MAP[sizeVariant];

  const renderTitle = () => {
    if (!label && !description) return undefined;
    return (
      <View style={styles.labelContainer}>
        {label && (
          <Text
            style={[
              {
                fontFamily: fonts.medium,
                fontSize: sizes.fontSize.base,
                color: props.disabled ? colors.disabled : colors.label,
                marginBottom: 2,
              },
              textStyle,
            ]}
          >
            {label}
          </Text>
        )}
        {description && (
          <Text
            size={sizes.fontSize.xs}
            style={{ color: colors.label, marginTop: 2 }}
          >
            {description}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <CheckBoxRE
        {...(props as any)}
        iconRight={align === "right"}
        title={renderTitle()}
        size={iconSize}
        checkedColor={errorMessage ? colors.error : checkedColor}
        uncheckedColor={errorMessage ? colors.error : colors.disabled}
        containerStyle={[styles.container, containerStyle]}
        wrapperStyle={[styles.wrapper, wrapperStyle]}
        textStyle={[styles.text, textStyle]}
        disabledStyle={[{ opacity: 0.6 }]}
        checkedIcon="checkbox-marked"
        uncheckedIcon="checkbox-blank-outline"
        iconType="material-community"
      />
      {errorMessage && (
        <Text
          size={sizes.fontSize.xs}
          style={{
            color: colors.error,
            marginLeft: align === "left" ? 32 : 0,
            marginTop: 4,
          }}
        >
          {errorMessage}
        </Text>
      )}
    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    width: "100%",
  },
  container: {
    backgroundColor: "transparent",
    borderWidth: 0,
    padding: 0,
    margin: 0,
    marginLeft: 0,
    marginRight: 0,
    alignSelf: "flex-start",
  },
  wrapper: {
    alignItems: "center",
  },
  labelContainer: {
    marginLeft: 10,
    flexShrink: 1,
  },
  text: {
    fontWeight: "normal",
  },
});
