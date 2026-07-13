import { apiClient } from "../axios/client";
import {
  ReservationDetailData,
  ReservationFilterParams,
  ReservationItemData,
} from "./reservation.type";

export const reservationService = {
  getReservationList: async (params: ReservationFilterParams) => {
    const {
      pageIndex,
      pageSize,
      startDate,
      endDate,
      notiDate,
      keyword,
      sourceType,
      moduleType,
      plantId,
      departmentId,
      status,
      reservationNo,
      sapCode,
      requisitionerId,
      companyId,
      requisitionerName,
      createdByName,
      order_id,
      equipment,
      order_des,
      orderType,
      departmentName,
      currentApprover,
    } = params;

    // Determine module type from moduleType flag OR sourceType fallback
    const isMaintenance =
      moduleType === "REPAIR_DEMAND" || sourceType === "DichVu";
    const endpoint = isMaintenance
      ? "reservation-maintenance/pagination"
      : "reservation/pagination";

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (keyword) {
      where.code = keyword;
    }

    // Maintenance: notiDate single date filter
    if (isMaintenance && notiDate) {
      where.notiDate = notiDate;
    }

    // Demand: date range filter
    if (!isMaintenance && startDate && endDate) {
      where.createdAt = [startDate, endDate];
    }

    // Only add fields if they are defined
    if (plantId) where.plantId = plantId;
    if (departmentId) where.departmentId = departmentId;
    if (reservationNo) where.reservationNo = reservationNo;
    if (sapCode) where.sapCode = sapCode;
    if (requisitionerId) where.requisitionerId = requisitionerId;
    if (companyId) where.companyId = companyId;
    if (requisitionerName) where.requisitionerName = requisitionerName;
    if (createdByName) where.createdByName = createdByName;
    if (departmentName) where.departmentName = departmentName;
    if (currentApprover) where.currentApprover = currentApprover;

    if (sourceType) {
      where.sourceType = sourceType;
    }

    if (order_id) where.order_id = order_id;
    if (equipment) where.equipment = equipment;
    if (order_des) where.order_des = order_des;
    if (orderType) where.orderType = orderType;

    // Clean up "ALL" or empty values so the backend doesn't filter by them
    Object.keys(where).forEach((key) => {
      if (
        where[key] === "ALL" ||
        where[key] === "" ||
        where[key] === undefined ||
        where[key] === null
      ) {
        delete where[key];
      }
    });

    const payload = {
      where,
      skip: ((pageIndex || 1) - 1) * (pageSize || 10),
      take: pageSize || 10,
    };
    const res = await apiClient.post(endpoint, payload);
    return res;
  },

  getReservationDetail: async (id: string, isMaintenance?: boolean) => {
    const endpoint = isMaintenance
      ? "reservation-maintenance/load_detail"
      : "reservation/load_detail";
    const res = await apiClient.post(endpoint, { id });
    return res;
  },

  // sync from add-or-edit-reservation-maintenance.component.ts:347
  approveReservation: async (
    data: {
      id: string;
      orderType?: string;
      settle_order?: string;
      textActivities?: string;
      comment?: string;
    },
    isMaintenance?: boolean,
  ) => {
    if (isMaintenance) {
      const res = await apiClient.post("reservation-maintenance/approve", {
        id: data.id,
        orderType: data.orderType,
        settle_order: data.settle_order,
        textActivities: data.textActivities,
      });
      return res;
    }
    const res = await apiClient.post("reservation/update_approved", data);
    return res;
  },

  // sync from add-or-edit-reservation-maintenance.component.ts:393
  approveAndSyncReservation: async (
    data: {
      id: string;
      orderType?: string;
      settle_order?: string;
      textActivities?: string;
    },
    isMaintenance?: boolean,
  ) => {
    if (isMaintenance) {
      const res = await apiClient.post(
        "reservation-maintenance/approve_and_sync",
        {
          id: data.id,
          orderType: data.orderType,
          settle_order: data.settle_order,
          textActivities: data.textActivities,
        },
      );
      return res;
    }
    return null;
  },

  // sync from reservation-maintenance.component.ts:398
  rejectReservation: async (
    data: { id: string; comment?: string },
    isMaintenance?: boolean,
  ) => {
    if (isMaintenance) {
      const res = await apiClient.post("reservation-maintenance/reject", {
        id: data.id,
      });
      return res;
    }

    // sync from reservation.component.ts:354 → onRejectRule() → RESERVATION.UPDATE_REJECT_RULE
    // Admin api.service.ts:3690 → UPDATE_REJECT_RULE: 'reservation/update_reject_rule'
    const res = await apiClient.post("reservation/update_reject_rule", data);
    return res;
  },

  // sync from reservation-maintenance.component.ts:421
  requestReviewReservation: async (
    data: { id: string },
    isMaintenance?: boolean,
  ) => {
    if (isMaintenance) {
      const res = await apiClient.post(
        "reservation-maintenance/request_review",
        { id: data.id },
      );
      return res;
    }
    return null;
  },

  getPlants: async () => {
    const res = await apiClient.post("employee/find_list_plant", {});
    return res;
  },

  getDepartments: async (companyId?: string) => {
    const res = await apiClient.post("employee/find_list_deparment", {
      companyId: companyId || "",
    });
    return res;
  },

  getEmployees: async (departmentId?: string) => {
    const res = await apiClient.get(
      `system/employee/all?departmentId=${departmentId || ""}`,
    );
    return res;
  },

  getGlAccounts: async (companyId?: string) => {
    const res = await apiClient.get(
      `sap/gl_account/all?companyId=${companyId || ""}`,
    );
    return res;
  },

  getOrders: async (companyId?: string) => {
    const res = await apiClient.get(
      `sap/order/all?companyId=${companyId || ""}`,
    );
    return res;
  },
};
