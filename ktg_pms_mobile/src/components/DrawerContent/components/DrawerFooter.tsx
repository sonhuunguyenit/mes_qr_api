import { useAuth } from "~/hooks/useAuth";
import { useModal } from "~/hooks/useModal";
import { Icon, Text } from "@rneui/themed";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Status } from "~/components/Status";
import { useTheme } from "~/hooks/useTheme";

export const DrawerFooter = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { onLogout } = useAuth();
  const { show, hide } = useModal();

  const handleLogout = React.useCallback(() => {
    show({
      type: "modal",
      component: (
        <Status type="warning" message="Bạn chắc chắn muốn đăng xuất" />
      ),
      style: {
        width: 340,
      },
      onConfirm: async () => {
        hide();
        await onLogout();
      },
      onCancel: () => hide(),
    });
  }, [show, hide, onLogout]);

  return (
    <View
      style={[
        styles.logoutSection,
        {
          paddingBottom: insets.bottom + 20,
          borderTopColor: colors.slate100 as string,
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: colors.rose50 as string }]}
        onPress={handleLogout}
      >
        <Icon name="log-out" type="feather" size={18} color={colors.rose500 as string} />
        <Text style={[styles.logoutText, { color: colors.rose500 as string }]}>
          Đăng xuất
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  logoutSection: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 12,
  },
  logoutText: { fontWeight: "700", marginLeft: 8 },
});
