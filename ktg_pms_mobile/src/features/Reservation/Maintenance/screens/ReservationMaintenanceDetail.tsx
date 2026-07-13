import { DrawerScreenProps } from "@react-navigation/drawer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { View } from "react-native";
import { Header, Linear } from "~/common";
import { ApprovalButton, Container, Status } from "~/components";
import { ROUTE_KEYS } from "~/constants/route";
import { useSheet } from "~/contexts/SheetContext";
import {
  RESERVATION_STATUS,
  RESERVATION_MAINTENANCE_STATUS,
} from "~/enums/reservation.enum";
import { useModal } from "~/hooks/useModal";
import { useTheme } from "~/hooks/useTheme";
import { useToast } from "~/hooks/useToast";
import { useWaiting } from "~/hooks/useWaiting";
import { AppNavigatorParamList } from "~/navigation/navigation.type";
import { reservationService } from "~/services/reservation/reservation.service";
import ReservationMaintenanceDetailSkeleton from "../components/ReservationMaintenanceDetailSkeleton";
import {
  transformReservationDetail,
  useReservationMaintenanceDetail,
} from "../hooks/useReservationMaintenance";
import { ReservationMaintenanceDetailInfoTab } from "../tabs/ReservationMaintenanceDetailInfoTab";
import { ReservationMaintenanceDetailHistoryTab } from "../tabs/ReservationMaintenanceDetailHistoryTab";
import ReservationMaintenanceApproveSheet from "../sheets/ReservationMaintenanceApproveSheet";
import { Tabs } from "~/common";

type Props = DrawerScreenProps<
  AppNavigatorParamList,
  typeof ROUTE_KEYS.ReservationMaintenanceDetail
>;

