import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  RESERVATION_MAINTENANCE_STATUS_DISPLAY,
  RESERVATION_TYPE_DISPLAY,
} from "~/enums/reservation.enum";
import { reservationService } from "~/services/reservation/reservation.service";
import { ReservationFilterParams } from "~/services/reservation/reservation.type";

export const useReservationMaintenanceFilterOptions = (companyId?: string) => {
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
        statuses: RESERVATION_MAINTENANCE_STATUS_DISPLAY,
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

// // sync from reservation-maintenance.component.ts:197-246
export const mapReservationMaintenanceStatusStyle = (item: any) => {
  if (!item) return item;
  const status = item.status;
  let statusName = status;
  let statusColor = "#d9d9d9";
  let statusBorderColor = "#d9d9d9";
  let statusBgColor = "#fafafa";

  switch (status) {
    case "NEW":
      statusName = "Mới tạo";
      statusColor = "#1890ff"; // Blue
      statusBorderColor = "#91d5ff";
      statusBgColor = "#e6f7ff";
      break;
    case "DRAFT":
      statusName = "Lưu Tạm";
      statusColor = "#d9d9d9"; // Grey
      statusBorderColor = "#d9d9d9";
      statusBgColor = "#fafafa";
      break;
    case "PENDING":
      statusName = "Đang duyệt";
      statusColor = "#faad14"; // Orange
      statusBorderColor = "#ffe58f";
      statusBgColor = "#fffbe6";
      break;
    case "APPROVED":
      // Nếu đã có order_id (đã đồng bộ SAP) thì hiển thị "Đã đồng bộ", ngược lại "Đã duyệt"
      if (item.order_id) {
        statusName = "Đã đồng bộ";
      } else {
        statusName = "Đã duyệt";
      }
      statusColor = "#52c41a"; // Green
      statusBorderColor = "#b7eb8f";
      statusBgColor = "#f6ffed";
      break;
    case "REJECTED":
      statusName = "Từ chối";
      statusColor = "#f5222d"; // Red
      statusBorderColor = "#ffa39e";
      statusBgColor = "#fff1f0";
      break;
    case "REQUEST_REVIEW":
      statusName = "Yêu cầu kiểm tra lại";
      statusColor = "#ff9800"; // Orange/Amber
      statusBorderColor = "#ffb74d";
      statusBgColor = "#fff3e0";
      break;
  }

  return {
    ...item,
    statusName,
    statusColor,
    statusBorderColor,
    statusBgColor,
  };
};

export const useReservationMaintenanceList = (filters: ReservationFilterParams) => {
  return useInfiniteQuery({
    queryKey: ["reservation-list", filters],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await reservationService.getReservationList({
        ...filters,
        pageIndex: pageParam as number,
      });
      // Map status style to list items directly here
      if (res) {
        const body = res.data || res;
        const actualData = Array.isArray(body) ? body : body?.data || [];
        const items = Array.isArray(actualData[0]) ? actualData[0] : [];
        if (Array.isArray(items)) {
          items.forEach((item: any, idx: number) => {
            items[idx] = mapReservationMaintenanceStatusStyle(item);
          });
        }
      }
      return res;
    },
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
  const transformed = {
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
  return mapReservationMaintenanceStatusStyle(transformed);
};

export const useReservationMaintenanceDetail = (
  id: string | undefined,
  isMaintenance?: boolean,
) => {
  return useQuery({
    queryKey: ["reservationDetail", id, isMaintenance],
    queryFn: () => reservationService.getReservationDetail(id!, isMaintenance),
    enabled: !!id,
    select: (res: any) => transformReservationDetail(res?.data || res),
  });
};
