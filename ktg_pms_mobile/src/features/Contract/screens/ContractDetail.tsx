import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback } from "react";
import { View } from "react-native";
import { Container, Header, Linear, Text } from "~/common";
import { ApprovalButton, Status, TextArea } from "~/components";
import { ROUTE_KEYS } from "~/constants/route";
import { ContractStatus } from "~/enums/contract.enum";
import { useSheet } from "~/contexts/SheetContext";
import { useModal } from "~/hooks/useModal";
import { useTheme } from "~/hooks/useTheme";
import { useToast } from "~/hooks/useToast";
import { AppNavigatorParamList } from "~/navigation/navigation.type";
import ContractDetailSkeleton from "../components/ContractDetailSkeleton";
import { ContractInfoTab } from "../components/tabs/ContractInfoTab";
import { useContract } from "../hooks/useContract";
import { ContractItemDetailSheet } from "../sheets/ContractItemDetailSheet";
import { ContractPaymentDetailSheet } from "../sheets/ContractPaymentDetailSheet";
import { ContractLotDetailSheet } from "../sheets/ContractLotDetailSheet";
import { isNTContractType } from "~/utils/contract";

type Props = NativeStackScreenProps<
  AppNavigatorParamList,
  typeof ROUTE_KEYS.ContractDetail
>;

const ContractDetail = ({ route }: Props) => {
  const { useContractDetail, useApprove, useReject, useRecheck } =
    useContract();
  const { show, hide } = useModal();
  const { openSheet } = useSheet();
  const { showToast } = useToast();
  const item = route.params?.item;

  const {
    data: detail,
    isLoading: loading,
    refetch,
  } = useContractDetail(item?.id);
  const approveMutation = useApprove();
  const rejectMutation = useReject();
  const recheckMutation = useRecheck();

  const isNTType = isNTContractType(detail?.contractType);

  const handleShowItemDetail = useCallback(
    (itm: any) => {
      openSheet(<ContractItemDetailSheet item={itm} isNT={isNTType} />);
    },
    [openSheet, isNTType],
  );

  const handleShowPaymentDetail = useCallback(
    (itm: any) => {
      openSheet(<ContractPaymentDetailSheet item={itm} />);
    },
    [openSheet],
  );

  const handleShowLotDetail = useCallback(
    (rowIndex: number) => {
      openSheet(
        <ContractLotDetailSheet
          rowIndex={rowIndex}
          lstLot={detail?.lstLot || []}
        />,
      );
    },
    [openSheet, detail?.lstLot],
  );

  // Chỉ dùng detail?.status (fresh từ API sau refetch) để check
  // KHÔNG dùng item?.status (stale từ route.params, không cập nhật sau khi approve)
  const canApprove =
    detail?.status === ContractStatus.WAIT_APPROVE && !!detail?.canApprove;

  const handleAction = useCallback(
    (action: "APPROVE" | "REJECT" | "RECHECK") => {
      if (!detail) return;
      let localReason = "";

      const renderMessage = () => {
        return (
          <View style={{ width: "100%", marginTop: 10 }}>
            <Text style={{ marginBottom: 8, textAlign: "center" }}>
              {`Bạn có chắc chắn muốn ${
                action === "APPROVE"
                  ? "duyệt"
                  : action === "REJECT"
                    ? "từ chối"
                    : "yêu cầu kiểm tra lại"
              } hợp đồng này?`}
            </Text>
            {action === "RECHECK" && (
              <TextArea
                placeholder="Nhập lý do kiểm tra lại..."
                onChangeText={(val) => (localReason = val)}
                numberOfLines={1}
                containerStyle={{ marginTop: 10 }}
              />
            )}
          </View>
        );
      };

      show({
        style: { width: 340 },
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
        confirmText: action === "RECHECK" ? "Gửi yêu cầu" : "Xác nhận",
        cancelText: "Hủy",
        onConfirm: () => {
          if (action === "RECHECK" && !localReason.trim()) {
            showToast({ type: "warning", message: "Vui lòng nhập lý do!" });
            return false;
          }

          const contractId = detail.id || detail.contractId!;

          if (action === "APPROVE") {
            approveMutation.mutate(
              { id: contractId },
              {
                onSuccess: () => {
                  showToast({ type: "success", message: "Duyệt thành công" });
                  route.params?.onGoBack?.();
                },
                onError: (error: any) => {
                  showToast({
                    type: "danger",
                    message: error?.message || "Duyệt thất bại",
                  });
                },
              },
            );
          } else if (action === "REJECT") {
            rejectMutation.mutate(
              { id: contractId },
              {
                onSuccess: () => {
                  showToast({ type: "success", message: "Từ chối thành công" });
                  route.params?.onGoBack?.();
                },
                onError: (error: any) => {
                  showToast({
                    type: "danger",
                    message: error?.message || "Từ chối thất bại",
                  });
                },
              },
            );
          } else if (action === "RECHECK") {
            recheckMutation.mutate(
              { id: contractId, reason: localReason },
              {
                onSuccess: () => {
                  showToast({
                    type: "success",
                    message: "Gửi yêu cầu kiểm tra lại thành công",
                  });
                  route.params?.onGoBack?.();
                },
                onError: (error: any) => {
                  showToast({
                    type: "danger",
                    message: error?.message || "Gửi yêu cầu thất bại",
                  });
                },
              },
            );
          }
        },
        onCancel: () => hide(),
      });
    },
    [
      detail,
      approveMutation,
      rejectMutation,
      recheckMutation,
      show,
      hide,
      showToast,
      route.params,
    ],
  );

  if (loading && !detail) {
    return (
      <Linear>
        <Header
          title={"Chi tiết hợp đồng"}
          subTitle={item?.contractNumber || "---"}
          showBack
        />
        <Container disableInsetBottom={true}>
          <ContractDetailSkeleton />
        </Container>
      </Linear>
    );
  }

  return (
    <Linear>
      <Header
        title={"Chi tiết hợp đồng"}
        subTitle={item?.contractNumber || "---"}
        showBack
      />

      <Container disableInsetBottom={true}>
        {detail && (
          <ContractInfoTab
            detail={detail}
            onShowItemDetail={handleShowItemDetail}
            onShowPaymentDetail={handleShowPaymentDetail}
            onShowLotDetail={handleShowLotDetail}
          />
        )}
      </Container>

      {canApprove && (
        <ApprovalButton
          onApprove={() => handleAction("APPROVE")}
          onReject={() => handleAction("REJECT")}
          onRecheck={() => handleAction("RECHECK")}
          isLoading={
            approveMutation.isPending ||
            rejectMutation.isPending ||
            recheckMutation.isPending
          }
        />
      )}
    </Linear>
  );
};

export default ContractDetail;
