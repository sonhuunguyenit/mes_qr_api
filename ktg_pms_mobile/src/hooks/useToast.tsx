import { Icon } from "@rneui/base";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "~/common";
import { useTheme } from "~/hooks/useTheme";

type ToastType =
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "notification"
  | "default";

export const useToast = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const CONFIG = useMemo<
    Record<
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
    >
  >(
    () => ({
      default: {
        bg: colors.surface as string,
        border: colors.border as string,
        title: colors.title as string,
        message: colors.label as string,
        iconName: "info",
        iconBg: colors.primary as string,
        iconColor: colors.label as string,
        iconType: "entypo",
        iconSize: 18,
      },
      success: {
        bg: colors.surface as string,
        border: colors.border as string,
        title: colors.green1 as string,
        message: colors.label as string,
        iconName: "check",
        iconBg: colors.green1 as string,
        iconColor: colors.white as string,
        iconType: "font-awesome-5",
        iconSize: 18,
      },
      info: {
        bg: colors.surface as string,
        border: colors.border as string,
        title: colors.blue1 as string,
        message: colors.label as string,
        iconName: "info",
        iconBg: colors.blue1 as string,
        iconColor: colors.white as string,
        iconType: "entypo",
        iconSize: 20,
      },
      warning: {
        bg: colors.surface as string,
        border: colors.border as string,
        title: colors.primary as string,
        message: colors.label as string,
        iconName: "info",
        iconBg: colors.primary as string,
        iconColor: colors.title as string,
        iconType: "font-awesome-5",
        iconSize: 18,
      },
      danger: {
        bg: colors.surface as string,
        border: colors.border as string,
        title: colors.red1 as string,
        message: colors.label as string,
        iconName: "times",
        iconBg: colors.red1 as string,
        iconColor: colors.white as string,
        iconType: "font-awesome-5",
        iconSize: 20,
      },
      notification: {
        bg: colors.surface as string,
        border: colors.border as string,
        title: colors.green1 as string,
        message: colors.label as string,
        iconName: "notifications-active",
        iconBg: colors.green1 as string,
        iconColor: colors.white as string,
        iconType: "material",
        iconSize: 22,
      },
    }),
    [colors],
  );

  const showToast = React.useCallback(
    ({
      type,
      message,
      title,
      onPress,
    }: {
      type: ToastType;
      message: string;
      title?: string;
      onPress?: () => void;
    }) => {
      const c = CONFIG[type];

      showMessage({
        message: "",
        position: "top",
        floating: true,
        duration: 5000,
        hideOnPress: true,
        statusBarHeight: 0,
        onPress,
        style: {
          backgroundColor: "transparent",
          marginTop: 25,
        },

        renderCustomContent: () => (
          <View
            style={[
              styles.container,
              {
                backgroundColor: c.bg,
                borderColor: c.border,
                shadowColor: colors.black as string,
              },
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
    },
    [CONFIG, colors.black],
  );

  return {
    showToast,
  };
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
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
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
  },
});
