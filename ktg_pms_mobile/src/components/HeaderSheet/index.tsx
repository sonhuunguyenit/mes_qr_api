import { Icon } from "@rneui/themed";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "~/common";
import {
  BOTTOM_SHEET_DETAIL_TITLE,
  BOTTOM_SHEET_FILTER_TITLE,
} from "~/constants";
import { useTheme } from "~/hooks/useTheme";

interface HeaderSheetProps {
  type: "filter" | "detail";
  title?: string;
  onClose?: () => void;
  iconName?: string;
  iconType?: string;
}

export const HeaderSheet = ({
  title,
  onClose,
  iconName = "sliders",
  iconType = "feather",
  type,
}: HeaderSheetProps) => {
  const { spacing, colors } = useTheme();

  return (
    <View
      style={[
        styles.header,
        { paddingBottom: spacing.sm, borderBottomColor: colors.border },
      ]}
    >
      <View style={styles.sideContainer}>
        <Icon name={iconName} type={iconType} size={18} color={colors.active} />
      </View>

      <Text bold center size={16} color={colors.active} style={styles.title}>
        {title
          ? title
          : type === "filter"
            ? BOTTOM_SHEET_FILTER_TITLE
            : BOTTOM_SHEET_DETAIL_TITLE}
      </Text>

      <View style={[styles.sideContainer, { alignItems: "flex-end" }]}>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Icon name="x" type="feather" size={24} color={colors.label} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },
  sideContainer: {
    width: 32,
    justifyContent: "center",
  },
  title: {
    flex: 1,
  },
  closeBtn: {
    marginRight: 5,
  },
});
