import React from "react";
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Spacer, Text } from "~/common";

interface BadgeProps {
  label: string;
  value?: string;
  color?: string;
  backgroundColor?: string;
  showDot?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
}

export const Badge = ({
  label,
  value,
  color = "#22C55E",
  backgroundColor,
  showDot = true,
  style,
  labelStyle,
  valueStyle,
}: BadgeProps) => {
  const finalBgColor = backgroundColor || color + "15";

  return (
    <View style={[styles.container, { backgroundColor: finalBgColor }, style]}>
      {showDot && <View style={[styles.dot, { backgroundColor: color }]} />}
      {showDot && <Spacer size={6} horizontal />}

      <Text bold color="#64748B" style={labelStyle}>
        {label}:{" "}
      </Text>
      <Text bold weight="700" style={[{ color: color }, valueStyle]}>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    alignSelf: "flex-start",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
