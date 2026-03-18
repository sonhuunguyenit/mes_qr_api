import { useEffect } from "react";
import messaging, {
  AuthorizationStatus,
  FirebaseMessagingTypes,
  getInitialNotification,
  getMessaging,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  registerDeviceForRemoteMessages,
  requestPermission,
} from "@react-native-firebase/messaging";
import { Linking, Platform } from "react-native";
import StorageHelper from "~/utils/storage";
import { STORAGE_KEYS } from "~/constants/storage";
import { useToast } from "./useToast";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import * as Device from "expo-device";

const deviceId =
  Device.osInternalBuildId ?? Device.deviceName ?? "unknown-device";

type NotificationCallback = (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  state: "foreground" | "background" | "quit",
) => void;
type PermissionCallback = (enabled: boolean) => void;

interface UseNotificationProps {
  onNotification?: NotificationCallback;
  onPermission?: PermissionCallback;
}

export const useNotification = ({
  onNotification,
  onPermission,
}: UseNotificationProps = {}) => {
  const { user } = useAuth();

  const registerFCMToken = useMutation({
    mutationFn: async (fcmToken: string) => {
      console.log("registerFCMToken", {
        deviceUniqueId: deviceId,
        platform: Platform.OS,
        fcmToken,
      });
      // await notificationService.registerFCMToken({
      //   deviceUniqueId: deviceId,
      //   platform: Platform.OS,
      //   fcmToken,
      // });
    },
  });

  useEffect(() => {
    const messaging = getMessaging();
    const { showToast } = useToast();

    const requestPermissionAndToken = async () => {
      const authStatus = await requestPermission(messaging, {
        alert: true,
        badge: true,
        sound: true,
      });

      const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        onPermission?.(false);

        Platform.OS === "ios"
          ? Linking.openURL("app-settings:")
          : Linking.openSettings();

        return;
      }

      if (Platform.OS === "ios") {
        await registerDeviceForRemoteMessages(messaging);
      }

      const fcmToken = await getToken(messaging);

      if (fcmToken) {
        await StorageHelper.set(STORAGE_KEYS.FCM_TOKEN, fcmToken);
        await registerFCMToken.mutateAsync(fcmToken);
      }

      onPermission?.(true);
    };

    requestPermissionAndToken();

    // Foreground
    const unsubscribeForeground = onMessage(messaging, (remoteMessage) => {
      if (!remoteMessage) return;

      const { title, body } = remoteMessage.notification || {};

      if (title && body) {
        showToast({
          type: "default",
          title,
          message: body,
        });
        onNotification?.(remoteMessage, "foreground");
      }
    });

    // Background
    const unsubscribeBackground = onNotificationOpenedApp(
      messaging,
      (remoteMessage) => {
        if (remoteMessage) {
          const { title, body } = remoteMessage.notification || {};

          showToast({
            type: "default",
            title,
            message: body!,
          });
          onNotification?.(remoteMessage, "background");
        }
      },
    );

    // Quit
    getInitialNotification(messaging).then((remoteMessage) => {
      if (remoteMessage) {
        const { title, body } = remoteMessage.notification || {};

        showToast({
          type: "default",
          title,
          message: body!,
        });
        onNotification?.(remoteMessage, "quit");
      }
    });

    return () => {
      unsubscribeForeground();
      unsubscribeBackground();
    };
  }, [onNotification, onPermission]);
};
