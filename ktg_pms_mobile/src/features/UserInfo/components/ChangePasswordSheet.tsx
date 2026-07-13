import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Icon } from "@rneui/base";
import React, { memo, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Spacer, Text } from "~/common";
import Input from "~/common/Input";
import { HeaderSheet } from "~/components";
import { useSheet } from "~/contexts/SheetContext";
import { useToast } from "~/hooks/useToast";
import { useWaiting } from "~/hooks/useWaiting";
import { useTheme } from "~/hooks/useTheme";

interface ChangePasswordSheetProps {
  onSuccess?: () => void;
}

export const ChangePasswordSheet = memo(
  ({ onSuccess }: ChangePasswordSheetProps) => {
    const { colors } = useTheme();
    const { showToast } = useToast();
    const insets = useSafeAreaInsets();
    const { start, stop } = useWaiting();
    const { closeSheet } = useSheet();
    const [isProcessing, setIsProcessing] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
      control,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm({
      defaultValues: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
    });

    const onSubmit = (data: any) => {
      if (data.newPassword !== data.confirmPassword) {
        showToast({
          type: "danger",
          message: "Mật khẩu xác nhận không khớp",
        });
        return;
      }

      setIsProcessing(true);
      start();
      setTimeout(() => {
        stop();
        setIsProcessing(false);
        showToast({ type: "success", message: "Đổi mật khẩu thành công" });
        reset();
        closeSheet();
        onSuccess?.();
      }, 1500);
    };

    return (
      <View style={{ flex: 1 }}>
        <HeaderSheet
          type="detail"
          title="Đổi mật khẩu"
          iconName="lock-closed"
          iconType="ionicon"
          onClose={closeSheet}
        />

        <BottomSheetScrollView
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={Platform.OS === "android"}
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: insets.bottom + 16,
          }}
        >
          <View style={styles.form}>
            <Controller
              control={control}
              name="oldPassword"
              rules={{ required: "Vui lòng nhập mật khẩu cũ" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputGroup}>
                  <Text bold label style={styles.label}>
                    Mật khẩu cũ
                  </Text>
                  <Input
                    placeholder="Nhập mật khẩu cũ"
                    secureTextEntry={!showOldPassword}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={errors.oldPassword?.message}
                    InputComponent={TextInput}
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => setShowOldPassword(!showOldPassword)}
                      >
                        <Icon
                          name={showOldPassword ? "eye" : "eye-off"}
                          type="feather"
                          size={18}
                          color={colors.label as string}
                        />
                      </TouchableOpacity>
                    }
                  />
                </View>
              )}
            />

            <Spacer size={10} />

            <Controller
              control={control}
              name="newPassword"
              rules={{
                required: "Vui lòng nhập mật khẩu mới",
                minLength: {
                  value: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputGroup}>
                  <Text bold label style={styles.label}>
                    Mật khẩu mới
                  </Text>
                  <Input
                    placeholder="Nhập mật khẩu mới"
                    secureTextEntry={!showNewPassword}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={errors.newPassword?.message}
                    InputComponent={TextInput}
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => setShowNewPassword(!showNewPassword)}
                      >
                        <Icon
                          name={showNewPassword ? "eye" : "eye-off"}
                          type="feather"
                          size={18}
                          color={colors.label as string}
                        />
                      </TouchableOpacity>
                    }
                  />
                </View>
              )}
            />

            <Spacer size={10} />

            <Controller
              control={control}
              name="confirmPassword"
              rules={{ required: "Vui lòng xác nhận mật khẩu mới" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputGroup}>
                  <Text bold label style={styles.label}>
                    Xác nhận mật khẩu mới
                  </Text>
                  <Input
                    placeholder="Nhập lại mật khẩu mới"
                    secureTextEntry={!showConfirmPassword}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={errors.confirmPassword?.message}
                    InputComponent={TextInput}
                    rightIcon={
                      <TouchableOpacity
                        onPress={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        <Icon
                          name={showConfirmPassword ? "eye" : "eye-off"}
                          type="feather"
                          size={18}
                          color={colors.label as string}
                        />
                      </TouchableOpacity>
                    }
                  />
                </View>
              )}
            />

        </View>
      </BottomSheetScrollView>
      <View
        style={[
          styles.footer,
          {
            borderTopColor: colors.border,
            paddingBottom: insets.bottom + 10,
            backgroundColor: colors.surface as string,
          },
        ]}
      >
        <Button
          title="Đổi mật khẩu"
          onPress={handleSubmit(onSubmit)}
          loading={isProcessing}
          disabled={isProcessing}
          full
          titleStyle={{
            color: colors.black,
            fontWeight: "700",
            fontSize: 16,
          }}
        />
      </View>
    </View>
  );
});

ChangePasswordSheet.displayName = "ChangePasswordSheet";

const styles = StyleSheet.create({
  form: {
    paddingVertical: 10,
  },
  inputGroup: {
    gap: 5,
  },
  label: {
    fontSize: 14,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
});

export default ChangePasswordSheet;
