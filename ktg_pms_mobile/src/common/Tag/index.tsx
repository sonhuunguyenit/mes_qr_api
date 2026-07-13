import { Icon } from "@rneui/base";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Spacer } from "../Spacer";
import { Text } from "../Text";
import { useTheme } from "~/hooks/useTheme";

interface TagProps {
  icon: string;
  label: string;
  value: string | number;
  color?: string;
  fullWidth?: boolean;
  limit?: number;
}

export const Tag = ({
  icon,
  label,
  value,
  color,
  fullWidth,
  limit,
}: TagProps) => {
  const { colors } = useTheme();

  const valStr = String(value);

  const displayValue =
    limit && valStr.length > limit
      ? valStr.substring(0, limit) + "..."
      : valStr;

  const renderContent = () => (
    <View style={[styles.infoChip, { backgroundColor: colors.divider }]}>
      <Icon name={icon} type="feather" size={11} color={colors.label} />
      <Spacer size={6} horizontal />
      <View
        style={{ flexDirection: "row", alignItems: "center", flexShrink: 1 }}
      >
        <Text bold color={colors.label} numberOfLines={1}>
          {label ? `${label}: ` : ""}
        </Text>
        <Text
          bold
          color={color || colors.title}
          numberOfLines={2}
          style={{ flexShrink: 1 }}
        >
          {displayValue}
        </Text>
      </View>
    </View>
  );

  if (fullWidth) {
    return <View style={{ width: "100%" }}>{renderContent()}</View>;
  }

  return renderContent();
};

const styles = StyleSheet.create({
  infoChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    alignSelf: "flex-start",
    justifyContent: "center",
  },
});
