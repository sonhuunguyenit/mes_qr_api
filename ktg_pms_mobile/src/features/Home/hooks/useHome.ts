import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useAuth } from "~/hooks/useAuth";
import { authService } from "~/services/auth/auth.service";
import { homeService } from "~/services/home/home.service";
import { ApprovalItem } from "~/services/home/home.type";
import { notificationService } from "~/services/notification/notification.service";
import { STATICS_APPROVE_MODULES } from "../constants";
import { Module, ModuleItem } from "../types";

export const useHome = () => {
  const { user } = useAuth();

  const {
    data: approvalData,
    isLoading: isLoadingApproval,
    refetch: refetchApproval,
  } = useQuery({
    queryKey: ["home-approval-list", user?.companyId],
    queryFn: async () => {
      try {
        const res = await homeService.getApprovalCounts();
        return res.data as ApprovalItem[];
      } catch (error: any) {
        // Auto-heal: If company context is lost on the server, update company and retry
        if (user?.companyId) {
          try {
            await authService.updateCompany(user.companyId);
            const res = await homeService.getApprovalCounts();
            return res.data as ApprovalItem[];
          } catch (retryError) {
            // Fail silently on retry to throw original error
          }
        }

        throw error;
      }
    },
    enabled: !!user?.companyId,
    staleTime: 30_000,
  });

  const {
    data: notifyData,
    isLoading: isLoadingNotify,
    refetch: refetchNotify,
  } = useQuery({
    queryKey: ["home-notification-unread", user?.companyId],
    queryFn: async () => {
      const res = await notificationService.getNotifications(1);
      return res.data;
    },
    enabled: !!user?.companyId,
    staleTime: 30_000,
  });

  const refetch = useCallback(async () => {
    await Promise.all([refetchApproval(), refetchNotify()]);
  }, [refetchApproval, refetchNotify]);

  const numNotifyNew = notifyData?.numNotifyNew || 0;
  const isLoading = isLoadingApproval || isLoadingNotify;

  const { modules, totalApproveCount } = useMemo(() => {
    const dataList = Array.isArray(approvalData) ? approvalData : [];

    const isAdmin = user?.isAdmin || false;
    const permissions = user?.lstPermission || [];

    const checkPermission = (code?: string) => {
      if (!code || isAdmin) return true;
      return permissions.some((p) => p.code === code && p.view);
    };

    const mods: Module[] = [];
    let total = 0;

    for (const staticMod of STATICS_APPROVE_MODULES) {
      if (!checkPermission(staticMod.permissionCode)) continue;

      let modCount = 0;

      if (staticMod.isGroup && staticMod.items) {
        const childItems: ModuleItem[] = [];
        for (const child of staticMod.items) {
          if (!checkPermission(child.permissionCode)) continue;
          const matchedData = dataList.find((d) => d.type === child.type);
          const childCount = matchedData ? matchedData.totalApprove : 0;
          modCount += childCount;
          childItems.push({
            ...child,
            count: childCount,
          });
        }

        if (childItems.length > 0) {
          mods.push({
            ...staticMod,
            count: modCount,
            items: childItems,
          });
          total += modCount;
        }
      } else {
        const matchedData = dataList.find(
          (d) => d.type === staticMod.id || d.type === staticMod.type,
        );
        const count = matchedData ? matchedData.totalApprove : 0;
        mods.push({
          ...staticMod,
          count: count,
        });
        total += count;
      }
    }

    return { modules: mods, totalApproveCount: total };
  }, [approvalData, user]);

  return { modules, totalApproveCount, numNotifyNew, isLoading, refetch };
};
