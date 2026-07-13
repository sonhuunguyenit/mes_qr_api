import messaging from "@react-native-firebase/messaging";
import { Icon } from "@rneui/base";
import React, { useCallback, useEffect, useState } from "react";
import {
  AppState,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Block,
  Header,
  InfoRow,
  Linear,
  Row,
  Spacer,
  Switch,
  Text,
} from "~/common";
import { Container, Scroll, Status } from "~/components";
import { useSheet } from "~/contexts/SheetContext";
import { useAuth } from "~/hooks/useAuth";
import { useModal } from "~/hooks/useModal";
import { useTheme } from "~/hooks/useTheme";
import { useWaiting } from "~/hooks/useWaiting";
import ChangePasswordSheet from "../components/ChangePasswordSheet";
import UserAvatar from "../components/UserAvatar";

type Props = {};
const UserInfo = (props: Props) => {
  const { colors, setAppTheme, isDark } = useTheme();

  const { user, onLogout } = useAuth();

  const { show, hide } = useModal();

  const { start, stop } = useWaiting();

  const { openSheet } = useSheet();

  const [notificationGranted, setNotificationGranted] = useState(false);

  const checkPermissions = useCallback(async () => {
    try {
      // check notification
      const authStatus = await messaging().hasPermission();
      const enabled =
        authStatus === 1 || // AUTHORIZED
        authStatus === 2; // PROVISIONAL
      setNotificationGranted(enabled);
    } catch (error) {
      console.log("Check permission error", error);
    }
  }, []);

  useEffect(() => {
    checkPermissions();
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        checkPermissions();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [checkPermissions]);

  const handleLogout = useCallback(() => {
    show({
      type: "modal",
      component: (
        <Status type="warning" message="Bạn chắc chắn muốn đăng xuất" />
      ),
      style: { width: 320 },
      onConfirm: async () => {
        hide();
        try {
          start();
          await onLogout();
        } finally {
          stop();
        }
      },
      onCancel: () => hide(),
    });
  }, []);

  const openSettings = () => {
    Linking.openSettings();
  };

  const openChangePasswordSheet = useCallback(() => {
    openSheet(<ChangePasswordSheet />);
  }, [openSheet]);

  return (
    <Linear>
      <Header
        title="Tài khoản"
        subTitle="Thiết lập thông tin và cấu hình"
        showBack={true}
        showNotification={false}
      />
      <Spacer size={5} />

      <Container>
        <Scroll gap={10}>
          <Block>
            <UserAvatar user={user} />
          </Block>

          <Block
            title="Thông tin cá nhân"
            icon={{ name: "person-outline", size: 20 }}
          >
            <View
              style={{
                marginLeft: 6,
              }}
            >
              <InfoRow
                label="Tài khoản"
                value={user?.name}
                icon={{ name: "account-outline" }}
                style={{ flex: 1 }}
                editable
              />

              <InfoRow
                label="Họ tên"
                value={user?.name}
                icon={{ name: "badge-account-outline" }}
                editable
              />

              <InfoRow
                label="Phòng ban"
                value={""}
                icon={{ name: "office-building-outline" }}
                editable
              />
              <InfoRow
                label="Chức vụ"
                value={""}
                icon={{ name: "briefcase-outline" }}
                editable
              />
              <InfoRow
                label="Email"
                value={""}
                icon={{ name: "email-outline" }}
                editable
                last
              />
            </View>
          </Block>

          <Block title="Hệ thống" icon={{ name: "settings", size: 20 }}>
            <View
              style={{
                marginLeft: 6,
              }}
            >
              <View style={styles.actionBtn}>
                <Row align="center" gap={12}>
                  <View
                    style={[
                      styles.miniIcon,
                      { backgroundColor: colors.disabledBg },
                    ]}
                  >
                    <Icon
                      name="notifications"
                      type="material"
                      size={20}
                      color={colors.label as string}
                    />
                  </View>
                  <Text bold color={colors.title}>
                    Thông báo
                  </Text>
                </Row>

                <Switch
                  onValueChange={openSettings}
                  value={notificationGranted}
                  activeColor={colors.primary}
                  containerStyle={{ minHeight: 0, paddingVertical: 0 }}
                />
              </View>

              {/* <View
                style={[
                  styles.actionBtn,
                  { borderTopWidth: 1, borderColor: colors.divider },
                ]}
              >
                <Row align="center" gap={12}>
                  <View
                    style={[
                      styles.miniIcon,
                      { backgroundColor: colors.disabledBg },
                    ]}
                  >
                    <Icon
                      name={isDark ? "dark-mode" : "light-mode"}
                      type="material"
                      size={20}
                      color={colors.label as string}
                    />
                  </View>
                  <Text bold color={colors.title}>
                    Giao diện tối
                  </Text>
                </Row>

                <Switch
                  onValueChange={(val) => setAppTheme(val ? "dark" : "light")}
                  value={isDark}
                  activeColor={colors.primary}
                  containerStyle={{ minHeight: 0, paddingVertical: 0 }}
                />
              </View> */}
            </View>
          </Block>

          <View
            style={[styles.actionSection, { backgroundColor: colors.card }]}
          >
            <TouchableOpacity
              style={[styles.actionBtn, { borderColor: colors.divider }]}
              onPress={openChangePasswordSheet}
            >
              <Row align="center" gap={12}>
                <View
                  style={[
                    styles.miniIcon,
                    { backgroundColor: colors.disabledBg },
                  ]}
                >
                  <Icon
                    name="lock-outline"
                    size={20}
                    color={colors.label as string}
                  />
                </View>
                <Text bold color={colors.title}>
                  Đổi mật khẩu
                </Text>
              </Row>
              <Icon
                name="chevron-right"
                size={20}
                color={colors.disabled as string}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, { borderBottomWidth: 0 }]}
              onPress={handleLogout}
            >
              <Row align="center" gap={12}>
                <View
                  style={[styles.miniIcon, { backgroundColor: colors.lredBg }]}
                >
                  <Icon
                    name="logout"
                    size={20}
                    color={colors.error as string}
                  />
                </View>
                <Text bold color={colors.error}>
                  Đăng xuất
                </Text>
              </Row>
            </TouchableOpacity>
          </View>
        </Scroll>
      </Container>
    </Linear>
  );
};

const styles = StyleSheet.create({
  miniIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  actionSection: {
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
});

export default UserInfo;
