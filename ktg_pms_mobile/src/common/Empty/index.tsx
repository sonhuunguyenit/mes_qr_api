import { Text } from "../Text";
import { Icon } from "@rneui/base";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { useTheme } from "~/hooks/useTheme";

type EmptyProps = {
  title?: string;
  description?: string;
  iconName?: string;
  iconType?: string;
  style?: StyleProp<ViewStyle>;
};

const Empty = ({
  title = "Chưa có dữ liệu",
  description = "Hiện chưa có yêu cầu phê duyệt nào.",
  iconName = "inbox",
  iconType = "feather",
  style = {},
}: EmptyProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Icon name={iconName} type={iconType} size={40} color={colors.label} />
      </View>
      <Text title center color={colors.title} style={styles.title}>
        {title}
      </Text>
      <Text label center color={colors.label} style={styles.description}>
        {description}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  iconWrap: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  title: {
    // Letter spacing removed to follow global theme
  },
  description: {
    paddingHorizontal: 20,
  },
});

export default Empty;
