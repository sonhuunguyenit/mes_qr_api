import { DrawerContentComponentProps } from "@react-navigation/drawer";
import React from "react";
import { Platform, StyleSheet, UIManager, View } from "react-native";
import { useTheme } from "~/hooks/useTheme";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const menuItems = [];

export const DrawerContent = (props: DrawerContentComponentProps) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.surface as string }]}>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  menuWrapper: { marginTop: 10 },
});
