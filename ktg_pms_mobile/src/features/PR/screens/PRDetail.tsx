import { DrawerScreenProps } from "@react-navigation/drawer";
import { useMutation, useQuery } from "@tanstack/react-query";
import moment from "moment";
import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { Header, Input, Linear, Tabs, Text } from "~/common";
import { ApprovalButton, Container, Status } from "~/components";
import { ROUTE_KEYS } from "~/constants/route";
import { useSheet } from "~/contexts/SheetContext";
import {
  BUDGET_STATUS,
  BUSINESS_TRANSACTION,
  CI_IGNORE,
  PR_SOURCE_TYPE,
  PR_STATUS,
} from "~/enums";
import { useModal } from "~/hooks/useModal";
import { useTheme } from "~/hooks/useTheme";
import { useToast } from "~/hooks/useToast";
import { useWaiting } from "~/hooks/useWaiting";
import { AppNavigatorParamList } from "~/navigation/navigation.type";
import { prService } from "~/services/pr/pr.service";
import {
  PRDetailItem,
  PRReleaseItem,
  PRReleaseLevel,
} from "~/services/pr/pr.type";
import PRDetailSkeleton from "../components/PRDetailSkeleton";
import { PRBudgetDetailSheet } from "../sheets/PRBudgetDetailSheet";
import { PRHistoryDetailSheet } from "../sheets/PRHistoryDetailSheet";
import { PRItemDetailSheet } from "../sheets/PRItemDetailSheet";
import { PRReleaseDetailSheet } from "../sheets/PRReleaseDetailSheet";
import { PRDetailBudgetTab } from "../tabs/PRDetailBudgetTab";
import { PRDetailHistoryTab } from "../tabs/PRDetailHistoryTab";
import { PRDetailInfoTab } from "../tabs/PRDetailInfoTab";

type Props = DrawerScreenProps<
  AppNavigatorParamList,
  typeof ROUTE_KEYS.PRDetail
>;

