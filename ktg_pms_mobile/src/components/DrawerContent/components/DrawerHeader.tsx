import { Column, Linear, Row, Text } from "~/common";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  avatarUrl?: string;
  fullName?: string;
  username?: string;
};

export const DrawerHeader = ({ avatarUrl, fullName, username }: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <Linear
      style={{
        minHeight: 100,
      }}
    >
      <View style={[styles.userSection, { paddingTop: insets.top + 20 }]}>
        <Row gap={15}>
          {/* <Avatar
            size={55}
            source={{
              uri: avatarUrl,
            }}
          /> */}
          <Column justify="center" align="flex-start">
            <Text style={styles.greeting}>{fullName}</Text>
            <Text style={styles.userName}>{username}</Text>
          </Column>
        </Row>
      </View>
    </Linear>
  );
};

const styles = StyleSheet.create({
  userSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  greeting: {
    fontSize: 13,
    color: "#64748B",
  },
  userName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1E293B",
  },
});
