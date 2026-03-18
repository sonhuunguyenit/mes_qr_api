import { Icon } from "@rneui/base";
import React, { useCallback } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Block, Header, Linear, Row, Text } from "~/common";
import { Container, Scroll, Status } from "~/components";
import { useAuth } from "~/hooks/useAuth";
import { useModal } from "~/hooks/useModal";
import { useTheme } from "~/hooks/useTheme";
import { useWaiting } from "~/hooks/useWaiting";

type Props = {};
const UserInfo = (props: Props) => {
  const { colors } = useTheme();

  const { user, onLogout } = useAuth();

  const { show, hide } = useModal();

  const { start, stop } = useWaiting();

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

  return (
    <Linear>
      <Container>
        <Header title="Thông tin cá nhân" showSearch={false} />

        <Scroll
          gap={10}
          contentContainerStyle={{
            flexGrow: 1,
            margin: 10,
          }}
        >
          <Block
            title="Thông tin cá nhân"
            icon={{ name: "person-outline", size: 20 }}
            style={{
              height: 200,
              // flexGrow: 1,
            }}
          >
            {null}
          </Block>

          <View style={styles.actionSection}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => {}}>
              <Row align="center" gap={12}>
                <View style={[styles.miniIcon, { backgroundColor: "#F1F5F9" }]}>
                  <Icon name="lock-outline" size={20} color="#64748B" />
                </View>
                <Text bold color="#1E293B">
                  Đổi mật khẩu
                </Text>
              </Row>
              <Icon name="chevron-right" size={20} color="#CBD5E1" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, { borderBottomWidth: 0 }]}
              onPress={handleLogout}
            >
              <Row align="center" gap={12}>
                <View style={[styles.miniIcon, { backgroundColor: "#FFF1F2" }]}>
                  <Icon name="logout" size={20} color="#EF4444" />
                </View>
                <Text bold color="#EF4444">
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
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#F8FAFC",
  },
});

export default UserInfo;
