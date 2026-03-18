import { Slider as SliderRE, SliderProps as SliderREProps } from "@rneui/base";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useTheme } from "~/hooks/useTheme";
import { sizes } from "~/constants/sizes";
import { Text } from "../Text";

export type SliderColor = "primary" | "success" | "error" | "warning" | "info";

export interface SliderProps extends Omit<SliderREProps, "containerStyle"> {
  /** Label tiêu đề bên trên */
  label?: string;
  /** Màu thanh track */
  color?: SliderColor;
  /** Custom track color */
  activeColor?: string;
  /** Hiển thị giá trị hiện tại bên cạnh label */
  showValue?: boolean;
  /** Đơn vị hiển thị sau giá trị (ví dụ: %) */
  unit?: string;
  /** Style container bao ngoài */
  rootStyle?: ViewStyle;
}

export const Slider = ({
  label,
  color = "primary",
  activeColor,
  showValue = false,
  unit = "",
  rootStyle,
  ...props
}: SliderProps) => {
  const { colors, fonts } = useTheme();

  const COLOR_MAP: Record<SliderColor, string> = {
    primary: colors.primary,
    success: colors.green,
    error: colors.red,
    warning: colors.yellow,
    info: colors.blue,
  };

  const resolvedColor = activeColor || COLOR_MAP[color];

  return (
    <View style={[styles.root, rootStyle]}>
      {(label || showValue) && (
        <View style={styles.header}>
          {label && (
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: sizes.fontSize.base,
                color: props.disabled ? colors.disabled : colors.label,
              }}
            >
              {label}
            </Text>
          )}
          {showValue && (
            <Text
              bold
              style={{ color: resolvedColor, fontSize: sizes.fontSize.base }}
            >
              {props.value}
              {unit}
            </Text>
          )}
        </View>
      )}
      <SliderRE
        minimumTrackTintColor={resolvedColor}
        maximumTrackTintColor={colors.disabledBg}
        thumbTintColor={resolvedColor}
        thumbStyle={[
          styles.thumb,
          {
            backgroundColor: colors.white,
            borderColor: resolvedColor,
            borderWidth: 2,
          },
        ]}
        trackStyle={[styles.track, { borderRadius: 99 }]}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingVertical: 10,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  thumb: {
    width: 24,
    height: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  track: {
    height: 6,
  },
});
