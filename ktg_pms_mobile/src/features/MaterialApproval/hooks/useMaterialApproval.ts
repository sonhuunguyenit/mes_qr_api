import { useInfiniteQuery, useQuery, useMutation } from "@tanstack/react-query";
import { AxiosResponse, AxiosError } from "axios";
import { materialService } from "~/services/material/material.service";
import {
  MaterialFilterParams,
  MaterialDropdownOption,
  MaterialItemData,
  MaterialApprovalDto,
  MaterialRejectSyncDto,
} from "~/services/material/material.type";
import { MATERIAL_STATUS_CONFIG } from "~/enums/material.enum";
import { ApiPaginationResponse } from "~/services/axios/api.types";

export const useMaterialFilterOptions = () => {
  return useQuery({
    queryKey: ["material-filter-options"],
    queryFn: async () => {
      const [matGroupRes, extMatGroupRes, plantRes, divisionRes] =
        await Promise.allSettled([
          materialService.getMaterialGroups(),
          materialService.getExternalMaterialGroups(),
          materialService.getPlants(),
          materialService.getDivisions(),
        ]);

      const getArray = (
        res: PromiseSettledResult<AxiosResponse<MaterialDropdownOption[]>>,
      ): MaterialDropdownOption[] => {
        const body =
          res.status === "fulfilled" ? (res.value?.data ?? res.value) : [];
        const dataArray = Array.isArray(body) ? body : (body as { data?: MaterialDropdownOption[] })?.data || [];
        return dataArray as MaterialDropdownOption[];
      };

      const formatLabel = (item: MaterialDropdownOption): string => {
        const { code, name } = item;
        return code && name && code !== name
          ? `${code} - ${name}`
          : name || code || "";
      };

      // Formulate statuses list from MATERIAL_STATUS_CONFIG
      const statuses = Object.keys(MATERIAL_STATUS_CONFIG).map((key) => ({
        label: MATERIAL_STATUS_CONFIG[key].label,
        value: key,
      }));

      const activeStatuses = [
        { label: "Hoạt động", value: "false" }, // isDeleted = false
        { label: "Không hoạt động", value: "true" }, // isDeleted = true
      ];

      return {
        statuses,
        activeStatuses,
        materialGroups: getArray(matGroupRes).map((item: MaterialDropdownOption) => ({
          label: formatLabel(item),
          value: item.id,
        })),
        externalMaterialGroups: getArray(extMatGroupRes).map((item: MaterialDropdownOption) => ({
          label: formatLabel(item),
          value: item.id,
        })),
        plants: getArray(plantRes).map((item: MaterialDropdownOption) => ({
          label: formatLabel(item),
          value: item.id,
        })),
        divisions: getArray(divisionRes).map((item: MaterialDropdownOption) => ({
          label: formatLabel(item),
          value: item.id,
        })),
      };
    },
  });
};

export const useMaterialList = (filters: MaterialFilterParams) => {
  return useInfiniteQuery({
    queryKey: ["material-list", filters],
    queryFn: ({ pageParam = 1 }) =>
      materialService.getMaterialList({
        ...filters,
        pageIndex: pageParam as number,
      }),
    getNextPageParam: (
      lastPage: AxiosResponse<ApiPaginationResponse<MaterialItemData>>,
      allPages: AxiosResponse<ApiPaginationResponse<MaterialItemData>>[],
    ) => {
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

export const useMaterialDetail = (id: string | undefined) => {
  return useQuery({
    queryKey: ["materialDetail", id],
    queryFn: () => materialService.getMaterialDetail(id!),
    enabled: !!id,
    select: (res: AxiosResponse<MaterialItemData>) => res?.data,
  });
};

export const useApproveMaterial = () => {
  return useMutation<AxiosResponse<{ message?: string }>, AxiosError<{ message?: string }>, string>({
    mutationFn: (id: string) => materialService.approveMaterial(id),
  });
};

export const useApproveMaterialSync = () => {
  return useMutation<
    AxiosResponse<{ message?: string }>,
    AxiosError<{ message?: string }>,
    MaterialApprovalDto
  >({
    mutationFn: (payload: MaterialApprovalDto) =>
      materialService.approveMaterialSync(payload),
  });
};

export const useRejectMaterialSync = () => {
  return useMutation<
    AxiosResponse<{ message?: string }>,
    AxiosError<{ message?: string }>,
    MaterialRejectSyncDto
  >({
    mutationFn: (payload: MaterialRejectSyncDto) =>
      materialService.rejectMaterialSync(payload),
  });
};

