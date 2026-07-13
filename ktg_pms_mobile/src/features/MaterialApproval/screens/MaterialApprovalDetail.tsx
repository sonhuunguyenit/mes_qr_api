import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { Empty, Header, Linear, Tabs } from "~/common";
import { ApprovalButton, Container } from "~/components";
import { ROUTE_KEYS } from "~/constants/route";
import { useTheme } from "~/hooks/useTheme";
import { useToast } from "~/hooks/useToast";
import { useWaiting } from "~/hooks/useWaiting";
import { AppNavigatorParamList } from "~/navigation/navigation.type";

import { useSheet } from "~/contexts/SheetContext";
import { goBack } from "~/utils/navigate";
import MaterialApprovalDetailSkeleton from "../components/MaterialApprovalDetailSkeleton";
import {
  useApproveMaterialSync,
  useMaterialDetail,
  useRejectMaterialSync,
} from "../hooks";
import { MaterialConfirmSyncSheet } from "../sheets/MaterialConfirmSyncSheet";
import { MaterialRejectSyncSheet } from "../sheets/MaterialRejectSyncSheet";

import { MaterialApprovalDetailAccountingTab } from "../tabs/MaterialApprovalDetailAccountingTab";
import { MaterialApprovalDetailCoProductTab } from "../tabs/MaterialApprovalDetailCoProductTab";
import { MaterialApprovalDetailInfoTab } from "../tabs/MaterialApprovalDetailInfoTab";
import { MaterialApprovalDetailPurchasingTab } from "../tabs/MaterialApprovalDetailPurchasingTab";
import { MaterialApprovalDetailSalesTab } from "../tabs/MaterialApprovalDetailSalesTab";
import { MaterialApprovalDetailStorageTab } from "../tabs/MaterialApprovalDetailStorageTab";
import { MaterialApprovalDetailStructureTab } from "../tabs/MaterialApprovalDetailStructureTab";
import { MaterialApprovalDetailWMSTab } from "../tabs/MaterialApprovalDetailWMSTab";
import { MaterialStatus } from "~/enums";

type Props = NativeStackScreenProps<
  AppNavigatorParamList,
  typeof ROUTE_KEYS.MaterialApprovalDetail
>;

