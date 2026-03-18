import { STATUS_TYPES, StatusProps } from "~/components/Status";
import { useCallback } from "react";
import { showMessage } from "react-native-flash-message";

type UseAlertParams = StatusProps;

export const useAlert = () => {
  const showAlert = useCallback(
    ({
      type = "info",
      title = "Thông báo",
      message = "Đang xử lý, vui lòng chờ...",
      style,
      titleStyle,
      messageStyle,
    }: UseAlertParams) => {
      const { titleColor, messageColor } = STATUS_TYPES[type];

      showMessage({
        style: style ? [style] : undefined,
        message: title,
        description: message,
        titleStyle: [{ color: titleColor }, titleStyle],
        textStyle: [{ color: messageColor }, messageStyle],
      });
    },
    [],
  );

  return { showAlert };
};
