import { colors } from "~/constants/colors";
import { useAuth } from "~/hooks/useAuth";
import useUserInfo from "~/hooks/useUserInfo";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import messaging from "@react-native-firebase/messaging";
import React, { useCallback, useEffect, useState } from "react";
import {
  AppState,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  UIManager,
  View,
} from "react-native";
import { CollapsibleMenu } from "./components/CollapsibleMenu";
import { DrawerFooter } from "./components/DrawerFooter";
import { DrawerHeader } from "./components/DrawerHeader";
import { DrawerMenuItem } from "./components/DrawerMenuItem";
import { PermissionRow } from "./components/PermissionRow";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const menuItems = [];

export const DrawerContent = (props: DrawerContentComponentProps) => {
  const { user } = useAuth();

  // const { data: userInfo } = useUserInfo(user?.employeeId);

  const [locationGranted, setLocationGranted] = useState(false);

  const [notificationGranted, setNotificationGranted] = useState(false);

  const openSettings = () => {
    Linking.openSettings();
  };

  return (
    <View style={styles.container}>
      {/* <DrawerHeader
        avatarUrl={userInfo?.avatarUrlMobile ?? undefined}
        fullName={`${userInfo?.lastName} ${userInfo?.name}`}
        username={user?.username ?? undefined}
      /> */}

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.menuWrapper}>
          {/* <CollapsibleMenu
            title="Tiện ích nhân sự"
            icon="grid-view"
            defaultExpanded
          >
            {menuItems.map((item, index) => {
              const { key, ...rest } = item;
              return (
                <DrawerMenuItem
                  key={key}
                  {...rest}
                  showDivider={index < menuItems.length - 1}
                />
              );
            })}
          </CollapsibleMenu> */}

          {/* <CollapsibleMenu
            title="Tiện ích quản trị viên"
            icon="admin-panel-settings"
            iconBg="#F1F5F9"
          >
            {adminMenu.map((item, index) => (
              <DrawerMenuItem
                key={index}
                {...item}
                showDivider={index < adminMenu.length - 1}
              />
            ))}
          </CollapsibleMenu> */}

          <CollapsibleMenu title="Hệ thống" icon="admin-panel-settings">
            <PermissionRow
              label="Vị trí"
              icon="location-on"
              isGranted={locationGranted}
              onPress={openSettings}
              // color="#ef4444"
              // bg="#fef2f2"
            />
            <PermissionRow
              label="Thông báo"
              icon="notifications"
              isGranted={notificationGranted}
              onPress={openSettings}
              // color="#f59e0b"
              // bg="#fffbeb"
            />
            <PermissionRow
              label="Camera"
              icon="camera-alt"
              isGranted={locationGranted}
              onPress={openSettings}
              // color="#3b82f6"
              // bg="#eff6ff"
            />
          </CollapsibleMenu>
        </View>
      </ScrollView>

      <DrawerFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  menuWrapper: { marginTop: 10 },
});
