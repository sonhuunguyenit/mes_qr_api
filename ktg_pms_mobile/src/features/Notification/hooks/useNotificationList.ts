import { useInfiniteQuery } from "@tanstack/react-query";

export const useNotificationList = (params: any) => {
  return useInfiniteQuery<any>({
    queryKey: ["notification-list", params],
    queryFn: ({ pageParam = 1 }) => [],
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return [];
    },
  });
};
