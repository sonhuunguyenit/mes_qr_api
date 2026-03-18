import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  ViewStyle,
  StyleProp,
  DimensionValue,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "~/hooks/useTheme";

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  circle?: boolean;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Senior-level Skeleton Placeholder with a subtle shimmer effect.
 * Mimics Facebook and Shopee's smooth loading animation.
 */
export const Skeleton = ({
  width = "100%",
  height = 20,
  circle = false,
  radius: customRadius,
  style,
}: SkeletonProps) => {
  const { colors, radius: themeRadius, isDark } = useTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200, // Slightly slower for more premium feel
        useNativeDriver: true,
      }),
    ).start();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300], // Full range to ensure movement across the box
  });

  const shimmerColors = (
    isDark
      ? [
          "rgba(255, 255, 255, 0)",
          "rgba(255, 255, 255, 0.05)",
          "rgba(255, 255, 255, 0.15)",
          "rgba(255, 255, 255, 0.05)",
          "rgba(255, 255, 255, 0)",
        ]
      : [
          "rgba(255, 255, 255, 0)",
          "rgba(255, 255, 255, 0.4)",
          "rgba(255, 255, 255, 0.8)",
          "rgba(255, 255, 255, 0.4)",
          "rgba(255, 255, 255, 0)",
        ]
  ) as [string, string, ...string[]];

  return (
    <View
      style={[
        {
          width,
          height,
          backgroundColor: isDark ? colors.divider : "#E2E8F0",
          borderRadius: circle
            ? typeof height === "number"
              ? height / 2
              : 50
            : (customRadius ?? themeRadius.sm),
          overflow: "hidden",
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [{ translateX }],
            width: "150%", // Wider shimmer area
          },
        ]}
      >
        <LinearGradient
          colors={shimmerColors}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }} // Horizontal shimmer is standard
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};
