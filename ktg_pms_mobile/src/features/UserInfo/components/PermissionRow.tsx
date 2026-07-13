import { Row, Switch, Text } from "~/common";
import { Icon } from "@rneui/base";
import React from "react";
import { StyleSheet, View, ColorValue } from "react-native";
import { useTheme } from "~/hooks/useTheme";

interface PermissionRowProps {
  label: string;
  icon: string;
  isGranted: boolean;
  onPress: () => void;
  iconType?: string;
  color?: string | ColorValue;
  bg?: string | ColorValue;
}

export const PermissionRow = ({
  label,
  icon,
  isGranted,
  onPress,
  iconType = "material",
  color,
  bg,
}: PermissionRowProps) => {
  const { colors } = useTheme();

  const activeColor = color || colors.primary;
  const activeBg = bg || colors.lgrayBg;

  return (
    <View style={[styles.container, { borderBottomColor: colors.divider as string }]}>
      <Row gap={12} align="center">
        <View style={[styles.iconContainer, { backgroundColor: activeBg as string }]}>
          <Icon
            name={icon}
            type={iconType}
            size={18}
            color={colors.lgrayIcon as string}
          />
        </View>
        <Text label color={colors.label as string}>
          {label}
        </Text>
      </Row>

      <Switch
        onValueChange={onPress}
        value={isGranted}
        activeColor={activeColor as string}
        containerStyle={{ minHeight: 0, paddingVertical: 0 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
  },
});
