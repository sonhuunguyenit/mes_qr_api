import React from "react";
import { View, StyleSheet, StyleProp, TextStyle } from "react-native";
import { Text } from "~/common";
import { useTheme } from "~/hooks/useTheme";

interface ColumnFilterProps {
  label: string;
  labelStyle?: StyleProp<TextStyle>;
  value: React.ReactNode;
  valueStyle?: StyleProp<TextStyle>;
  full?: boolean;
  color?: string;
  bold?: boolean;
  underline?: boolean;
  last?: boolean;
}

export const ColumnFilter = ({
  label,
  value,
  labelStyle,
  valueStyle,
  full = false,
  color,
  bold = true,
  underline = true,
  last = false,
}: ColumnFilterProps) => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.container,
        full ? styles.full : styles.half,
        {
          borderBottomColor: colors.border,
          borderBottomWidth: underline && !last ? 1 : 0,
        },
      ]}
    >
      <Text bold color={colors.title} style={[{ marginBottom: 4 }, labelStyle]}>
        {label}
      </Text>

      <View style={styles.valueWrapper}>
        {value === null || value === undefined || value === "" ? (
          <Text bold={bold} color={colors.value} style={valueStyle}>
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
