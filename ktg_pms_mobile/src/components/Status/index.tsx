import { Icon } from "@rneui/base";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Text } from "~/common";
import { sizes } from "~/constants/sizes";
import { useTheme } from "~/hooks/useTheme";

export interface StatusProps {
  type:
    | "success"
    | "error"
    | "warning"
    | "info"
    | "accept"
    | "refuse"
    | "recheck";
  title?: string;
  message?: string;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  messageStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

export const Status = ({
  type,
  title,
  message,
  style,
  titleStyle,
  messageStyle,
  children,
}: StatusProps) => {
  const { colors } = useTheme();

  const STATUS_CONFIG = {
    success: {
      name: "check-circle",
      type: "material",
      size: 60,
      color: colors.statusSuccess,
      titleColor: colors.statusSuccessTitle,
      messageColor: colors.statusMessage,
    },
    error: {
      name: "error",
      type: "material",
      size: 60,
      color: colors.statusError,
      titleColor: colors.statusErrorTitle,
      messageColor: colors.statusMessage,
    },
    warning: {
      name: "warning",
      type: "ionicon",
      size: 60,
      color: colors.statusWarning,
      titleColor: colors.statusWarningTitle,
      messageColor: colors.statusMessage,
    },
    info: {
      name: "info",
      type: "material",
      size: 60,
      color: colors.statusInfo,
      titleColor: colors.statusInfoTitle,
      messageColor: colors.statusMessage,
    },
    accept: {
      name: "fountain-pen-tip",
      type: "material-community",
      size: 75,
      color: colors.statusInfo,
      titleColor: colors.statusInfoTitle,
      messageColor: colors.statusMessage,
    },
    refuse: {
      name: "hand-back-right-off",
      type: "material-community",
      size: 60,
      color: colors.statusError,
      titleColor: colors.statusErrorTitle,
      messageColor: colors.statusMessage,
    },
    recheck: {
      name: "file-document-edit-outline",
      type: "material-community",
      size: 60,
      color: colors.statusWarning,
      titleColor: colors.statusWarningTitle,
      messageColor: colors.statusMessage,
    },
  };

  const currentStatus = STATUS_CONFIG[type];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[localStyles.container, style]}>
        <View
          style={{
            backgroundColor: (currentStatus.color as string) + "15",
            height: 100,
            width: 100,
            borderRadius: 999,
            marginBottom: 10,
            borderWidth: 0.25,
            borderColor: currentStatus.color,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon {...(currentStatus as any)} />
        </View>

        <View style={localStyles.textContainer}>
          {title && (
            <Text
              weight="600"
              style={[
                localStyles.title,
                { color: currentStatus.titleColor },
                titleStyle,
              ]}
            >
              {title}
            </Text>
          )}
          {message && (
            <Text
              weight="500"
              style={[
                localStyles.message,
                { color: currentStatus.messageColor },
                messageStyle,
              ]}
            >
              {message}
            </Text>
          )}
        </View>
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
};

const localStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    marginTop: 5,
  },
  title: {
    fontSize: sizes.fontSize.lg,
    textAlign: "center",
  },
  message: {
    marginTop: 8,
    marginBottom: 8,
    textAlign: "center",
    fontSize: sizes.fontSize.base,
  },
});
export const StatusBadge = ({
  value,
  color,
  bgColor,
  borderColor,
}: {
  value: string;
  color?: any;
  bgColor?: string;
  borderColor?: string;
}) => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        badgeStyles.statusBadge,
        {
          backgroundColor:
            bgColor || (color ? color + "15" : (colors.neutral15 as string)),
          borderColor: borderColor || color || (colors.neutral300 as string),
        },
      ]}
    >
      <Text bold color={color} size={11}>
        {value}
      </Text>
    </View>
  );
};

const badgeStyles = StyleSheet.create({
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
    minHeight: 24,
    justifyContent: "center",
    borderWidth: 1,
  },
});
