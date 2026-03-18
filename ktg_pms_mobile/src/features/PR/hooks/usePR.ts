import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  PR_SOURCE_TYPE_DISPLAY,
  PR_STATUS_DISPLAY,
  PR_TYPE_DISPLAY,
} from "~/enums";
import { prService } from "~/services/pr/pr.service";
import { PRFilterParams } from "~/services/pr/pr.type";

export const usePRFilterOptions = () => {
  return useQuery({
    queryKey: ["pr-filter-options"],
    queryFn: async () => {
      const [matGroupRes, plantRes, pgRes] = await Promise.allSettled([
        prService.getExternalMaterialGroups(),
        prService.getPlants(),
        prService.getPurchaseGroups(),
      ]);

      const getArray = (res: any) => {
        const body =
          res.status === "fulfilled" ? (res.value?.data ?? res.value) : [];
        return Array.isArray(body) ? body : body?.data || [];
      };

      const formatLabel = (item: any) => {
        const { code, name } = item;
        return code && name && code !== name
          ? `${code} - ${name}`
          : name || code;
      };

      return {
        statuses: PR_STATUS_DISPLAY,
        prTypes: PR_TYPE_DISPLAY,
        sourceTypes: PR_SOURCE_TYPE_DISPLAY,
        externalMaterialGroups: getArray(matGroupRes).map((item: any) => ({
          label: formatLabel(item),
          value: item.id,
        })),
        plants: getArray(plantRes).map((item: any) => ({
          label: formatLabel(item),
          value: item.id,
        })),
        purchaseGroups: getArray(pgRes).map((item: any) => ({
          label: formatLabel(item),
          value: item.code,
        })),
      };
    },
  });
};

export const usePRList = (filters: PRFilterParams) => {
  return useInfiniteQuery({
    queryKey: ["pr-list", filters],
    queryFn: ({ pageParam = 1 }) =>
      prService.getPRList({ ...filters, pageIndex: pageParam as number }),
    getNextPageParam: (lastPage: any, allPages) => {
      const data = lastPage.data?.[0] || [];
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

export const usePRDetail = (id: string | undefined) => {
  return useQuery({
    queryKey: ["prDetail", id],
    queryFn: () => prService.getPRDetail(id!),
    enabled: !!id,
    select: (res: any) => res?.data,
  });
};
