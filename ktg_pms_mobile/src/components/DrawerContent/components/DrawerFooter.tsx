import { useAuth } from "~/hooks/useAuth";
import { useModal } from "~/hooks/useModal";
import { Icon, Text } from "@rneui/themed";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Status } from "~/components/Status";

export const DrawerFooter = () => {
  const insets = useSafeAreaInsets();
  const { onLogout } = useAuth();
  const { show, hide } = useModal();

  const handleLogout = React.useCallback(() => {
    show({
      type: "modal",
      component: (
        <Status type="warning" message="Bạn chắc chắn muốn đăng xuất" />
      ),
      style: {
        width: 320,
      },
      onConfirm: async () => {
        hide();
        await onLogout();
      },
      onCancel: () => hide(),
    });
  }, [show, hide, onLogout]);

  return (
    <View style={[styles.logoutSection, { paddingBottom: insets.bottom + 20 }]}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out" type="feather" size={18} color="#EF4444" />
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  logoutSection: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#FFF1F2",
  },
  logoutText: { color: "#EF4444", fontWeight: "700", marginLeft: 8 },
});
