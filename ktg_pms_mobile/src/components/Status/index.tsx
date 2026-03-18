import { Icon } from "@rneui/base";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { Text } from "~/common";
import { sizes } from "~/constants/sizes";

export const STATUS_TYPES = {
  success: {
    name: "check-circle",
    type: "material",
    size: 80,
    color: "#40cc4d",
    titleColor: "#1e5e24",
    messageColor: "#2d8a36",
  },
  error: {
    name: "error",
    type: "material",
    size: 80,
    color: "#f95959",
    titleColor: "#7d2121",
    messageColor: "#b03e3e",
  },
  warning: {
    name: "warning",
    type: "ionicon",
    size: 80,
    color: "#ffc000",
    titleColor: "#664d03",
    messageColor: "#856404",
  },
  info: {
    name: "info",
    type: "material",
    size: 80,
    color: "#3f97fd",
    titleColor: "#084298",
    messageColor: "#0d6efd",
  },
};

export interface StatusProps {
  type: "success" | "error" | "warning" | "info";
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
  const Status = STATUS_TYPES[type];

  return (
    <View style={[localStyles.container, style]}>
      <Icon {...Status} />
      <View style={localStyles.textContainer}>
        {title && (
          <Text
            weight="600"
            style={[
              localStyles.title,
              { color: Status.titleColor },
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
              { color: Status.messageColor },
              messageStyle,
            ]}
          >
            {message}
          </Text>
        )}
      </View>
      {children}
    </View>
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
    fontSize: sizes.fontSize.xxl,
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
  color?: string;
  bgColor?: string;
  borderColor?: string;
}) => {
  return (
    <View
      style={[
        badgeStyles.statusBadge,
        {
          backgroundColor: bgColor || color + "15" || "#f0f0f0",
          borderColor: borderColor || color || "#d9d9d9",
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
    borderRadius: 20, // Pill shape
    alignSelf: "flex-start",
    minHeight: 24,
    justifyContent: "center",
    borderWidth: 1,
  },
});
