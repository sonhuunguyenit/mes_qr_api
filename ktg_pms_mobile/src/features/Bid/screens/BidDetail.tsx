import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Header, Linear, Tabs } from "~/common";
import { ApprovalButton, Container, Status } from "~/components";
import { ROUTE_KEYS } from "~/constants/route";
import { useModal } from "~/hooks/useModal";
import { useTheme } from "~/hooks/useTheme";
import { useToast } from "~/hooks/useToast";
import { useWaiting } from "~/hooks/useWaiting";
import { AppNavigatorParamList } from "~/navigation/navigation.type";
import BidDetailSkeleton from "../components/BidDetailSkeleton";
import { BID_STATUS } from "~/enums";
import {
  useApproveBid,
  useBidDetail,
  useRejectBid,
  useRecheckBid,
} from "../hooks/useBid";
import { BidDetailHistoryTab } from "../tabs/BidDetailHistoryTab";
import { BidDetailInfoTab } from "../tabs/BidDetailInfoTab";
import { BidEvaluationTab } from "../tabs/BidEvaluationTab";

type Props = NativeStackScreenProps<
  AppNavigatorParamList,
  typeof ROUTE_KEYS.BidDetail
>;

const BidDetailScreen = ({ route }: Props) => {
  const { id, isRate, isMemeberApproved } = route.params;
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState(isRate ? 2 : 0);
  const { show, hide } = useModal();
  const { showToast } = useToast();
  const { start: startWaiting, stop: stopWaiting } = useWaiting();

  const { data: detailData, isLoading, refetch } = useBidDetail(id);
  const detail = detailData?.data;

  // sync from bid.component.html:132
  const canApproveAction =
    !isRate &&
    detail?.canApprove === true &&
    (detail?.status === BID_STATUS.WAITING_APPROVAL ||
      detail?.status === BID_STATUS.APPROVING);

  // sync from bid-rate.component.html:297-323
  // Condition 1: status === F_E && isMemeberApproved
  // Condition 2: status ∈ { S, D, F_B }
  const canSelectWinningSupplier =
    isRate === true &&
    (detail?.status === BID_STATUS.EVALUATION_COMPLETED
      ? isMemeberApproved === true
      : detail?.status === BID_STATUS.SUPPLIER_SELECTED ||
        detail?.status === BID_STATUS.APPROVING_RESULT ||
        detail?.status === BID_STATUS.NEGOTIATION_COMPLETED);

  // Sync activeTab when loading finishes to prevent empty white screen/freeze
  useEffect(() => {
    if (!isLoading && detail) {
      if (activeTab === 2 && !canSelectWinningSupplier) {
        setActiveTab(0);
      }
    }
  }, [isLoading, detail, activeTab, canSelectWinningSupplier]);

  const { mutate: approve, isPending: isApproving } = useApproveBid();
  const { mutate: reject, isPending: isRejecting } = useRejectBid();
  const { mutate: recheck, isPending: isRechecking } = useRecheckBid();

  const handleApprove = () => {
    show({
      component: (
        <Status
          style={{ width: 320 }}
          type="accept"
          title="Phê duyệt"
          message="Bạn có chắc chắn muốn duyệt gói thầu này?"
        />
      ),
      onConfirm: () => {
        startWaiting("Đang phê duyệt...");
        approve(
          { id },
          {
            onSuccess: (res) => {
              stopWaiting();
              if (res.status === 200 || res.status === 201) {
                showToast({ type: "success", message: "Phê duyệt thành công" });
                refetch();
              } else {
                showToast({
                  type: "danger",
                  message: res.data?.message || "Phê duyệt thất bại",
                });
              }
            },
            onError: () => {
              stopWaiting();
              showToast({
                type: "danger",
                message: "Có lỗi xảy ra, vui lòng thử lại sau",
              });
            },
          },
        );
      },
      onCancel: () => hide(),
    });
  };

  const handleReject = () => {
    show({
      component: (
        <Status
          style={{ width: 320 }}
          type="refuse"
          title="Từ chối thầu"
          message="Bạn có chắc chắn muốn từ chối gói thầu này?"
        />
      ),
      onConfirm: () => {
        startWaiting("Đang từ chối...");
        reject(
          { id },
          {
            onSuccess: (res) => {
              stopWaiting();
              if (res.status === 200 || res.status === 201) {
                showToast({ type: "success", message: "Từ chối thành công" });
                refetch();
              } else {
                showToast({
                  type: "danger",
                  message: res.data?.message || "Từ chối thất bại",
                });
              }
            },
            onError: () => {
              stopWaiting();
              showToast({
                type: "danger",
                message: "Có lỗi xảy ra, vui lòng thử lại sau",
              });
            },
          },
        );
      },
      onCancel: () => hide(),
    });
  };

  const handleRecheck = () => {
    show({
      component: (
        <Status
          style={{ width: 320 }}
          type="warning"
          title="Kiểm tra lại"
          message="Bạn có chắc chắn yêu cầu kiểm tra lại gói thầu này?"
        />
      ),
      onConfirm: () => {
        startWaiting("Đang xử lý...");
        recheck(
          { id },
          {
            onSuccess: (res) => {
              stopWaiting();
              if (res.status === 200 || res.status === 201) {
                showToast({
                  type: "success",
                  message: "Yêu cầu kiểm tra lại thành công",
                });
                refetch();
              } else {
                showToast({
                  type: "danger",
                  message: res.data?.message || "Xử lý thất bại",
                });
              }
            },
            onError: () => {
              stopWaiting();
              showToast({
                type: "danger",
                message: "Có lỗi xảy ra, vui lòng thử lại sau",
              });
            },
          },
        );
      },
      onCancel: () => hide(),
    });
  };

  return (
    <Linear>
      <Header
        title="Chi tiết gói thầu"
        showBack={true}
        subTitle={detail?.code}
      />
      {isLoading ? (
        <BidDetailSkeleton />
      ) : (
        <>
          <Tabs
            value={activeTab}
            onChange={setActiveTab}
            activeColor={colors.active}
          >
            <Tabs.Item label="Thông tin gói thầu" />
            <Tabs.Item label="Lịch sử thao tác" />
            {canSelectWinningSupplier && (
              <Tabs.Item label="Chọn NCC thắng thầu" />
            )}
          </Tabs>

          <Container disableInsetBottom={true}>
            <View style={{ flex: 1 }}>
              {activeTab === 0 && <BidDetailInfoTab data={detail} />}
              {activeTab === 1 && <BidDetailHistoryTab data={detail} />}
              {canSelectWinningSupplier && activeTab === 2 && (
                <BidEvaluationTab bidId={id} onSuccess={() => refetch()} />
              )}
            </View>
          </Container>

          {canApproveAction && (
            <ApprovalButton
              onApprove={handleApprove}
              onReject={handleReject}
              onRecheck={handleRecheck}
              isLoading={isApproving || isRejecting || isRechecking}
            />
          )}
        </>
      )}
    </Linear>
  );
};

export default BidDetailScreen;
