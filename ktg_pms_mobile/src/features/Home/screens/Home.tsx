import React, { useCallback, useMemo, useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { Empty, Linear } from "~/common";
import { Status } from "~/components";
import { useModal } from "~/hooks/useModal";
import {
  goBid,
  goBidRate,
  goContract,
  goHomeSearch,
  goPO,
  goPR,
  goReservationDemand,
  goReservationMaintenance,
  goSupplierCapacity,
  goSupplierLaw,
  goSupplierLock,
  goSupplierLockService,
  goSupplierPotential,
  goSupplierSap,
  goMaterialApproval,
} from "~/utils/navigate";

import StringHelper from "~/utils/string";
import { CollapseMenu } from "../components/CollapseMenu";
import { HomeHeader } from "../components/HomeHeader";
import { HomeSkeleton } from "../components/HomeSkeleton";
import { useHome } from "../hooks/useHome";
import { ApproveFlowCode, Module } from "../types";

const Home = () => {
  const { show, hide } = useModal();
  const { modules, totalApproveCount, numNotifyNew, isLoading, refetch } =
    useHome();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const groupModules = useMemo(() => {
    return modules.filter((m) => m.isGroup);
  }, [modules]);

  const handlePressModule = (type: string, subType?: string, params?: any) => {
    switch (subType || type) {
      case ApproveFlowCode.SAP_CODE:
        return goSupplierSap();
      case ApproveFlowCode.SUPPLIER_POTENTIAL:
        return goSupplierPotential();
      case ApproveFlowCode.LSS:
        return goSupplierLockService(params);
      case ApproveFlowCode.RUSL:
        return goSupplierLaw();
      case ApproveFlowCode.RUSC:
        return goSupplierCapacity();
      case ApproveFlowCode.LS:
        return goSupplierLock({ type: "LS" });
      case ApproveFlowCode.USAGE_DEMAND:
      case ApproveFlowCode.USAGE_DEMAND_SUB:
        return goReservationDemand();
      case ApproveFlowCode.REPAIR_DEMAND:
        return goReservationMaintenance();
      case ApproveFlowCode.PR:
        return goPR();
      case ApproveFlowCode.PO:
        return goPO();
      case ApproveFlowCode.BID:
        return goBid(params);
      case ApproveFlowCode.CONTRACT:
        return goContract(params);
      case ApproveFlowCode.SUPPLIER_WIN_BID:
        return goBidRate(params);
      case ApproveFlowCode.MATERIAL_APPROVAL:
        return goMaterialApproval(params);

      default:
        show({
          type: "popup",
          style: {
            width: "75%",
          },
          component: (
            <Status
              type="info"
              title="Develop"
              message="Tính năng đang được phát triển"
            />
          ),
          onConfirm: hide,
        });
        break;
    }
  };

  return (
    <Linear>
      <HomeHeader
        totalApproveCount={totalApproveCount}
        numNotifyNew={numNotifyNew}
        onPressSearch={goHomeSearch}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: 40,
          flexGrow: 1,
          paddingHorizontal: 5,
        }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {isLoading && modules.length === 0 ? (
          <HomeSkeleton />
        ) : (
          <>
            {groupModules.map((mod: Module) => (
              <CollapseMenu
                key={mod.id}
                mod={mod}
                onPress={(id, subId) => handlePressModule(id, subId)}
              />
            ))}

            {modules.length === 0 && (
              <Empty
                title="Bạn chưa có phân quyền"
                description="Hiện tại chưa có phân quyền nào dành cho bạn"
              />
            )}
          </>
        )}
      </ScrollView>
    </Linear>
  );
};

export default Home;
