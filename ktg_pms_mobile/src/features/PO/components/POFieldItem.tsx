import React from "react";
import { View, StyleSheet, Text as RNText } from "react-native";
import { Text } from "~/common";
import { useTheme } from "~/hooks/useTheme";

interface POFieldItemProps {
  label: string;
  value: React.ReactNode;
  color?: string;
  bold?: boolean;
  fullWidth?: boolean;
}

export const POFieldItem = ({
  label,
  value,
  color,
  bold = true,
  fullWidth = false,
}: POFieldItemProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, fullWidth ? styles.full : styles.half]}>
      <RNText style={[styles.label, { color: colors.label || "#718096" }]}>
        {label}
      </RNText>
      <View style={styles.valueWrapper}>
        {value === null || value === undefined || value === "" ? (
          <Text bold={bold} size={14} color={colors.text}>
            ---
          </Text>
        ) : typeof value === "string" || typeof value === "number" ? (
          <Text
            bold={bold}
            size={14}
            color={color || colors.text}
            style={{ lineHeight: 20 }}
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
  container: {
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  full: {
    width: "100%",
  },
  half: {
    flex: 1,
    minWidth: "45%",
  },
  label: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  valueWrapper: {
    minHeight: 20,
    justifyContent: "center",
  },
});
