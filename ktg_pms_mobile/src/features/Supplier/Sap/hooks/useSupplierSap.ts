import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { supplierService } from "~/services/supplier/supplier.service";
import { SupplierSapFilterParams } from "~/services/supplier/supplier.type";

export const useSupplierSapFilterOptions = () => {
  return useQuery({
    queryKey: ["supplier-sap-filter-options"],
    queryFn: async () => {
      const [companiesRes] = await Promise.allSettled([
        supplierService.getCompanies(),
      ]);

      const getArray = (res: any) => {
        const body =
          res.status === "fulfilled" ? (res.value?.data ?? res.value) : [];
        return Array.isArray(body) ? body : body?.data || [];
      };

      return {
        companies: getArray(companiesRes),
      };
    },
  });
};

export const useSupplierSapList = (filters: SupplierSapFilterParams) => {
  return useInfiniteQuery({
    queryKey: ["supplier-sap-list", filters],
    queryFn: ({ pageParam = 1 }) =>
      supplierService.getSupplierSapList({
        ...filters,
        pageIndex: pageParam as number,
      }),
    getNextPageParam: (lastPage: any, allPages) => {
      const total = lastPage.data?.[1] || 0;
      const currentCount = allPages.reduce(
        (acc, page) => acc + (page.data?.[0]?.length || 0),
        0,
      );
      return currentCount < total ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

export const useSupplierSapDetail = (
  supplierNumberId: string | undefined,
  supplierId: string | undefined,
) => {
  return useQuery({
    queryKey: ["supplier-sap-detail", supplierNumberId, supplierId],
    queryFn: async () => {
      const [sapRes, supplierRes] = await Promise.all([
        supplierService.getSupplierSapDetail(supplierNumberId!),
        supplierService.getSupplierDetail(supplierId!),
      ]);

      const [groupRes, titleRes, stakeholderRes] = await Promise.allSettled([
        supplierService.getBusinessPartnerGroup(),
        supplierService.getTitle(),
        supplierService.getStakeholderCategory(),
      ]);

      const getBody = (res: any) => {
        const body = res?.data;
        if (body?.status && body?.data) return body.data;
        return body;
      };

      const sapData = getBody(sapRes);
      const supplierData = getBody(supplierRes);

      const getSettledList = (res: any) => {
        if (res.status === "fulfilled") {
          const body = res.value?.data;
          if (body?.status && body?.data) return body.data;
          return Array.isArray(body) ? body : [];
        }
        return [];
      };

      const groups = getSettledList(groupRes);
      const titles = getSettledList(titleRes);
      const stakeholders = getSettledList(stakeholderRes);

      if (sapData) {
        if (
          sapData.businessPartnerGroupId &&
          !sapData.businessPartnerGroupName
        ) {
          const matchedGroup = groups.find(
            (g: any) => g.id === sapData.businessPartnerGroupId,
          );
          if (matchedGroup) {
            sapData.businessPartnerGroupName = matchedGroup.name;
          }
        }

        if (sapData.titleCode && !sapData.titleName) {
          const matchedTitle = titles.find(
            (t: any) => t.code === sapData.titleCode,
          );
          if (matchedTitle) {
            sapData.titleName = matchedTitle.name || matchedTitle.name_vn;
          }
        }

        if (sapData.stakeholderCategoryId && !sapData.stakeholderCategoryName) {
          const matchedCategory = stakeholders.find(
            (c: any) => c.id === sapData.stakeholderCategoryId,
          );
          if (matchedCategory) {
            sapData.stakeholderCategoryName =
              matchedCategory.name || matchedCategory.name_vn;
          }
        }
      }

      return {
        dataObject: sapData,
        dataSupplier: supplierData,
      };
    },
    enabled: !!supplierNumberId && !!supplierId,
  });
};

export const useApproveSupplierSap = () => {
  return useMutation({
    mutationFn: (params: {
      id: string;
      supplierId: string;
      businessPartnerGroupId: string;
    }) => supplierService.approveSupplierSap(params),
  });
};

export const useRecheckSupplierSap = () => {
  return useMutation({
    mutationFn: (params: {
      id: string;
      listRole: any[];
      objectNote?: string | null;
    }) => supplierService.recheckSupplierSap(params),
  });
};
