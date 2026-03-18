import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Icon } from "@rneui/base";
import { Row, Spacer, Text } from "~/common";
import { useTheme } from "~/hooks/useTheme";

interface SearchBoxProps {
  placeholder?: string;
  value?: string;
  onPress?: () => void;
  showFilter?: boolean;
  hasFilter?: boolean;
}

/**
 * Premium SearchBox Styled as a Button (Fake Input)
 * Optimized for navigatable search/filter actions.
 */
export const SearchBox = ({
  placeholder = "Tìm kiếm...",
  value,
  onPress,
  showFilter = false,
  hasFilter = false,
}: SearchBoxProps) => {
  const { colors, spacing, radius } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.card,
          borderRadius: radius.card,
          paddingHorizontal: spacing.md,
          borderColor: colors.border,
          borderWidth: 1,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Row align="center" style={{ height: 40 }} justify="space-between">
        <Row align="center" style={{ flex: 1, height: "100%" }}>
          <Icon name="search" type="feather" size={18} color={colors.label} />
          <Spacer size={10} horizontal />
          <View style={{ flex: 1, height: "100%", justifyContent: "center" }}>
            <Text color={value ? colors.title : colors.label} label size={14}>
              {value || placeholder}
            </Text>
          </View>
        </Row>

        {showFilter && (
          <View
            style={[
              styles.filterBtn,
              { backgroundColor: colors.surface, marginLeft: 8 },
            ]}
          >
            <Icon
              name="sliders"
              type="feather"
              size={18}
              color={colors.label}
            />
            {hasFilter && (
              <View style={[styles.badge, { backgroundColor: colors.error }]} />
            )}
          </View>
        )}
      </Row>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 45,
    width: "100%",
  },
  filterBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
});
