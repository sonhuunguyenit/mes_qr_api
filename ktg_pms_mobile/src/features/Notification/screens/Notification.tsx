import { Icon } from "@rneui/base";
import React from "react";
import { RefreshControl, View } from "react-native";
import { Block, Header, Linear, Spacer, Text } from "~/common";
import { Container, Scroll } from "~/components";
import { useTheme } from "~/hooks/useTheme";
import { useNotificationList } from "../hooks/useNotificationList";

const Notification = () => {
  const { colors } = useTheme();

  const {
    data: lstNotifcation,
    isLoading,
    isRefetching,
    refetch,
  } = useNotificationList({});

  return (
    <Linear style={{ flex: 1 }}>
      <Container>
        <Header title="Thông tin cá nhân" showBack={true} />

        <Block
          title="Thông báo gần đây"
          style={{ marginHorizontal: 5, marginTop: 10 }}
        >
          <Scroll
            style={{ flex: 1 }}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={refetch} />
            }
          >
            <View
              style={{
                padding: 40,
                alignItems: "center",
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#F3F4F6",
              }}
            >
              <Icon
                name="search"
                type="feather"
                size={40}
                color={colors.disabled}
              />
              <Spacer size={16} />
              <Text color={colors.label} weight="500">
                Không tìm thấy module phù hợp
              </Text>
            </View>
          </Scroll>
        </Block>
      </Container>
    </Linear>
  );
};

export default Notification;
