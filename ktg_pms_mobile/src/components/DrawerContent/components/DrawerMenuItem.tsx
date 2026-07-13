import { Row } from "~/common";
import { Icon, Text } from "@rneui/themed";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "~/hooks/useTheme";

interface DrawerMenuItemProps {
  title: string;
  icon: string;
  color: string;
  bg: string;
  onPress: () => void;
  showDivider?: boolean;
}

export const DrawerMenuItem = ({
  title,
  icon,
  color,
  bg,
  onPress,
  showDivider,
}: DrawerMenuItemProps) => {
  const { colors } = useTheme();
  return (
    <View>
      <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <Row gap={12}>
          <View style={[styles.miniIconBox, { backgroundColor: bg }]}>
            <Icon name={icon} type="material" color={color} size={18} />
          </View>
          <Text style={[styles.menuItemText, { color: colors.slate600 as string }]}>
            {title}
          </Text>
        </Row>
      </TouchableOpacity>
      {showDivider && (
        <View
          style={[styles.menuDivider, { backgroundColor: colors.border as string }]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    paddingVertical: 12,
    paddingLeft: 25,
  },
  miniIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: "500",
  },
  menuDivider: {
    height: 1,
    marginLeft: 60,
  },
});
