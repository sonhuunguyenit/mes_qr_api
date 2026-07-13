import { DrawerScreenProps } from "@react-navigation/drawer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { Header, Input, Linear, Tabs, Text } from "~/common";
import { ApprovalButton, Container, Status } from "~/components";
import { ROUTE_KEYS } from "~/constants/route";
import { useSheet } from "~/contexts/SheetContext";
import {
  BUSINESS_TRANSACTION,
  CI_IGNORE,
  PO_BUDGET_STATUS,
  PO_STATUS,
} from "~/enums";
import { useModal } from "~/hooks/useModal";
import { useTheme } from "~/hooks/useTheme";
import { useToast } from "~/hooks/useToast";
import { useWaiting } from "~/hooks/useWaiting";
import { AppNavigatorParamList } from "~/navigation/navigation.type";
import { poService } from "~/services/po/po.service";
import PODetailSkeleton from "../components/PODetailSkeleton";
import { usePODetail, useUoms } from "../hooks/usePO";
import POItemDetailSheet from "../sheets/POItemDetailSheet";
import PODetailInfoTab from "../tabs/PODetailInfoTab";
import POInboundTab from "../tabs/POInboundTab";
import POInvoiceTab from "../tabs/POInvoiceTab";
import POAcceptanceTab from "../tabs/POAcceptanceTab";

type Props = DrawerScreenProps<
  AppNavigatorParamList,
  typeof ROUTE_KEYS.PODetail
>;

