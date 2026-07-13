import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  ViewStyle,
  Pressable,
  ColorValue,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from "react-native-reanimated";
import { useTheme } from "~/hooks/useTheme";
import { sizes } from "~/constants/sizes";
import { Text } from "../Text";

export type SwitchColor = "primary" | "success" | "error" | "warning" | "info";

export interface SwitchProps {
  /** Trạng thái bật/tắt */
  value?: boolean;
  /** Callback khi thay đổi trạng thái */
  onValueChange?: (value: boolean) => void;
  /** Label text bên trái/trên */
  label?: string;
  /** Mô tả phụ */
  description?: string;
  /** Màu khi ON */
  color?: SwitchColor;
  /** Custom active color */
  activeColor?: ColorValue;
  /** Disabled state */
  disabled?: boolean;
  /** Style container bao ngoài cùng */
  containerStyle?: ViewStyle;
  /** Error message */
  errorMessage?: string;
}

const SWITCH_WIDTH = 48;
const SWITCH_HEIGHT = 28;
const THUMB_SIZE = 24;
const THUMB_PADDING = 2;

export const Switch = ({
  value = false,
  onValueChange,
  label,
  description,
  color = "primary",
  activeColor,
  disabled = false,
  containerStyle,
  errorMessage,
}: SwitchProps) => {
  const { colors, fonts } = useTheme();

  const COLOR_MAP: Record<SwitchColor, any> = {
    primary: colors.primary,
    success: colors.green,
    error: colors.red,
    warning: colors.yellow,
    info: colors.blue,
  };

  const resolvedActiveColor = activeColor || COLOR_MAP[color];
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, {
      damping: 20,
      stiffness: 200,
    });
  }, [value]);

  const animatedTrackStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [colors.disabledBg, resolvedActiveColor],
      ),
    };
  });

  const animatedThumbStyle = useAnimatedStyle(() => {
    const translateX =
      progress.value * (SWITCH_WIDTH - THUMB_SIZE - THUMB_PADDING * 2);
    return {
      transform: [{ translateX }],
    };
  });

  const handlePress = () => {
    if (!disabled) {
      onValueChange?.(!value);
    }
  };

  return (
    <View style={[styles.root, containerStyle]}>
      {(label || description) && (
        <View style={styles.labelContainer}>
          {label && (
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: sizes.fontSize.base,
                color: disabled ? colors.disabled : colors.label,
                marginBottom: 2,
              }}
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
      )}
      <View style={{ alignItems: "flex-end" }}>
        <Pressable
          onPress={handlePress}
          disabled={disabled}
          style={({ pressed }) => [
            styles.switchBase,
            disabled && { opacity: 0.5 },
            pressed && { opacity: 0.9 },
          ]}
        >
          <Animated.View
            style={[
              styles.track,
              animatedTrackStyle,
              errorMessage && { borderWidth: 1, borderColor: colors.error },
            ]}
          >
            <Animated.View
              style={[
                styles.thumb,
                animatedThumbStyle,
                { shadowColor: colors.black as any },
              ]}
            />
          </Animated.View>
        </Pressable>
        {errorMessage && (
          <Text
            size={sizes.fontSize.xs}
            style={{ color: colors.error, marginTop: 4 }}
          >
            {errorMessage}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    minHeight: 48,
  },
  labelContainer: {
    flex: 1,
    marginRight: 16,
  },
  switchBase: {
    width: SWITCH_WIDTH,
    height: SWITCH_HEIGHT,
  },
  track: {
    width: SWITCH_WIDTH,
    height: SWITCH_HEIGHT,
    borderRadius: SWITCH_HEIGHT / 2,
    padding: THUMB_PADDING,
    justifyContent: "center",
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: "white",
    // Shadow cho thumb để nổi bật hơn giống iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2.5,
    elevation: 2,
  },
});
