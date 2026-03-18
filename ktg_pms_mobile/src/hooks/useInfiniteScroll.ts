import { useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

export type ApiPaginationRequest<T> = {
  pageIndex: number;
  pageSize: number;
} & T;

export type ApiPaginationResponse<T> = {
  data: T[];
  total: number;
};

type Props<Rq, Rs> = {
  queryKey: unknown[];
  fetchPage: (
    params: ApiPaginationRequest<Rs>
  ) => Promise<ApiPaginationResponse<Rq>>;
  pageSize?: number;
};

export const useInfiniteScroll = <T, Rq = T, Rs = {}>({
  queryKey,
  fetchPage,
  pageSize = 10,
}: Props<Rq, Rs>) => {
  const query = useInfiniteQuery<ApiPaginationResponse<Rq>, Error>({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetchPage({
        pageIndex: pageParam as number,
        pageSize,
      } as ApiPaginationRequest<Rs>);

      return {
        data: response.data as Rq[],
        total: response.total as number,
      };
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.data.length < pageSize ? undefined : allPages.length + 1,
    initialPageParam: 1,
  });

  const data: Rq[] = query.data?.pages.flatMap((p) => p.data) ?? [];

  const onEndReached = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  return {
    data,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    onEndReached,
    refetch: query.refetch,
    isError: query.isError,
    error: query.error,
  };
};
