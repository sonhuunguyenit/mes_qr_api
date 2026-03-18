import { Row, Text } from "~/common";
import { colors } from "~/constants/colors";
import { Icon } from "@rneui/base";
import React from "react";
import { StyleSheet, Switch, View } from "react-native";

interface PermissionRowProps {
  label: string;
  icon: string;
  isGranted: boolean;
  onPress: () => void;
  iconType?: string;
  color?: string;
  bg?: string;
}

export const PermissionRow = ({
  label,
  icon,
  isGranted,
  onPress,
  iconType = "material",
  color = colors.primary,
  bg = colors.lgrayBg,
}: PermissionRowProps) => {
  return (
    <View style={styles.container}>
      <Row gap={12} align="center">
        <View style={[styles.iconContainer, { backgroundColor: bg }]}>
          <Icon
            name={icon}
            type={iconType}
            size={18}
            color={colors.lgrayIcon}
          />
        </View>
        <Text label color={colors.label}>
          {label}
        </Text>
      </Row>

      <Switch
        trackColor={{ false: "#767577", true: colors.primary }}
        thumbColor={isGranted ? "#fff" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={onPress}
        value={isGranted}
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
    paddingLeft: 25,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lgrayBg,
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
