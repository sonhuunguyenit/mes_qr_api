import { Button, Row } from "~/common";
import { TextProps, getFontStyle } from "~/common/Text";
import { PADDING_HORIZONTAL } from "~/constants";
import { colors } from "~/constants/colors";
import React from "react";
import { StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { SafeAreaProvider } from "react-native-safe-area-context";

type Props = {
  labelConfirm?: string;
  labelConfirmStyle?: TextProps;
  labelCancel?: string;
  labelCancelStyle?: TextProps;
  onConfirm?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  /** Tắt safe area insets padding (dùng khi component cha đã xử lý padding) */
  disableInsets?: boolean;
};

export const ButtonsBottom = ({
  labelConfirm = "Xác nhận",
  labelConfirmStyle,
  labelCancel = "Huỷ bỏ",
  labelCancelStyle,
  onConfirm,
  onCancel,
  isLoading,
  disableInsets,
}: Props) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        !disableInsets && {
          paddingBottom: insets.bottom > 0 ? insets.bottom : 16,
          paddingTop: 12,
        },
      ]}
    >
      <Row gap={12}>
        {/* Nút Xác nhận */}
        {onConfirm && (
          <Button
            title={labelConfirm || "Xác nhận"}
            onPress={onConfirm}
            loading={isLoading}
            containerStyle={{ flex: 1 }}
            buttonStyle={{
              height: 50,
              borderRadius: 50,
              backgroundColor: colors.primary,
            }}
            titleStyle={[
              { color: colors.white, ...getFontStyle("700") },
              labelConfirmStyle,
            ]}
          />
        )}

        {/* Nút Huỷ bỏ */}
        {onCancel && (
          <Button
            title={labelCancel || "Huỷ bỏ"}
            onPress={onCancel}
            containerStyle={{ flex: 1 }}
            buttonStyle={{
              height: 50,
              borderRadius: 50,
              backgroundColor: colors.border,
            }}
            titleStyle={[
              { color: colors.gray, ...getFontStyle("700") },
              labelCancelStyle,
            ]}
          />
        )}
      </Row>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 10,
  },
  button: {
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  buttonConfirm: {
    backgroundColor: "#059669",
    borderColor: "#059669",
  },
  buttonCancel: {
    backgroundColor: "#F1F5F9",
    borderColor: "#E2E8F0",
  },
  buttonText: {
    fontSize: 16,
    textAlign: "center",
  },
});