const PODetail = ({ route }: Props) => {
  const { colors } = useTheme();
  const initialItem = route?.params?.item;
  const { openSheet, closeSheet } = useSheet();
  const [activeTab, setActiveTab] = useState(0);
  const { show, hide } = useModal();
  const { showToast } = useToast();
  const { start: startWaiting, stop: stopWaiting } = useWaiting();
  const queryClient = useQueryClient();

  const { data: detailData, isLoading, refetch } = usePODetail(initialItem?.id);
  const { data: dataUom } = useUoms();

  const data = detailData || initialItem;
  const canApprove = data?.canApprove ?? initialItem?.canApprove;

  const handleShowItemDetail = useCallback(
    (item: any) => {
      openSheet(<POItemDetailSheet item={item} onClose={closeSheet} />);
    },
    [openSheet, closeSheet],
  );

  const executeActionMutation = useMutation({
    mutationFn: async (request: {
      id: string;
      action: "APPROVE" | "REJECT" | "RECHECK";
      reason?: string;
      items?: any[];
      isUpdateBudget?: boolean;
    }) => {
      const payload: any = {
        ...data,
        reason: request.reason,
      };

      if (request.action === "APPROVE") {
        if (request.isUpdateBudget) {
          // sync from po-detail.component.ts:1016
          await poService.updateStatusRecheck(payload);
        }
        // sync from po-detail.component.ts:1037
        return poService.approvePO(
          request.items ? { ...payload, lstItemPo: request.items } : payload,
        );
      } else if (request.action === "REJECT") {
        // sync from po-detail.component.ts:1362
        return poService.rejectPO({ id: request.id, reason: request.reason });
      } else {
        // sync from po-detail.component.ts:1352
        return poService.updateStatusCheckAgain({
          id: request.id,
          reason: request.reason,
        });
      }
    },
    onMutate: (variables) => {
      const actionLabel =
        variables.action === "APPROVE"
          ? "Đang phê duyệt"
          : variables.action === "REJECT"
            ? "Đang từ chối"
            : "Đang xử lý";
      startWaiting(actionLabel);
    },
    onSuccess: (res, variables) => {
      stopWaiting();
      const actionLabel =
        variables.action === "APPROVE"
          ? "Phê duyệt"
          : variables.action === "REJECT"
            ? "Từ chối"
            : "Yêu cầu kiểm tra lại";

      if (res.status === 201 || res.status === 200) {
        showToast({
          type: "success",
          message: `${actionLabel} thành công`,
        });
        refetch();
        queryClient.invalidateQueries({ queryKey: ["po-list"] });
        hide();
      } else {
        showToast({
          type: "danger",
          message: res.data?.message || `${actionLabel} thất bại`,
        });
      }
    },
    onError: (error: any, variables) => {
      stopWaiting();
      const actionLabel =
        variables.action === "APPROVE"
          ? "Phê duyệt"
          : variables.action === "REJECT"
            ? "Từ chối"
            : "Yêu cầu kiểm tra lại";
      showToast({
        type: "danger",
        message:
          error?.response?.data?.message ||
          `Có lỗi xảy ra khi ${actionLabel.toLowerCase()}, vui lòng thử lại sau`,
      });
    },
  });

  // sync from po-detail.component.ts:871
  const handleCheckBudget = async () => {
    startWaiting("Đang kiểm tra ngân sách...");
    try {
      // sync from po-detail.component.ts:881
      const res = await poService.getPOListItemCheckBudget(data);
      const items = res.data || [];

      if (items.length > 0) {
        for (const item of items) {
          // Mapping fields for budget check request
          const validDateBudget = moment(
            item.expectedDeliveryDate || item.deliveryDate,
          ).format("DD.MM.YYYY");

          const finalParam = {
            bus_trans: BUSINESS_TRANSACTION.PO, // sync from po-detail.component.ts:938
            potype: data.typePO, // sync from po-detail.component.ts:939
            plant: item.plantCode || data.plantCode, // sync from po-detail.component.ts:940
            deli_date: validDateBudget, // sync from po-detail.component.ts:941
            company: item.companyCode || data.companyCode, // sync from po-detail.component.ts:942
            pugrp: item.pugrp || data.purchasingGroupCode, // sync from po-detail.component.ts:943
            acccate: item.acccate || "", // sync from po-detail.component.ts:946
            sub_asset: item.subNoAset ? item.subNoAset.toString() : "", // sync from po-detail.component.ts:944
            sub_number: "",
            asset: item.assetCode || "",
            costcenter: item.costCenterCode || "",
            coa: item.coa || "",
            sku: item.skuCode || item.sku || "",
            fc: item.fc || "",
            ci: item.ci || "",
          };

          // sync from po-detail.component.ts:950
          const budgetInfoRes = await poService.getBudgetInfo(finalParam);
          const budgetInfo = budgetInfoRes.data;

          if (budgetInfo) {
            item.totalBudget = budgetInfo.available_amo;
            item.fc = budgetInfo.fc;
            item.ci = budgetInfo.ci;
            item.aufc = budgetInfo.aufc;
          }
        }

        // sync from po-detail.component.ts:976
        const itemsMissingBudget = items.filter((x: any) => {
          const budget = Number(x.totalBudget) || 0;
          const total = Number(x.valueItem) || 0;
          const ci = (x.ci ?? "").toUpperCase();

          // sync from po-detail.component.ts:982-984
          return (
            budget < total && !CI_IGNORE.includes(ci) && x.fmcontrol !== "X"
          );
        });

        if (itemsMissingBudget.length > 0) {
          stopWaiting();
          // sync from po-detail.component.ts:1001
          showToast({
            type: "warning",
            message:
              "PO đang thiếu ngân sách. Vui lòng kiểm tra lại trên Admin.",
          });
          return;
        }

        // Final approve after budget check
        executeActionMutation.mutate({
          id: data.id,
          action: "APPROVE",
          items: items,
          isUpdateBudget: true, // sync from po-detail.component.ts:1016
        });
      } else {
        // No items to check, standard approve
        executeActionMutation.mutate({
          id: data.id,
          action: "APPROVE",
        });
      }
    } catch (error: any) {
      stopWaiting();
      showToast({
        type: "danger",
        message: error?.message || "Đã xảy ra lỗi khi kiểm tra ngân sách.",
      });
    }
  };

  const handleAction = (action: "APPROVE" | "REJECT" | "RECHECK") => {
    let localReason = "";

    const renderMessage = () => {
      return (
        <View style={{ width: "100%", marginTop: 10 }}>
          <Text style={{ marginBottom: 8, textAlign: "center" }}>
            {`Bạn có chắc chắn muốn ${
              action === "APPROVE"
                ? "phê duyệt"
                : action === "REJECT"
                  ? "từ chối"
                  : "yêu cầu kiểm tra lại"
            } PO này?`}
          </Text>
          {(action === "REJECT" || action === "RECHECK") && (
            <Input
              placeholder="Nhập lý do..."
              onChangeText={(val) => (localReason = val)}
              multiline
              numberOfLines={3}
              containerStyle={{ marginTop: 10 }}
            />
          )}
        </View>
      );
    };

    show({
      style: {
        width: 340,
      },
      component: (
        <Status
          type={
            action === "APPROVE"
              ? "accept"
              : action === "REJECT"
                ? "refuse"
                : "recheck"
          }
          title={
            action === "APPROVE"
              ? "Phê duyệt"
              : action === "REJECT"
                ? "Từ chối"
                : "Kiểm tra lại"
          }
        >
          {renderMessage()}
        </Status>
      ),
      onConfirm: () => {
        if (
          (action === "REJECT" || action === "RECHECK") &&
          !localReason.trim()
        ) {
          showToast({ type: "warning", message: "Vui lòng nhập lý do" });
          return false;
        }

        if (action === "APPROVE") {
          // sync from po-detail.component.ts:871
          if (
            data.budgetStatus === PO_BUDGET_STATUS.NEW &&
            data.typePO !== "ZPO6"
          ) {
            handleCheckBudget();
          } else {
            executeActionMutation.mutate({ id: data.id, action });
          }
        } else {
          executeActionMutation.mutate({
            id: data.id,
            action,
            reason: localReason,
          });
        }
      },
      onCancel: () => {
        hide();
      },
    });
  };

  return (
    <Linear>
      <Header
        title="Chi tiết PO"
        subTitle={data?.code || "Thông tin chi tiết PO"}
        showBack
        showSearch={false}
      />
      {isLoading ? (
        <PODetailSkeleton />
      ) : (
        <>
          <Tabs
            value={activeTab}
            onChange={setActiveTab}
            activeColor={colors.active}
          >
            <Tabs.Item label="Thông tin chung" />
            <Tabs.Item label="Inbound" />
            <Tabs.Item label="Danh sách hóa đơn" />
            <Tabs.Item label="Nghiệm thu" />
          </Tabs>

          <Container disableInsetBottom={true}>
            <View style={{ flex: 1 }}>
              {activeTab === 0 && (
                <PODetailInfoTab
                  data={data}
                  dataUom={dataUom}
                  onShowItemDetail={handleShowItemDetail}
                />
              )}
              {activeTab === 1 && <POInboundTab data={data} />}
              {activeTab === 2 && <POInvoiceTab data={data} />}
              {activeTab === 3 && <POAcceptanceTab data={data} />}
            </View>
          </Container>
        </>
      )}

      {/* Action Buttons - Sync from po-detail.component.html:1289-1320 */}
      {data?.status === PO_STATUS.WAITING_APPROVAL && canApprove && (
        <ApprovalButton
          onApprove={() => handleAction("APPROVE")}
          onReject={() => handleAction("REJECT")}
          onRecheck={() => handleAction("RECHECK")}
          isLoading={executeActionMutation.isPending}
        />
      )}
    </Linear>
  );
};

export default PODetail;
