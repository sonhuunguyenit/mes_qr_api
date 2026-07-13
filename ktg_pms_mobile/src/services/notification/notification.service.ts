import { AxiosResponse } from "axios";
import { apiClient } from "../axios/client";
import {
  NotificationResponse,
  ReadNotificationResponse,
} from "./notification.type";

const ENDPOINTS = {
  LOAD: "/employeeNotify/load",
  READ: "/employeeNotify/read",
  READ_ALL: "/employeeNotify/read_all",
};

export const notificationService = {
  getNotifications: async (
    take: number,
  ): Promise<AxiosResponse<NotificationResponse>> => {
    return apiClient.post(ENDPOINTS.LOAD, { take });
  },

  readNotification: async (
    id: string,
  ): Promise<AxiosResponse<ReadNotificationResponse>> => {
    return apiClient.post(ENDPOINTS.READ, { id });
  },

  readAllNotifications: async (): Promise<
    AxiosResponse<ReadNotificationResponse>
  > => {
    return apiClient.post(ENDPOINTS.READ_ALL, {});
  },
};
export default notificationService;
