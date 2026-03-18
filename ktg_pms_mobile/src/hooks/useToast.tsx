import React from "react";
import { View, StyleSheet } from "react-native";
import { showMessage } from "react-native-flash-message";
import { Icon } from "@rneui/base";
import { Text } from "~/common";
import { colors } from "~/constants/colors";

type ToastType =
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "notification"
  | "default";

const CONFIG: Record<
  ToastType,
  {
    bg: string;
    border: string;
    title: string;
    message: string;
    iconName: string;
    iconBg: string;
    iconColor: string;
    iconType: string;
    iconSize: number;
  }
> = {
  default: {
    bg: "#ffffff",
    border: colors.primary,
    title: colors.primary,
    message: colors.label,
    iconName: "info",
    iconBg: "#f3f4f6",
    iconColor: "#000000",
    iconType: "entypo",
    iconSize: 18,
  },
  success: {
    bg: "rgba(64,204,77,0.95)",
    border: "rgba(255,255,255,1)",
    title: "rgba(255,255,255,1)",
    message: "rgba(255,255,255,1)",
    iconName: "check",
    iconBg: "rgba(255,255,255,0.25)",
    iconColor: "rgba(255,255,255,1)",
    iconType: "font-awesome-5",
    iconSize: 18,
  },
  info: {
    bg: "rgba(63,151,253,0.95)",
    border: "rgba(255,255,255,1)",
    title: "rgba(255,255,255,1)",
    message: "rgba(255,255,255,1)",
    iconName: "info",
    iconBg: "rgba(255,255,255,0.25)",
    iconColor: "rgba(255,255,255,1)",
    iconType: "entypo",
    iconSize: 20,
  },
  warning: {
    bg: "rgba(255,192,0,0.95)",
    border: "rgba(255,255,255,1)",
    title: "rgba(255,255,255,1)",
    message: "rgba(255,255,255,1)",
    iconName: "exclamation",
    iconBg: "rgba(255,255,255,0.25)",
    iconColor: "rgba(255,255,255,1)",
    iconType: "font-awesome-5",
    iconSize: 18,
  },
  danger: {
    bg: "rgba(249,89,89,0.95)",
    border: "rgba(255,255,255,1)",
    title: "rgba(255,255,255,1)",
    message: "rgba(255,255,255,1)",
    iconName: "error-outline",
    iconBg: "rgba(255,255,255,0.25)",
    iconColor: "rgba(255,255,255,1)",
    iconType: "material",
    iconSize: 24,
  },
  notification: {
    bg: colors.lgreenBg,
    border: colors.green,
    title: colors.green,
    message: colors.label,
    iconName: "error-outline",
    iconBg: "rgba(255,255,255,0.25)",
    iconColor: "rgba(255,255,255,1)",
    iconType: "material",
    iconSize: 24,
  },
};

export const useToast = () => {
  const showToast = ({
    type,
    message,
    title,
  }: {
    type: ToastType;
    message: string;
    title?: string;
  }) => {
    const c = CONFIG[type];

    showMessage({
      message: "",
      position: "top",
      floating: true,
      duration: 2000,
      hideOnPress: true,
      statusBarHeight: 40,
      style: {
        backgroundColor: "transparent",
        marginHorizontal: 12,
        marginTop: 10,
      },
      renderCustomContent: () => (
        <View
          style={[
            styles.container,
            { backgroundColor: c.bg, borderColor: c.border },
          ]}
        >
          <View style={styles.content}>
            <View style={[styles.iconWrap, { backgroundColor: c.iconBg }]}>
              <Icon
                name={c.iconName}
                type={c.iconType}
                size={c.iconSize}
                color={c.iconColor}
              />
            </View>

            <View style={styles.textWrap}>
              {title && (
                <Text color={c.title} style={styles.title}>
                  {title}
                </Text>
              )}
              <Text color={c.message} style={styles.message}>
                {message}
              </Text>
            </View>
          </View>
        </View>
      ),
    });
  };

  return {
    showToast,
  };
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textWrap: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 18,
  },
});
