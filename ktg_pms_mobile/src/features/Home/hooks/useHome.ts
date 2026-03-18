import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { homeService } from "~/services/home/home.service";
import { useTheme } from "~/hooks/useTheme";
import { getIconForType } from "../utils";
import { Module, ApprovalGroup } from "../types";

export const useHome = () => {
  const { colors } = useTheme();

  const {
    data: approvalData,
    isLoading,
    refetch,
  } = useQuery<ApprovalGroup[]>({
    queryKey: ["approval-counts"],
    queryFn: async () => {
      const response = await homeService.getApprovalCounts();
      return response.data;
    },
  });

  const { modules, totalApproveCount } = useMemo(() => {
    if (!approvalData || !Array.isArray(approvalData))
      return { modules: [], totalApproveCount: 0 };

    const total = approvalData.reduce(
      (acc: number, cur: ApprovalGroup) => acc + (cur.totalApprove || 0),
      0,
    );

    const mods: Module[] = approvalData
      .filter((item: ApprovalGroup) =>
        ["PR", "PO", "SUPPLIER", "BID"].includes(item.type),
      )
      .map((item: ApprovalGroup) => {
        const isGroup =
          Array.isArray(item.children) && item.children.length > 0;

        const uiMap: any = {
          PR: {
            icon: "shopping-cart",
            bgColor: colors.lblueIcon,
            iconColor: colors.blue,
            subtitle: "Purchase Request",
          },
          PO: {
            icon: "credit-card",
            bgColor: colors.lgreenIcon,
            iconColor: colors.green,
            subtitle: "Purchase Order",
          },
          SUPPLIER: {
            icon: "users",
            bgColor: colors.lredIcon,
            iconColor: colors.red,
            subtitle: "Supplier",
          },
          BID: {
            icon: "briefcase",
            bgColor: colors.lredIcon,
            iconColor: colors.red,
            subtitle: "Bid Package",
          },
        };

        const ui = uiMap[item.type] || {
          icon: "grid",
          bgColor: colors.lyellowIcon,
          iconColor: colors.yellow,
        };

        return {
          id: item.type,
          title: item.typeName,
          subtitle: ui.subtitle,
          icon: ui.icon,
          count: item.totalApprove,
          bgColor: ui.bgColor,
          iconColor: ui.iconColor,
          isGroup,
          forceExpand: ui.forceExpand,
          items:
            isGroup && item.children
              ? item.children.map((c: ApprovalGroup) => ({
                  title: c.typeName,
                  type: c.type,
                  icon: getIconForType(c.type),
                  count: c.totalApprove,
                }))
              : [],
        };
      });

    return {
      modules: mods,
      totalApproveCount: total,
    };
  }, [approvalData, colors]);

  return {
    modules,
    totalApproveCount,
    isLoading,
    refetch,
  };
};
