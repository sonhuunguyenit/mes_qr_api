import React from "react";
import { View, StyleSheet, Text as RNText } from "react-native";
import { Text } from "~/common";
import { useTheme } from "~/hooks/useTheme";

interface PRFieldItemProps {
  label: string;
  value: React.ReactNode;
  color?: string;
  bold?: boolean;
  fullWidth?: boolean;
}

export const PRFieldItem = ({
  label,
  value,
  color,
  bold = true,
  fullWidth = false,
}: PRFieldItemProps) => {
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
  },
  full: {
    width: "100%",
  },
  half: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  valueWrapper: {
    minHeight: 24,
    justifyContent: "center",
  },
});
