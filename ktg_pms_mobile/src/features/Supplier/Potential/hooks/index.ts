import { useInfiniteQuery, useQuery, useMutation } from "@tanstack/react-query";
import { supplierPotentialService } from "~/services/supplier/supplier-potential.service";

export const useSupplierPotentialList = (filters: any) => {
  return useInfiniteQuery({
    queryKey: ["supplierPotentialList", filters],
    queryFn: ({ pageParam = 1 }) =>
      supplierPotentialService.getSupplierPotentialList({
        ...filters,
        pageIndex: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages) => {
      const body = lastPage.data;
      const total = Array.isArray(body)
        ? body[1]
        : body?.enumData?.Page?.total || 0;

      const currentCount = allPages.reduce((acc, page) => {
        const pBody = page.data;
        const pItems = Array.isArray(pBody) ? pBody[0] : pBody?.data || [];
        return acc + (pItems?.length || 0);
      }, 0);

      return currentCount < total ? allPages.length + 1 : undefined;
    },
  });
};

export const useSupplierPotentialDetail = (id: string) => {
  return useQuery({
    queryKey: ["supplierPotentialDetail", id],
    queryFn: () => supplierPotentialService.getSupplierPotentialDetail(id),
    enabled: !!id,
  });
};

export const useSupplierPotentialServices = (supplierId: string) => {
  return useQuery({
    queryKey: ["supplierPotentialServices", supplierId],
    queryFn: () => supplierPotentialService.getSupplierPotentialServices(supplierId),
    enabled: !!supplierId,
  });
};

export const useApproveSupplierPotential = () => {
  return useMutation({
    mutationFn: (data: any) => supplierPotentialService.approveSupplierPotential(data),
  });
};

export const useRecheckSupplierPotential = () => {
  return useMutation({
    mutationFn: (data: any) => supplierPotentialService.recheckSupplierPotential(data),
  });
};

export const useBusinessTypes = () => {
  return useQuery({
    queryKey: ["businessTypes"],
    queryFn: () => supplierPotentialService.getBusinessTypes(),
  });
};
export * from "./useSupplierPotentialFilterOptions";
