import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "~/services/notification/notification.service";

export const useNotificationActions = () => {
  const queryClient = useQueryClient();

  const readMutation = useMutation({
    mutationFn: (id: string) => notificationService.readNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-list"] });
    },
  });

  return {
    readNotification: readMutation.mutateAsync,
    isReading: readMutation.isPending,
  };
};
