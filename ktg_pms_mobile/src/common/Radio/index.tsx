import {
  CheckBox as RadioRE,
  CheckBoxProps as RadioREProps,
} from "@rneui/base";
import React from "react";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { useTheme } from "~/hooks/useTheme";
import { sizes } from "~/constants/sizes";
import { Text } from "../Text";

// ─── Types ───────────────────────────────────────────────────────
export type RadioColor = "primary" | "success" | "error" | "warning" | "info";

export interface RadioProps extends Omit<RadioREProps, "title"> {
  /** Label text */
  label?: string | React.ReactElement;
  /** Mô tả phụ */
  description?: string;
  /** Màu khi chọn */
  color?: RadioColor;
  /** Custom color override */
  activeColor?: string;
  /** Kích thước: sm(18) | md(22) | lg(26). Default "md" */
  sizeVariant?: "sm" | "md" | "lg";
  /** Trạng thái chọn */
  selected?: boolean;
  /** Error message */
  errorMessage?: string;
}

export interface RadioGroupProps<T = string | number> {
  value?: T;
  onChange?: (value: T) => void;
  options: Array<{ value: T; label: string; description?: string }>;
  direction?: "vertical" | "horizontal";
  color?: RadioColor;
  sizeVariant?: "sm" | "md" | "lg";
  disabled?: boolean;
  gap?: number;
  containerStyle?: ViewStyle;
  errorMessage?: string;
}

const SIZE_MAP = { sm: 18, md: 22, lg: 26 } as const;

// ─── Radio Single ────────────────────────────────────────────────
export const Radio = ({
  color = "primary",
  activeColor,
  label,
  description,
  sizeVariant = "md",
  selected,
  containerStyle,
  textStyle,
  errorMessage,
  ...props
}: RadioProps) => {
  const { colors, fonts } = useTheme();

  const COLOR_MAP: Record<RadioColor, string> = {
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
      <RadioRE
        {...(props as any)}
        checked={selected ?? props.checked}
        title={renderTitle()}
        size={iconSize}
        checkedColor={errorMessage ? colors.error : checkedColor}
        uncheckedColor={errorMessage ? colors.error : colors.disabled}
        containerStyle={[styles.container, containerStyle]}
        textStyle={[styles.text, textStyle]}
        checkedIcon="radiobox-marked"
        uncheckedIcon="radiobox-blank"
        iconType="material-community"
        disabledStyle={[{ opacity: 0.6 }]}
      />
      {errorMessage && (
        <Text
          size={sizes.fontSize.xs}
          style={{ color: colors.error, marginLeft: 32, marginTop: 4 }}
        >
          {errorMessage}
        </Text>
      )}
    </View>
  );
};

// ─── RadioGroup Component ────────────────────────────────────────
export const RadioGroup = <T extends string | number = string>({
  value,
  onChange,
  options,
  direction = "vertical",
  color,
  sizeVariant,
  disabled,
  gap = 12,
  containerStyle,
  errorMessage,
}: RadioGroupProps<T>) => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        {
          flexDirection: direction === "horizontal" ? "row" : "column",
          flexWrap: direction === "horizontal" ? "wrap" : "nowrap",
          gap,
        },
        containerStyle,
      ]}
    >
      {options.map((opt) => (
        <Radio
          key={String(opt.value)}
          selected={value === opt.value}
          onPress={() => onChange?.(opt.value)}
          label={opt.label}
          description={opt.description}
          color={color}
          sizeVariant={sizeVariant}
          disabled={disabled}
          checked={value === opt.value}
        />
      ))}
      {errorMessage && (
        <Text
          size={sizes.fontSize.xs}
          style={{ color: colors.error, marginTop: 4 }}
        >
          {errorMessage}
        </Text>
      )}
    </View>
  );
};

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
  labelContainer: {
    marginLeft: 10,
    flexShrink: 1,
  },
  text: {
    fontWeight: "normal",
  },
});
