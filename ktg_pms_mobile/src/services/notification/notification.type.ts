export interface NotificationItem {
  id: string;
  isNew: boolean;
  message: string;
  messageFull: string;
  createdAt: string;
  url: string;
  path?: string;
  type?: string;
}

export interface NotificationResponse {
  lstNotify: NotificationItem[];
  numNotifyNew: number;
}
export interface LoadNotificationParams {
  take: number;
}
export interface ReadNotificationResponse {
  success: boolean;
  message?: string;
}
