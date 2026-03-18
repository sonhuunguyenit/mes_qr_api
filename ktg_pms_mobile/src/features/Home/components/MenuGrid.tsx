import { Icon } from "@rneui/base";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  ColorValue,
} from "react-native";
import { Text, Spacer } from "~/common";
import { colors } from "~/constants/colors";
import { useTheme } from "~/hooks/useTheme";

const { width } = Dimensions.get("window");

interface MenuBlockProps {
  title: string;
  icon: string;
  iconType?: string;
  count?: number;
  onPress?: () => void;
  columns?: number;
  iconBackgroundColor?: ColorValue;
  iconColor?: ColorValue;
  backgroundColor?: ColorValue;
}

export const MenuBlock = ({
  title,
  icon,
  iconType = "feather",
  count,
  onPress,
  columns = 3,
  iconBackgroundColor,
  iconColor,
  backgroundColor,
}: MenuBlockProps) => {
  const { colors, spacing } = useTheme();

  // Calculation for columns with gap
  const horizontalGap = 10;
  const paddingAdjustment = 10 * 2 + spacing.sm * 2; // Home padding + Block padding
  const totalGapWidth = horizontalGap * (columns - 1);
  const itemWidth = (width - paddingAdjustment - totalGapWidth) / columns;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.block,
        {
          width: Math.floor(itemWidth),
          backgroundColor: backgroundColor || colors.white,
          borderRadius: 10,
          padding: 10,
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: iconBackgroundColor || "#F1F5F9",
            borderRadius: 10,
          },
        ]}
      >
        <Icon
          name={icon}
          type={iconType}
          size={20}
          color={iconColor || "#64748B"}
        />
      </View>

      <Spacer size={6} />

      <Text
        size={12}
        weight="600"
        color={colors.space}
        numberOfLines={2}
        style={styles.title}
      >
        {title}
      </Text>

      {count !== undefined && count > 0 && (
        <View style={[styles.badge, { backgroundColor: colors.red }]}>
          <Text size={11} weight="800" color={colors.white}>
            {count > 99 ? "99+" : count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export const MenuGrid = ({
  children,
  marginTop = 0,
}: {
  children: React.ReactNode;
  marginTop?: number;
}) => {
  return (
    <View style={[styles.grid, { marginTop, gap: 10, rowGap: 10 }]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  block: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    width: "60%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    paddingHorizontal: 2,
    lineHeight: 13,
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -3,
    minWidth: 27,
    height: 27,
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: "#FFF",
    zIndex: 10,
  },
});
