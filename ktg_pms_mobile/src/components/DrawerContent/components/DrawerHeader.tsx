import { Column, Linear, Row, Text } from "~/common";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "~/hooks/useTheme";

type Props = {
  avatarUrl?: string;
  fullName?: string;
  username?: string;
};

export const DrawerHeader = ({ avatarUrl, fullName, username }: Props) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <Linear
      style={{
        minHeight: 100,
      }}
    >
      <View
        style={[
          styles.userSection,
          {
            paddingTop: insets.top + 20,
            borderBottomColor: colors.slate100 as string,
          },
        ]}
      >
        <Row gap={15}>
          <Column justify="center" align="flex-start">
            <Text style={[styles.greeting, { color: colors.slate500 as string }]}>
              {fullName}
            </Text>
            <Text style={[styles.userName, { color: colors.slate800 as string }]}>
              {username}
            </Text>
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
  },
  greeting: {
    fontSize: 13,
  },
  userName: {
    fontSize: 17,
    fontWeight: "800",
  },
});
