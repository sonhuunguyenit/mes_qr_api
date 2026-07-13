import { DrawerScreenProps } from "@react-navigation/drawer";
import { useMutation } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { Header, Linear, Tabs } from "~/common";
import { ApprovalButton, Container, Status } from "~/components";
import { ROUTE_KEYS } from "~/constants/route";
import { useSheet } from "~/contexts/SheetContext";
import { RESERVATION_STATUS } from "~/enums/reservation.enum";
import { useModal } from "~/hooks/useModal";
import { useTheme } from "~/hooks/useTheme";
import { useToast } from "~/hooks/useToast";
import { useWaiting } from "~/hooks/useWaiting";
import { AppNavigatorParamList } from "~/navigation/navigation.type";
import { reservationService } from "~/services/reservation/reservation.service";
import ReservationDemandDetailSkeleton from "../components/ReservationDemandDetailSkeleton";
import {
  useReservationDemandDetail,
  transformReservationDetail,
} from "../hooks/useReservationDemand";
import ReservationDemandItemDetailSheet from "../sheets/ReservationDemandItemDetailSheet";
import { ReservationDemandReleaseDetailSheet } from "../sheets/ReservationDemandReleaseDetailSheet";
import { ReservationDemandDetailInfoTab } from "../tabs/ReservationDemandDetailInfoTab";
import { ReservationDemandDetailHistoryTab } from "../tabs/ReservationDemandDetailHistoryTab";
import {
  ReservationApprovalItem,
  ReservationApprovalLevel,
} from "~/services/reservation/reservation.type";

type Props = DrawerScreenProps<
  AppNavigatorParamList,
  typeof ROUTE_KEYS.ReservationDemandDetail
>;

const ReservationDemandDetailScreen = ({ route }: Props) => {
  const { colors } = useTheme();
  const initialItem = route?.params?.item;
  const { openSheet, closeSheet } = useSheet();
  const [activeTab, setActiveTab] = useState(0);
  const { show, hide } = useModal();
  const { showToast } = useToast();
  const { start: startWaiting, stop: stopWaiting } = useWaiting();

  const isMaintenance = false;

  const {
    data: detailData,
    isLoading,
    refetch,
  } = useReservationDemandDetail(initialItem?.id, isMaintenance);

  const data = detailData || transformReservationDetail(initialItem);

  const handleShowItemDetail = useCallback(
    (item: any) => {
      openSheet(
        <ReservationDemandItemDetailSheet item={item} onClose={closeSheet} />,
      );
    },
    [openSheet, closeSheet],
  );

  const handleShowReleaseDetail = useCallback(
    (level: ReservationApprovalLevel, item: ReservationApprovalItem) => {
      openSheet(
        <ReservationDemandReleaseDetailSheet level={level} item={item} />,
      );
    },
    [openSheet],
  );

  const updateStatusMutation = useMutation({
    mutationFn: (request: { status: RESERVATION_STATUS; comment?: string }) => {
      const payload = {
        ...data,
        comment: request.comment,
      };
      return request.status === RESERVATION_STATUS.APPROVED
        ? reservationService.approveReservation(payload, isMaintenance)
        : reservationService.rejectReservation(
            {
              ...payload,
              comment: request.comment || "Từ chối",
            },
            isMaintenance,
          );
    },
    onMutate: (variables) => {
      const actionLabel =
        variables.status === RESERVATION_STATUS.APPROVED
          ? "Đang phê duyệt"
          : "Đang từ chối";
      setTimeout(() => startWaiting(actionLabel), 0);
    },
    onSuccess: (res, variables) => {
      stopWaiting();
      const actionLabel =
        variables.status === RESERVATION_STATUS.APPROVED
          ? "Phê duyệt"
          : "Từ chối";

      if (res.status === 201 || res.status === 200) {
        showToast({
          type: "success",
          message: `${actionLabel} thành công`,
        });
        refetch();
      } else {
        showToast({
          type: "danger",
          message: res.data?.message || `${actionLabel} thất bại`,
        });
      }
    },
    onError: (error, variables) => {
      stopWaiting();
      const actionLabel =
        variables.status === RESERVATION_STATUS.APPROVED
          ? "Phê duyệt"
          : "Từ chối";
      showToast({
        type: "danger",
        message: `Có lỗi xảy ra khi ${actionLabel.toLowerCase()}, vui lòng thử lại sau`,
      });
    },
  });

  const handleUpdateStatus = (status: RESERVATION_STATUS) => {
    show({
      style: {
        width: 340,
      },
      component: (
        <Status
          type={status === RESERVATION_STATUS.APPROVED ? "accept" : "refuse"}
          title={
            status === RESERVATION_STATUS.APPROVED ? "Phê duyệt" : "Từ chối"
          }
          message={`Bạn có chắc chắn muốn ${
            status === RESERVATION_STATUS.APPROVED ? "phê duyệt" : "từ chối"
          } nhu cầu này?`}
        />
      ),
      onConfirm: () => {
        updateStatusMutation.mutate({
          status,
        });
      },
      onCancel: () => {
        hide();
      },
    });
  };

  return (
    <Linear>
      <Header
        title="Chi tiết nhu cầu"
        subTitle={"Thông tin chi tiết"}
        showBack
        showSearch={false}
      />
      {isLoading ? (
        <ReservationDemandDetailSkeleton />
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
                <ReservationDemandDetailInfoTab
                  data={data}
                  onShowReleaseDetail={handleShowReleaseDetail}
                  onShowItemDetail={handleShowItemDetail}
                />
              )}
              {activeTab === 1 && (
                <ReservationDemandDetailHistoryTab data={data} />
              )}
            </View>
          </Container>
        </>
      )}

      {/* Action Buttons */}
      {/* sync from reservation-detail.component.html:35-40
       *ngIf="dataObject.isCanApprove && dataObject.status === enumDataStatus.W_A.code" */}
      {data?.status === RESERVATION_STATUS.WAITING_APPROVAL &&
        data?.isCanApprove === true && (
          <ApprovalButton
            onApprove={() => handleUpdateStatus(RESERVATION_STATUS.APPROVED)}
            onReject={() => handleUpdateStatus(RESERVATION_STATUS.REJECTED)}
            isLoading={updateStatusMutation.isPending}
          />
        )}
    </Linear>
  );
};

export default ReservationDemandDetailScreen;
