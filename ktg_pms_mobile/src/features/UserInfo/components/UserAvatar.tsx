import { Avatar, Icon } from "@rneui/base";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Column, Row, Text } from "~/common";
import { UserStorage } from "~/contexts/AuthContext";
import { useTheme } from "~/hooks/useTheme";

const AVATAR_SIZE = 90;

type Props = {
  user?: UserStorage | null;
  userInfo?: any;
};

const UserAvatar = ({ user, userInfo }: Props) => {
  const { colors } = useTheme();
  const handleUpload = async () => {
    // Logic for upload...
  };

  return (
    <Row align="center" gap={16} background="transparent">
      <TouchableOpacity onPress={handleUpload} activeOpacity={0.8}>
        <View>
          <Avatar
            size={AVATAR_SIZE}
            rounded
            source={{
              uri:
                userInfo?.avatarUrlMobile ||
                "https://ui-avatars.com/api/?name=" +
                  (user?.name || "User") +
                  "&background=random",
            }}
            onPress={handleUpload}
            containerStyle={{
              backgroundColor: colors.gray as string,
              borderWidth: 1.5,
              borderColor: colors.active as string,
            }}
            placeholderStyle={{ backgroundColor: colors.disabledBg as string }}
            renderPlaceholderContent={
              <Icon
                name="person"
                type="material"
                size={AVATAR_SIZE * 0.6}
                color={colors.inactive as string}
              />
            }
          />
          <View
            style={[styles.cameraBtn, { backgroundColor: colors.card as string }]}
          >
            <Icon
              name="photo-camera"
              size={16}
              color={colors.active as string}
            />
          </View>
        </View>
      </TouchableOpacity>

      <Column gap={2} full align="flex-start">
        <Text bold size={20} color={colors.title}>
          {user?.name || "User"}
        </Text>
        <Text size={14} color={colors.label}>
          {userInfo?.positionName || "Quản trị viên"}
        </Text>
      </Column>
    </Row>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    width: "100%",
  },
  avatarContainer: {
    borderWidth: 4,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cameraBtn: {
    position: "absolute",
    bottom: 5,
    right: 5,
    padding: 8,
    borderRadius: 20,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default UserAvatar;
