import { View, RefreshControl } from "react-native";
import React from "react";
import { Block, Header, Linear, Spacer, Text } from "~/common";
import { Container, Scroll } from "~/components";
import { Icon } from "@rneui/base";
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
      <Container style={{}}>
        <Header title="Thông báo" showBack showSearch={false} />

        <Block title="Thông báo gần đây">
          <Scroll
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 5,
              paddingTop: 10,
            }}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={refetch} />
            }
            showsVerticalScrollIndicator={false}
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
