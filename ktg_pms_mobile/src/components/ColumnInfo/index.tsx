import React from "react";
import { View, StyleSheet, StyleProp, TextStyle, TouchableOpacity } from "react-native";
import { Text } from "~/common";
import { useTheme } from "~/hooks/useTheme";

interface ColumnInfoProps {
  label: string;
  labelStyle?: StyleProp<TextStyle>;
  value: React.ReactNode;
  valueStyle?: StyleProp<TextStyle>;
  full?: boolean;
  color?: string;
  bold?: boolean;
  underline?: boolean;
  last?: boolean;
  onPress?: () => void;
}

export const ColumnInfo = ({
  label,
  value,
  labelStyle,
  valueStyle,
  full = false,
  color,
  bold = true,
  underline = true,
  last = false,
  onPress,
}: ColumnInfoProps) => {
  const { colors } = useTheme();

  const Content = (
    <View
      style={[
        styles.container,
        full ? styles.full : styles.half,
        {
          borderBottomColor: colors.border,
          borderBottomWidth: underline && !last ? 0.5 : 0,
        },
      ]}
    >
      <Text
        bold
        size={13}
        color={colors.label}
        style={[{ marginBottom: 4 }, labelStyle]}
      >
        {label}
      </Text>
      <View style={styles.valueWrapper}>
        {value === null || value === undefined || value === "" ? (
          <Text bold={bold} color={colors.text} style={valueStyle}>
            ---
          </Text>
        ) : typeof value === "string" || typeof value === "number" ? (
          <Text
            bold={bold}
            color={color || colors.value}
            style={[{ lineHeight: 20 }, valueStyle]}
          >
            {value}
          </Text>
        ) : (
          value
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {Content}
      </TouchableOpacity>
    );
  }

  return Content;
};

const styles = StyleSheet.create({
  container: {},
  full: {
    width: "100%",
  },
  half: {
    flex: 1,
  },
  valueWrapper: {
    minHeight: 24,
    justifyContent: "center",
  },
});