const ReservationMaintenanceDetailScreen = ({ route }: Props) => {
  const { colors } = useTheme();
  const initialItem = route?.params?.item;
  const { openSheet, closeSheet } = useSheet();
  const [activeTab, setActiveTab] = useState(0);
  const { show, hide } = useModal();
  const { showToast } = useToast();
  const { start: startWaiting, stop: stopWaiting } = useWaiting();

  const isMaintenance = true;

  const {
    data: detailData,
    isLoading,
    refetch,
  } = useReservationMaintenanceDetail(initialItem?.id, isMaintenance);

  const queryClient = useQueryClient();

  const data = detailData || transformReservationDetail(initialItem);

  const isApprove =
    route.params?.isApprove || route.params?.isNotifyApprove || data?.isApprove;

  const updateStatusMutation = useMutation({
    mutationFn: (request: {
      action:
        | RESERVATION_MAINTENANCE_STATUS.APPROVED
        | "APPROVE_AND_SYNC"
        | RESERVATION_MAINTENANCE_STATUS.REJECTED
        | RESERVATION_MAINTENANCE_STATUS.REQUEST_REVIEW;
      orderType?: string;
      settle_order?: string;
      textActivities?: string;
      comment?: string;
    }) => {
      const payload = {
        id: data.id,
        orderType: request.orderType || data.orderType || "X1",
        settle_order: request.settle_order || data.settle_order || "-",
        textActivities:
          request.textActivities || data.textActivities || "Phê duyệt",
        comment: request.comment,
      };

      switch (request.action) {
        case RESERVATION_MAINTENANCE_STATUS.APPROVED:
          return reservationService.approveReservation(payload, isMaintenance);
        case "APPROVE_AND_SYNC":
          return reservationService.approveAndSyncReservation(
            payload,
            isMaintenance,
          );
        case RESERVATION_MAINTENANCE_STATUS.REJECTED:
          return reservationService.rejectReservation(payload, isMaintenance);
        case RESERVATION_MAINTENANCE_STATUS.REQUEST_REVIEW:
          return reservationService.requestReviewReservation(
            payload,
            isMaintenance,
          );
      }
    },
    onMutate: (variables) => {
      let actionLabel = "Đang xử lý";
      if (variables.action === RESERVATION_MAINTENANCE_STATUS.APPROVED)
        actionLabel = "Đang phê duyệt";
      else if (variables.action === "APPROVE_AND_SYNC")
        actionLabel = "Đang phê duyệt và đồng bộ";
      else if (variables.action === RESERVATION_MAINTENANCE_STATUS.REJECTED)
        actionLabel = "Đang từ chối";
      else if (
        variables.action === RESERVATION_MAINTENANCE_STATUS.REQUEST_REVIEW
      )
        actionLabel = "Đang yêu cầu kiểm tra lại";
      setTimeout(() => startWaiting(actionLabel), 0);
    },
    onSuccess: (res: any, variables) => {
      stopWaiting();
      let actionLabel = "Xử lý";
      if (variables.action === RESERVATION_MAINTENANCE_STATUS.APPROVED)
        actionLabel = "Phê duyệt";
      else if (variables.action === "APPROVE_AND_SYNC")
        actionLabel = "Phê duyệt và đồng bộ";
      else if (variables.action === RESERVATION_MAINTENANCE_STATUS.REJECTED)
        actionLabel = "Từ chối";
      else if (
        variables.action === RESERVATION_MAINTENANCE_STATUS.REQUEST_REVIEW
      )
        actionLabel = "Yêu cầu kiểm tra lại";

      const resData = res?.data || res;

      if (
        (res.status === 201 || res.status === 200) &&
        resData?.apiStatus !== "E"
      ) {
        showToast({
          type: "success",
          message: `${actionLabel} thành công`,
        });
        queryClient.invalidateQueries({ queryKey: ["reservation-list"] });
        refetch();
      } else {
        let errorMsg = resData?.message || `${actionLabel} thất bại`;
        if (resData && typeof resData === "object" && !resData.message) {
          try {
            errorMsg = JSON.stringify(resData);
          } catch (e) {}
        }
        showToast({
          type: "danger",
          message: errorMsg,
        });
      }
    },
    onError: (error: any, variables) => {
      stopWaiting();
      let actionLabel = "xử lý";
      if (variables.action === RESERVATION_MAINTENANCE_STATUS.APPROVED)
        actionLabel = "phê duyệt";
      else if (variables.action === "APPROVE_AND_SYNC")
        actionLabel = "phê duyệt và đồng bộ";
      else if (variables.action === RESERVATION_MAINTENANCE_STATUS.REJECTED)
        actionLabel = "từ chối";
      else if (
        variables.action === RESERVATION_MAINTENANCE_STATUS.REQUEST_REVIEW
      )
        actionLabel = "yêu cầu kiểm tra lại";

      let errorMessage = "";
      if (error) {
        if (typeof error === "string") {
          errorMessage = error;
        } else if (error.message) {
          errorMessage = error.message;
        } else {
          try {
            errorMessage = JSON.stringify(error);
          } catch (e) {
            errorMessage = String(error);
          }
        }
      }

      showToast({
        type: "danger",
        message:
          errorMessage ||
          `Có lỗi xảy ra khi ${actionLabel}, vui lòng thử lại sau`,
      });
    },
  });

  const handleUpdateStatus = (
    action:
      | RESERVATION_MAINTENANCE_STATUS.APPROVED
      | RESERVATION_MAINTENANCE_STATUS.REJECTED
      | RESERVATION_MAINTENANCE_STATUS.REQUEST_REVIEW,
  ) => {
    let type: "accept" | "refuse" = "accept";
    let title = "Phê duyệt";
    let message = "Bạn có chắc chắn muốn phê duyệt nhu cầu này?";

    if (action === RESERVATION_MAINTENANCE_STATUS.REJECTED) {
      type = "refuse";
      title = "Từ chối";
      message = "Bạn có chắc chắn muốn từ chối nhu cầu này?";
    } else if (action === RESERVATION_MAINTENANCE_STATUS.REQUEST_REVIEW) {
      type = "refuse";
      title = "Yêu cầu kiểm tra lại";
      message = "Bạn có chắc chắn muốn yêu cầu kiểm tra lại nhu cầu này?";
    }

    show({
      style: {
        width: 340,
      },
      component: <Status type={type} title={title} message={message} />,
      onConfirm: () => {
        updateStatusMutation.mutate({
          action,
        });
      },
      onCancel: () => {
        hide();
      },
    });
  };

  const handleOpenApproveSheet = () => {
    openSheet(
      <ReservationMaintenanceApproveSheet
        initialOrderType={data?.orderType}
        initialSettleOrder={data?.settle_order}
        initialTextActivities={data?.textActivities}
        onApprove={(approveData) => {
          updateStatusMutation.mutate({
            action: RESERVATION_MAINTENANCE_STATUS.APPROVED,
            ...approveData,
          });
        }}
        onApproveAndSync={(approveData) => {
          updateStatusMutation.mutate({
            action: "APPROVE_AND_SYNC",
            ...approveData,
          });
        }}
        onClose={closeSheet}
      />,
    );
  };

  return (
    <Linear>
      <Header
        title="Chi tiết nhu cầu sửa chữa"
        subTitle={"Thông tin chi tiết"}
        showBack
        showSearch={false}
      />
      {isLoading ? (
        <ReservationMaintenanceDetailSkeleton />
      ) : (
        <>
          <Tabs
            value={activeTab}
            onChange={setActiveTab}
            activeColor={colors.active}
          >
            <Tabs.Item label="Chi tiết nhu cầu" />
            <Tabs.Item label="Lịch sử thao tác" />
          </Tabs>

          <Container disableInsetBottom={true}>
            <View style={{ flex: 1 }}>
              {activeTab === 0 && (
                <ReservationMaintenanceDetailInfoTab data={data} />
              )}
              {activeTab === 1 && (
                <ReservationMaintenanceDetailHistoryTab data={data} />
              )}
            </View>
          </Container>
        </>
      )}

      {/* Action Buttons */}
      {(data?.status === "PENDING" || data?.status === "WAITING_APPROVAL") &&
        !!isApprove && (
          <ApprovalButton
            onApprove={handleOpenApproveSheet}
            onReject={() =>
              handleUpdateStatus(RESERVATION_MAINTENANCE_STATUS.REJECTED)
            }
            onRecheck={() =>
              handleUpdateStatus(RESERVATION_MAINTENANCE_STATUS.REQUEST_REVIEW)
            }
            isLoading={updateStatusMutation.isPending}
          />
        )}
    </Linear>
  );
};

export default ReservationMaintenanceDetailScreen;
