import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  RESERVATION_STATUS_DISPLAY,
  RESERVATION_TYPE_DISPLAY,
} from "~/enums/reservation.enum";
import { reservationService } from "~/services/reservation/reservation.service";
import { ReservationFilterParams } from "~/services/reservation/reservation.type";

export const useReservationDemandFilterOptions = (companyId?: string) => {
  return useQuery({
    queryKey: ["reservation-filter-options", companyId],
    queryFn: async () => {
      const [plantRes, deptRes] = await Promise.allSettled([
        reservationService.getPlants(),
        reservationService.getDepartments(companyId),
      ]);

      const getArray = (res: any) => {
        const body =
          res.status === "fulfilled" ? (res.value?.data ?? res.value) : [];
        const actualData = Array.isArray(body) ? body : body?.data || [];
        // Support nested data property { data: { data: [...] } }
        return Array.isArray(actualData) ? actualData : actualData?.data || [];
      };

      const formatLabel = (item: any) => {
        const code =
          item.code || item.plantCode || item.departmentCode || item.id;
        const name =
          item.name || item.plantName || item.departmentName || item.label;
        return code && name && code !== name
          ? `${code} - ${name}`
          : name || code;
      };

      return {
        statuses: RESERVATION_STATUS_DISPLAY,
        reservationTypes: RESERVATION_TYPE_DISPLAY,
        plants: getArray(plantRes).map((item: any) => ({
          label: formatLabel(item),
          value: item.id,
        })),
        departments: getArray(deptRes).map((item: any) => ({
          label: formatLabel(item),
          value: item.id,
        })),
      };
    },
  });
};

export const useReservationDemandList = (filters: ReservationFilterParams) => {
  return useInfiniteQuery({
    queryKey: ["reservation-list", filters],
    queryFn: ({ pageParam = 1 }) =>
      reservationService.getReservationList({
        ...filters,
        pageIndex: pageParam as number,
      }),
    getNextPageParam: (lastPage: any, allPages) => {
      // Support both [data, total] and { data, total } formats
      const data =
        lastPage?.data || (Array.isArray(lastPage) ? lastPage : null);
      const total = Array.isArray(data) ? data[1] : lastPage?.total || 0;

      const currentCount = allPages.reduce((acc, page) => {
        const pageData = page?.data || (Array.isArray(page) ? page : null);
        const items = Array.isArray(pageData) ? pageData[0] : page?.data || [];
        return acc + (items?.length || 0);
      }, 0);
      return currentCount < total ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

export const formatLabel = (item: any) => {
  const code = item.code || item.plantCode || item.departmentCode || item.id;
  const name = item.name || item.plantName || item.departmentName || item.label;
  return code && name && code !== name ? `${code} - ${name}` : name || code;
};

export const transformReservationDetail = (data: any) => {
  if (!data) return data;
  return {
    ...data,
    companyLabel: data.companyLabel || data.companyCode || data.plantCode,
    glAccountLabel:
      data.glAccountLabel ||
      (data.glAccountCode && data.glAccountName
        ? `${data.glAccountCode} - ${data.glAccountName}`
        : data.glAccountCode || data.glAccountName),
    requisitionerLabel:
      data.requisitionerLabel ||
      (data.requisitionerCode && data.requisitionerName
        ? `${data.requisitionerCode} - ${data.requisitionerName}`
        : data.requisitionerCode || data.requisitionerName),
    plantLabel:
      data.plantLabel ||
      (data.plantCode && data.plantName
        ? `${data.plantCode} - ${data.plantName}`
        : data.plantCode || data.plantName),
    departmentLabel:
      data.departmentLabel ||
      (data.departmentCode && data.departmentName
        ? `${data.departmentCode} - ${data.departmentName}`
        : data.departmentCode || data.departmentName),
  };
};

export const useReservationDemandDetail = (
  id: string | undefined,
  isMaintenance?: boolean,
) => {
  return useQuery({
    queryKey: ["reservationDetail", id, isMaintenance],
    queryFn: () => reservationService.getReservationDetail(id!, isMaintenance),
    enabled: !!id,
    select: (res: any) => transformReservationDetail(res?.data),
  });
};