const MaterialApprovalDetail = ({ route }: Props) => {
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const initialItem = route?.params?.item;
  const [activeTab, setActiveTab] = useState(0);
  const { showToast } = useToast();
  const { start: startWaiting, stop: stopWaiting } = useWaiting();

  const {
    data: detailData,
    isLoading,
    refetch,
  } = useMaterialDetail(initialItem?.id);

  const data = detailData || initialItem;

  const { openSheet, closeSheet } = useSheet();
  const approveSyncMutation = useApproveMaterialSync();
  const rejectSyncMutation = useRejectMaterialSync();

  const handleApprovePress = useCallback(() => {
    if (!data?.id) return;
    openSheet(() => (
      <MaterialConfirmSyncSheet
        initialMaterialCode={data.sapCode || data.code || ""}
        onClose={closeSheet}
        onApprove={(code) => {
          startWaiting("Đang phê duyệt...");
          approveSyncMutation.mutate(
            {
              materialId: data.id,
              materialCode: code,
              plantId: data.plantId,
            },
            {
              onSuccess: (res) => {
                stopWaiting();
                if (res.status === 200 || res.status === 201) {
                  queryClient.invalidateQueries({
                    queryKey: ["material-list"],
                  });
                  showToast({
                    type: "success",
                    message: res.data?.message || "Phê duyệt thành công",
                  });
                  goBack();
                } else {
                  showToast({
                    type: "danger",
                    message: res.data?.message || "Phê duyệt thất bại",
                  });
                }
              },
              onError: (error: AxiosError<{ message?: string }>) => {
                stopWaiting();
                showToast({
                  type: "danger",
                  message:
                    error?.response?.data?.message ||
                    "Có lỗi xảy ra khi phê duyệt, vui lòng thử lại sau",
                });
              },
            },
          );
        }}
      />
    ));
  }, [
    data,
    openSheet,
    closeSheet,
    approveSyncMutation,
    startWaiting,
    stopWaiting,
    showToast,
    queryClient,
  ]);

  const handleRejectPress = useCallback(() => {
    if (!data?.id) return;
    openSheet(() => (
      <MaterialRejectSyncSheet
        onClose={closeSheet}
        onReject={(rejectData) => {
          startWaiting("Đang từ chối...");
          rejectSyncMutation.mutate(
            {
              materialId: data.id,
              ...rejectData,
            },
            {
              onSuccess: (res) => {
                stopWaiting();
                if (res.status === 200 || res.status === 201) {
                  queryClient.invalidateQueries({
                    queryKey: ["material-list"],
                  });
                  showToast({
                    type: "success",
                    message: res.data?.message || "Từ chối thành công",
                  });
                  goBack();
                } else {
                  showToast({
                    type: "danger",
                    message: res.data?.message || "Từ chối thất bại",
                  });
                }
              },
              onError: (error: AxiosError<{ message?: string }>) => {
                stopWaiting();
                showToast({
                  type: "danger",
                  message:
                    error?.response?.data?.message ||
                    "Có lỗi xảy ra khi từ chối, vui lòng thử lại sau",
                });
              },
            },
          );
        }}
      />
    ));
  }, [
    data,
    openSheet,
    closeSheet,
    rejectSyncMutation,
    startWaiting,
    stopWaiting,
    showToast,
    queryClient,
  ]);

  return (
    <Linear>
      <Header
        title="Chi tiết Material"
        subTitle={data?.code || ""}
        showBack={true}
        showSearch={false}
      />

      {isLoading ? (
        <MaterialApprovalDetailSkeleton />
      ) : (
        <>
          <Tabs
            value={activeTab}
            onChange={setActiveTab}
            activeColor={colors.active}
            scrollable={true}
          >
            <Tabs.Item label="Thông Tin Chung" />
            <Tabs.Item label="Thông tin bán hàng" />
            <Tabs.Item label="Purchasing - Quality - Costing - Mrp" />
            <Tabs.Item label="Accounting" />
            <Tabs.Item label="WMS" />
            <Tabs.Item label="STORAGE" />
            <Tabs.Item label="Co-Production" />
            <Tabs.Item label="Cấu trúc" />
          </Tabs>

          <Container disableInsetBottom={true}>
            <View style={{ flex: 1 }}>
              {activeTab === 0 && <MaterialApprovalDetailInfoTab data={data} />}

              {activeTab === 1 && (
                <MaterialApprovalDetailSalesTab data={data} />
              )}

              {activeTab === 2 && (
                <MaterialApprovalDetailPurchasingTab data={data} />
              )}

              {activeTab === 3 && (
                <MaterialApprovalDetailAccountingTab data={data} />
              )}

              {activeTab === 4 && <MaterialApprovalDetailWMSTab data={data} />}

              {activeTab === 5 && (
                <MaterialApprovalDetailStorageTab data={data} />
              )}

              {activeTab === 6 && (
                <MaterialApprovalDetailCoProductTab data={data} />
              )}

              {activeTab === 7 && (
                <MaterialApprovalDetailStructureTab data={data} />
              )}

              {activeTab > 7 && (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Empty />
                </View>
              )}
            </View>
          </Container>
        </>
      )}

      {/* Footer approval button: sync condition from admin component detail */}
      {/* Admin detail has approved click only, wait_approve condition matches list status */}
      {data?.status === MaterialStatus.WAIT_APPROVE && data?.canApprove && (
        <ApprovalButton
          onApprove={handleApprovePress}
          onReject={handleRejectPress}
          isLoading={
            approveSyncMutation.isPending || rejectSyncMutation.isPending
          }
        />
      )}
    </Linear>
  );
};

export default MaterialApprovalDetail;
