import { useCallback } from "react";
import { useModal } from "./useModal";

export const useWaiting = () => {
  const { show, hide } = useModal();

  const start = useCallback(
    (title?: string, message?: string) => {
      show({
        type: "loading",
        style: {
          minWidth: 160,
        },
        title: title || "Đang xử lý",
        message: message || "Vui lòng đợi ... ",
        overlay: false,
        dismissible: false,
        dividerFooter: false,
      });
    },
    [show],
  );

  const stop = useCallback(() => {
    hide();
  }, [hide]);

  return { start, stop };
};
