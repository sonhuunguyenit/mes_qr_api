import { Column, Row, Text } from "~/common";
import { colors } from "~/constants/colors";
import { UserStorage } from "~/contexts/AuthContext";
import { useToast } from "~/hooks/useToast";
import { useWaiting } from "~/hooks/useWaiting";
import { Avatar, Icon } from "@rneui/base";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const AVATAR_SIZE = 70;

type Props = {
  user?: UserStorage | null;
  userInfo?: any;
};

const UserAvatar = ({ user, userInfo }: Props) => {
  const queryClient = useQueryClient();
  const { start, stop } = useWaiting();
  const { showToast } = useToast();

  const uploadAvatarMutation = useMutation({
    mutationFn: async (imageUri: string) => {
      if (!user?.employeeId) {
        throw new Error("No employee ID available");
      }
      start();
      //   return userService.uploadAvatar(user.employeeId, imageUri);
    },
    onSuccess: () => {
      showToast({ type: "success", message: "Cập nhật thông tin thành công" });
      queryClient.invalidateQueries({
        queryKey: ["userInfo", user?.employeeId],
      });
    },
    onError: (error) => {
      console.error("Avatar upload error:", error);
    },
    onSettled: () => {
      stop();
    },
  });

  const handleUpload = async () => {
    // const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    // if (!permission.granted) {
    //   return;
    // }
    // const result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsEditing: true,
    //   aspect: [1, 1],
    //   quality: 0.8,
    // });
    // if (result.canceled) return;
    // const asset = result.assets[0];
    // uploadAvatarMutation.mutate(asset.uri);
  };

  return (
    <Row
      padding={10}
      gap={10}
      background="#fff"
      border={{ radius: 24 }}
      align="center"
    >
      <TouchableOpacity onPress={handleUpload} activeOpacity={0.8}>
        <View>
          <Avatar
            size={AVATAR_SIZE}
            source={{
              uri: userInfo?.avatarUrlMobile,
            }}
            onPress={handleUpload}
          />
          <View style={styles.cameraBtn}>
            <Icon name="photo-camera" size={16} color={colors.primary} />
          </View>
        </View>
      </TouchableOpacity>

      <Column gap={4} justify="center">
        <Text bold size={20} color="#0F172A">
          {null}
          {/* {user?.fullName || "User"} */}
        </Text>
        <Text size={14} color="#64748B">
          {null}
          {/* {userInfo?.positionName} • {user?.username} */}
        </Text>
      </Column>
    </Row>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "#F1F5F9",
    borderWidth: 3,
    borderColor: colors.primary,
  },

  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 99,
    elevation: 2,
  },
});

export default UserAvatar;
