import {
  ColorValue,
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
  color?: ColorValue;
  backgroundColor?: ColorValue;
  showDot?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
}

import { useTheme } from "~/hooks/useTheme";

export const Badge = ({
  label,
  value,
  color,
  backgroundColor,
  showDot = true,
  style,
  labelStyle,
  valueStyle,
}: BadgeProps) => {
  const { colors } = useTheme();
  const defaultColor = colors.green;
  const finalColor = color || defaultColor;

  const finalBgColor =
    backgroundColor ||
    (typeof finalColor === "string" ? finalColor + "15" : colors.neutral15);

  return (
    <View style={[styles.container, { backgroundColor: finalBgColor }, style]}>
      {showDot && (
        <View style={[styles.dot, { backgroundColor: finalColor }]} />
      )}
      {showDot && <Spacer size={6} horizontal />}

      <Text bold color={colors.label} style={labelStyle}>
        {label ? `${label}: ` : ""}
      </Text>
      <Text bold weight="700" style={[{ color: finalColor }, valueStyle]}>
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