const PRDetail = ({ route }: Props) => {
  const { colors } = useTheme();
  const initialItem = route?.params?.item;
  const { openSheet } = useSheet();
  const [activeTab, setActiveTab] = useState(0);
  const { show, hide } = useModal();
  const { showToast } = useToast();
  const { start: startWaiting, stop: stopWaiting } = useWaiting();

  const handleShowReleaseDetail = useCallback(
    (level: PRReleaseLevel, item: PRReleaseItem) => {
      openSheet(<PRReleaseDetailSheet level={level} item={item} />);
    },
    [openSheet],
  );

  const handleShowItemDetail = useCallback(
    (item: any) => {
      openSheet(<PRItemDetailSheet item={item} />);
    },
    [openSheet],
  );

  const handleShowBudgetDetail = useCallback(
    (item: any) => {
      openSheet(<PRBudgetDetailSheet item={item} />);
    },
    [openSheet],
  );

  const handleShowHistoryDetail = useCallback(
    (item: any) => {
      openSheet(<PRHistoryDetailSheet item={item} />);
    },
    [openSheet],
  );

  const {
    data: detailData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["prDetail", initialItem?.id],
    queryFn: () => prService.getPRDetail(initialItem?.id),
    enabled: !!initialItem?.id,
  });

  const data = detailData?.data || initialItem;

  const updateStatusMutation = useMutation({
    mutationFn: (request: {
      id: string;
      status: PR_STATUS;
      reason?: string;
      lstDetail?: PRDetailItem[];
      isUpdateBudget?: boolean;
    }) => {
      const payload: any = {
        ...data,
        status: request.status,
        comment: request.reason,
      };
      if (request.lstDetail) {
        payload.lstDetail = request.lstDetail;
      }

      if (request.status === PR_STATUS.APPROVED) {
        if (request.isUpdateBudget) {
          // sync from pr-detail.component.ts:674
          return prService
            .updateStatusRecheck({ ...payload, lstItem: request.lstDetail })
            .then(() => {
              return prService.approvePR({
                ...payload,
                lstItem: request.lstDetail,
              }); // sync from pr-detail.component.ts:675
            });
        }
        return prService.approvePR(
          request.lstDetail
            ? { ...payload, lstItem: request.lstDetail }
            : payload,
        ); // sync from pr-detail.component.ts:522 & 696
      } else if (request.status === PR_STATUS.REJECTED) {
        return prService.rejectRule(payload); // sync from pr-detail.component.ts:704
      } else {
        return prService.sendCheckAgain(payload); // sync from pr-detail.component.ts:712
      }
    },
    onMutate: (variables) => {
      const actionLabel =
        variables.status === PR_STATUS.APPROVED
          ? "Đang phê duyệt"
          : variables.status === PR_STATUS.REJECTED
            ? "Đang từ chối"
            : "Đang xử lý";
      setTimeout(() => startWaiting(actionLabel), 0);
    },
    onSuccess: (res, variables) => {
      stopWaiting();
      const actionLabel =
        variables.status === PR_STATUS.APPROVED
          ? "Phê duyệt"
          : variables.status === PR_STATUS.REJECTED
            ? "Từ chối"
            : "Gửi kiểm tra lại";

      if (res.status === 201 || res.status === 200) {
        showToast({
          type: "success",
          message: `${actionLabel} thành công`,
        });
        refetch();
        hide(); // Close modal if open
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
        variables.status === PR_STATUS.APPROVED
          ? "Phê duyệt"
          : variables.status === PR_STATUS.REJECTED
            ? "Từ chối"
            : "Gửi kiểm tra lại";
      showToast({
        type: "danger",
        message:
          error?.response?.data?.message ||
          `Có lỗi xảy ra khi ${actionLabel.toLowerCase()}, vui lòng thử lại sau`,
      });
    },
  });

  const handleCheckBudget = async () => {
    startWaiting("Đang kiểm tra ngân sách...");
    try {
      const res = await prService.getPRListItemCheckBudget(data);
      const items: PRDetailItem[] = res.data || [];

      if (items.length > 0) {
        for (const item of items) {
          // sync from pr-detail.component.ts:844-846
          item.pugrp = item.purchasingGroupCode;
          item.puorg = item.purchasingOrgCode;
          item.pugroup = item.purchasingGroupCode;

          const validDate = moment(item.deliveryDate).format("YYYYMMDD"); // sync from pr-detail.component.ts:864
          const validDateBudget = moment(item.deliveryDate).format(
            "DD.MM.YYYY",
          ); // sync from pr-detail.component.ts:865

          // sync from pr-detail.component.ts:884
          if (
            item.acccate !== "K" &&
            item.acccate !== "A" &&
            data.prType !== "ZPR2"
          ) {
            const checkBudgetRes = await prService.checkBudgetItem({
              sku:
                item.skuCode ||
                item.materialCode ||
                item.assetCode ||
                item.orderCode, // sync from pr-detail.component.ts:853-860
              plant: item.plantCode,
              valid_on: validDate,
              company: item.companyCode, // sync from pr-detail.component.ts:890
              puorg: item.puorg,
              pugroup: item.pugroup,
            });

            if (checkBudgetRes.data) {
              item.valuationPrice =
                checkBudgetRes.data.amount / +checkBudgetRes.data.per || 0; // sync from pr-detail.component.ts:900
              item.total = item.valuationPrice * item.quantity; // sync from pr-detail.component.ts:901
            }
          } else {
            item.total = item.valuationPrice * item.quantity; // sync from pr-detail.component.ts:904
          }

          const baseParam = {
            bus_trans: BUSINESS_TRANSACTION.PR, // sync from pr-detail.component.ts:908
            prtype: data.prType, // sync from pr-detail.component.ts:909
            plant: item.plantCode, // sync from pr-detail.component.ts:910
            deli_date: validDateBudget, // sync from pr-detail.component.ts:911
            company: item.companyCode, // sync from pr-detail.component.ts:912
            pugrp: item.pugrp, // sync from pr-detail.component.ts:913
            acccate: item.acccate || "", // sync from pr-detail.component.ts:916
            sub_asset: item.subNoAset ? item.subNoAset.toString() : "", // sync from pr-detail.component.ts:914
            sub_number: "",
            potype: "",
            fc: "",
            ci: "",
          };

          let finalParam: any;
          if (item.assetCode) {
            finalParam = {
              ...baseParam,
              asset: item.assetCode.toString(),
              costcenter: item.costCenterCode || "",
              coa: item.glAccountCode || "", // sync from pr-detail.component.ts:929
            };
          } else if (item.orderCode) {
            finalParam = {
              ...baseParam,
              order: item.orderCode,
              costcenter: item.costCenterCode || "",
              coa: item.glAccountCode || "", // sync from pr-detail.component.ts:936
            };
          } else if (item.acccate === "K") {
            finalParam = {
              ...baseParam,
              sku: item.sku || item.skuCode || item.materialCode, // sync from pr-detail.component.ts:941
              costcenter: item.costCenterCode || "",
              coa: item.glAccountCode || "", // sync from pr-detail.component.ts:943
            };
          } else {
            finalParam = {
              ...baseParam,
              sku: item.sku || item.skuCode || item.materialCode, // sync from pr-detail.component.ts:948
            };
          }

          const budgetInfoRes = await prService.getBudgetInfo(finalParam);
          const budgetInfo = budgetInfoRes.data;

          if (budgetInfo) {
            item.fund = budgetInfo.fund;
            item.fp = budgetInfo.fp;
            item.fc = budgetInfo.fc;
            item.ci = budgetInfo.ci;
            item.budget = budgetInfo.available_amo;
            item.aufc = budgetInfo.aufc;
          }
        }

        const itemsMissingBudget = items.filter((x: any) => {
          const budget = Number(x.budget) || 0;
          const total = Number(x.total) || 0;
          const ci = (x.ci ?? "").toUpperCase();

          return (
            budget < total && !CI_IGNORE.includes(ci) && x.fmcontrol !== "X"
          );
        });

        if (itemsMissingBudget.length > 0) {
          stopWaiting();
          show({
            style: { width: 340 },
            component: (
              <Status type="warning" title="Thiếu ngân sách">
                <View style={{ width: "100%", marginTop: 10 }}>
                  <Text style={{ marginBottom: 8, textAlign: "center" }}>
                    PR đang thiếu ngân sách cho {itemsMissingBudget.length} hạng
                    mục. Bạn có muốn tiếp tục phê duyệt PR không?
                  </Text>
                </View>
              </Status>
            ),
            onConfirm: () => {
              const lstDetail = items.filter(
                (x: any) =>
                  !!x.materialId ||
                  !!x.assetCode ||
                  !!x.orderCode ||
                  !!x.costCenterCode,
              );
              if (lstDetail.length === 0) {
                showToast({
                  type: "danger",
                  message:
                    "PR Item phải tồn tại ít nhất một trong các giá trị: vật tư, tài sản, order code hoặc cost center.",
                });
                return;
              }
              hide();
              updateStatusMutation.mutate({
                id: data.id,
                status: PR_STATUS.APPROVED,
                lstDetail: lstDetail,
                isUpdateBudget: true, // Force update budget (UPDATE_STATUS_RECHECK)
              });
            },
            onCancel: () => hide(),
          });
          return;
        }

        const isSapSource = data.sourceType === PR_SOURCE_TYPE.SAP;

        // Final approve after budget check
        updateStatusMutation.mutate({
          id: data.id,
          status: PR_STATUS.APPROVED,
          lstDetail: items,
          isUpdateBudget: isSapSource, // sync from pr-detail.component.ts:674
        });
      } else {
        // No items to check, standard approve
        updateStatusMutation.mutate({
          id: data.id,
          status: PR_STATUS.APPROVED,
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

  const handleUpdateStatus = (status: PR_STATUS) => {
    let reason = "";

    const renderMessage = () => {
      return (
        <View style={{ width: "100%", marginTop: 10 }}>
          <Text style={{ marginBottom: 8, textAlign: "center" }}>
            {`Bạn có chắc chắn muốn ${
              status === PR_STATUS.APPROVED
                ? "phê duyệt"
                : status === PR_STATUS.REJECTED
                  ? "từ chối"
                  : "yêu cầu kiểm tra lại"
            } PR này?`}
          </Text>
          {(status === PR_STATUS.REJECTED ||
            status === PR_STATUS.CHECK_AGAIN) && (
            <Input
              placeholder="Nhập lý do..."
              onChangeText={(val) => (reason = val)}
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
            status === PR_STATUS.APPROVED
              ? "accept"
              : status === PR_STATUS.REJECTED
                ? "refuse"
                : "recheck"
          }
          title={
            status === PR_STATUS.APPROVED
              ? "Phê duyệt"
              : status === PR_STATUS.REJECTED
                ? "Từ chối"
                : "Kiểm tra lại"
          }
        >
          {renderMessage()}
        </Status>
      ),
      onConfirm: () => {
        if (
          (status === PR_STATUS.REJECTED || status === PR_STATUS.CHECK_AGAIN) &&
          !reason.trim()
        ) {
          showToast({ type: "warning", message: "Vui lòng nhập lý do" });
          return false;
        }

        if (status === PR_STATUS.APPROVED) {
          // sync from pr-detail.component.ts:373 & 538
          if (
            (data.budgetStatus === BUDGET_STATUS.NEW &&
              data.sourceType === PR_SOURCE_TYPE.PMS) ||
            data.sourceType === PR_SOURCE_TYPE.SAP
          ) {
            handleCheckBudget();
          } else {
            updateStatusMutation.mutate({ id: data.id, status, reason }); // sync from pr-detail.component.ts:696
          }
        } else {
          updateStatusMutation.mutate({ id: data.id, status, reason });
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
        title="Chi tiết PR"
        subTitle={data?.code || "Thông tin chi tiết PR"}
        showBack
        showSearch={false}
      />
      {isLoading ? (
        <PRDetailSkeleton />
      ) : (
        <>
          <Tabs
            value={activeTab}
            onChange={setActiveTab}
            activeColor={colors.active}
          >
            <Tabs.Item label="Chi tiết PR" />
            <Tabs.Item label="Điều chỉnh ngân sách" />
            <Tabs.Item label="Lịch sử thao tác" />
          </Tabs>

          <Container disableInsetBottom={true}>
            <View style={{ flex: 1 }}>
              {activeTab === 0 && (
                <PRDetailInfoTab
                  data={data}
                  onShowReleaseDetail={handleShowReleaseDetail}
                  onShowItemDetail={handleShowItemDetail}
                />
              )}

              {activeTab === 1 && (
                <PRDetailBudgetTab
                  data={data}
                  onShowDetail={handleShowBudgetDetail}
                />
              )}

              {activeTab === 2 && (
                <PRDetailHistoryTab
                  data={data}
                  onShowDetail={handleShowHistoryDetail}
                />
              )}
            </View>
          </Container>
        </>
      )}

      {/* Action Buttons */}
      {data?.status === PR_STATUS.WAITING_APPROVAL && data?.canApprove && (
        <ApprovalButton
          onApprove={() => handleUpdateStatus(PR_STATUS.APPROVED)}
          onReject={() => handleUpdateStatus(PR_STATUS.REJECTED)}
          onRecheck={() => handleUpdateStatus(PR_STATUS.CHECK_AGAIN)}
          isLoading={updateStatusMutation.isPending}
        />
      )}
    </Linear>
  );
};

export default PRDetail;
