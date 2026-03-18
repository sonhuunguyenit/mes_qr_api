import { useEffect, useState } from "react";
import * as Updates from "expo-updates";

export const useExpoUpdate = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const checkAndFetchUpdate = async () => {
      if (__DEV__) {
        console.log("Expo Update: Skipping check in __DEV__ mode");
        return;
      }

      try {
        console.log("Expo Update: Checking for updates...");
        const updateCheck = await Updates.checkForUpdateAsync();

        if (updateCheck.isAvailable) {
          console.log("Expo Update: New update available, downloading...");
          setIsUpdating(true);

          await Updates.fetchUpdateAsync();

          console.log("Expo Update: Update downloaded, reloading app...");
          // Lệnh này bắt buộc app phải khởi động lại để áp dụng code mới
          await Updates.reloadAsync();
        } else {
          console.log("Expo Update: No updates available.");
        }
      } catch (error) {
        console.error("Expo Update Error:", error);
      } finally {
        setIsUpdating(false);
      }
    };

    checkAndFetchUpdate();
  }, []);

  return { isUpdating };
};
