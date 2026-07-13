import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useToast } from "~/hooks/useToast";
import { supplierLockService } from "~/services/supplier/supplier-lock.service";
import { SupplierLockFilterParams } from "~/services/supplier/supplier-lock.type";

export const useSupplierLockService = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const useLockServiceList = (filters: SupplierLockFilterParams) =>
    useInfiniteQuery({
      queryKey: ["supplier-lock-service-list", filters],
      queryFn: ({ pageParam = 1 }) =>
        supplierLockService.getSupplierLockList({
          ...filters,
          pageIndex: pageParam,
          type: "LSS",
        }),
      getNextPageParam: (lastPage, allPages) => {
        const total = lastPage.data?.[1] || 0;
        const currentCount = allPages.reduce(
          (acc, page) => acc + (page.data?.[0]?.length || 0),
          0,
        );
        return currentCount < total ? allPages.length + 1 : undefined;
      },
      initialPageParam: 1,
    });

  const useLockServiceDetail = (id?: string) =>
    useQuery({
      queryKey: ["supplier-lock-service-detail", id],
      queryFn: () => supplierLockService.getSupplierLockDetail(id!),
      enabled: !!id,
      select: (res) => res.data,
    });

  const useApproveService = () =>
    useMutation({
      mutationFn: supplierLockService.approveSupplierLock,
      onSuccess: (res: any) => {
        showToast({
          type: "success",
          message: res.data?.message || "Duyệt thành công",
        });
        queryClient.invalidateQueries({
          queryKey: ["supplier-lock-service-list"],
        });
        queryClient.invalidateQueries({
          queryKey: ["supplier-lock-service-detail"],
        });
      },
      onError: (err: any) => {
        showToast({
          type: "danger",
          message:
            err?.response?.data?.message || err?.message || "Duyệt thất bại",
        });
      },
    });

  const useRejectService = () =>
    useMutation({
      mutationFn: supplierLockService.rejectSupplierLock,
      onSuccess: (res: any) => {
        showToast({
          type: "success",
          message: res.data?.message || "Từ chối thành công",
        });
        queryClient.invalidateQueries({
          queryKey: ["supplier-lock-service-list"],
        });
        queryClient.invalidateQueries({
          queryKey: ["supplier-lock-service-detail"],
        });
      },
      onError: (err: any) => {
        showToast({
          type: "danger",
          message:
            err?.response?.data?.message || err?.message || "Từ chối thất bại",
        });
      },
    });

  return {
    useLockList: useLockServiceList,
    useLockDetail: useLockServiceDetail,
    useApprove: useApproveService,
    useReject: useRejectService,
  };
};
