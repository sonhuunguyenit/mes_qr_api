import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { notificationService } from "~/services/notification/notification.service";
import { NotificationItem } from "~/services/notification/notification.type";

const PAGE_SIZE = 15;

export const useNotificationList = (params?: Record<string, unknown>) => {
  const query = useInfiniteQuery({
    queryKey: ["notification-list", params],
    queryFn: async ({ pageParam = 1 }) => {
      const take = pageParam * PAGE_SIZE;
      const res = await notificationService.getNotifications(take);
      const rawNotify = res.data?.lstNotify || [];
      const lstNotify = rawNotify.map((item) => ({
        ...item,
        url: item.url || item.path || "",
      }));
      const numNotifyNew = res.data?.numNotifyNew || 0;

      // Slice only the new items for this page
      const startIdx = (pageParam - 1) * PAGE_SIZE;
      const endIdx = pageParam * PAGE_SIZE;
      const pageData = lstNotify.slice(startIdx, endIdx);

      return {
        data: pageData,
        numNotifyNew,
        totalLoaded: lstNotify.length,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.data.length < PAGE_SIZE) {
        return undefined;
      }
      return allPages.length + 1;
    },
  });

  const data = useMemo(() => {
    return query.data?.pages.flatMap((p) => p.data) ?? [];
  }, [query.data?.pages]);

  const numNotifyNew = query.data?.pages[0]?.numNotifyNew ?? 0;

  return {
    data,
    numNotifyNew,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    refetch: query.refetch,
  };
};
