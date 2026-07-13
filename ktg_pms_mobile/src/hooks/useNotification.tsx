import { useEffect, useRef } from "react";
import messaging, {
  AuthorizationStatus,
  FirebaseMessagingTypes,
  getInitialNotification,
  getMessaging,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
  registerDeviceForRemoteMessages,
  requestPermission,
} from "@react-native-firebase/messaging";
import { Linking, Platform } from "react-native";
import StorageHelper from "~/utils/storage";
import { STORAGE_KEYS } from "~/constants/storage";
import { useToast } from "./useToast";
import { useMutation } from "@tanstack/react-query";
import * as Device from "expo-device";
import { authService } from "~/services/auth/auth.service";
import {
  setPendingUrl,
  getPendingUrl,
  clearPendingUrl,
  handleOpenURL,
} from "~/utils/deepLink";

const deviceId =
  Device.osInternalBuildId ?? Device.deviceName ?? "unknown-device";

type PermissionCallback = (enabled: boolean) => void;

interface UseNotificationProps {
  user?: any;
  isLoadingUser?: boolean;
  onPermission?: PermissionCallback;
}

export const useNotification = ({
  user,
  isLoadingUser,
  onPermission,
}: UseNotificationProps = {}) => {
  const { showToast } = useToast();

  const onPermissionRef = useRef(onPermission);

  const authStateRef = useRef({ user, isLoadingUser });

  useEffect(() => {
    authStateRef.current = { user, isLoadingUser };
  }, [user, isLoadingUser]);

  // Hàm xử lý URL: Nếu chưa đăng nhập hoặc đang tải session thì lưu tạm vào bộ đệm (Pending), ngược lại mở link chuyển trang ngay
  const processOrBufferURL = (url: string) => {
    const { user: latestUser, isLoadingUser: latestIsLoading } =
      authStateRef.current;
    if (latestIsLoading || !latestUser) {
      // Chưa đăng nhập xong -> Lưu tạm link này lại để chờ đăng nhập xong sẽ chuyển tiếp
      setPendingUrl(url);
    } else {
      // Đã đăng nhập rồi -> Thực hiện phân tích link và điều hướng sang trang đích
      handleOpenURL(url);
    }
  };

  // Trình xử lý click chung cho thông báo đẩy
  const handleNotificationPress = (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ) => {
    let url = remoteMessage.data?.url;
    console.log("remoteMessage", remoteMessage);

    // Nếu Firebase gửi dữ liệu đóng gói dạng stringify (navigation) dùng chung với Web
    if (!url && typeof remoteMessage.data?.navigation === "string") {
      try {
        const nav = JSON.parse(remoteMessage.data.navigation as string);
        url = nav?.url; // Trích xuất link URL thực tế bên trong
      } catch (e) {
        // fail silently
      }
    }

    if (typeof url === "string") {
      processOrBufferURL(url); // Gửi URL qua bộ lọc điều hướng
    }
  };

  // Tự động chuyển tiếp khi tải xong session (hoặc người dùng vừa Đăng nhập thành công)
  useEffect(() => {
    if (!isLoadingUser && user) {
      const url = getPendingUrl(); // Lấy URL tạm đang chờ trong bộ đệm ra
      if (url) {
        handleOpenURL(url); // Thực hiện nhảy tới trang đích
        clearPendingUrl(); // Xóa link khỏi bộ đệm
      }
    }
  }, [user, isLoadingUser]);

  useEffect(() => {
    onPermissionRef.current = onPermission;
  }, [onPermission]);

  const registerFCMToken = useMutation({
    mutationFn: async (fcmToken: string) => {
      console.log("registerFCMToken", {
        deviceUniqueId: deviceId,
        platform: Platform.OS,
        fcmToken,
        userId: user?.userId,
      });
      if (user?.userId) {
        await authService.registerFCMToken({
          userId: user.userId,
          fcmToken,
          deviceToken: deviceId,
        });
      }
    },
  });

  useEffect(() => {
    const messaging = getMessaging();

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
        onPermissionRef.current?.(false);

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

      onPermissionRef.current?.(true);
    };

    requestPermissionAndToken();

    // Luồng xử lý khi người dùng đang mở App (Foreground)
    const unsubscribeForeground = onMessage(messaging, (remoteMessage) => {
      if (!remoteMessage) return;

      const { title, body } = remoteMessage.notification || {};

      if (title && body) {
        // Tự hiện Toast thông báo nội bộ ở trên cùng của App
        showToast({
          type: "default",
          title,
          message: body,
          onPress: () => {
            console.log("showToast");
            // Khi nhấn vào Toast -> Gọi trình xử lý điều hướng tương tự như khi click thông báo ở background
            handleNotificationPress(remoteMessage);
          },
        });
      }
    });

    // Luồng 2: Xử lý khi ứng dụng đang CHẠY NGẦM (Background - người dùng bấm Home ẩn app đi)
    // Khi có thông báo đẩy tới, hệ thống hiển thị Banner. Người dùng bấm vào Banner sẽ kích hoạt sự kiện này để mở app.
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
          // Gọi trình xử lý điều hướng
          handleNotificationPress(remoteMessage);
        }
      },
    );

    // Token Refresh: Firebase cấp lại token mới (reinstall, restore device, v.v.)
    // Tự động cập nhật token mới lên backend để push notification không bị gián đoạn
    const unsubscribeTokenRefresh = onTokenRefresh(
      messaging,
      async (newToken) => {
        await StorageHelper.set(STORAGE_KEYS.FCM_TOKEN, newToken);
        if (user?.userId) {
          await authService.registerFCMToken({
            userId: user.userId,
            fcmToken: newToken,
            deviceToken: deviceId,
          });
        }
      },
    );

    return () => {
      unsubscribeForeground();
      unsubscribeBackground();
      unsubscribeTokenRefresh();
    };
  }, [user?.userId]);

  // Luồng 3: Xử lý khi ứng dụng đang TẮT HOÀN TOÀN (Killed state)
  // Chỉ chạy đúng 1 lần khi app khởi động lần đầu - không được phụ thuộc vào user để tránh gọi lại nhiều lần
  useEffect(() => {
    const msg = getMessaging();
    getInitialNotification(msg).then((remoteMessage) => {
      if (remoteMessage) {
        handleNotificationPress(remoteMessage);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
};
