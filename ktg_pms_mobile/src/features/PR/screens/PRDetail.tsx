import { DrawerScreenProps } from "@react-navigation/drawer";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Header, Linear, Spacer, Text } from "~/common";
import { Container, SegmentedTab } from "~/components";
import { ROUTE_KEYS } from "~/constants/route";
import { useSheet } from "~/contexts/SheetContext";
import { PR_STATUS } from "~/enums/pr.enum";
import { useTheme } from "~/hooks/useTheme";
import { useToast } from "~/hooks/useToast";
import { AppNavigatorParamList } from "~/navigation/navigation.type";
import { prService } from "~/services/pr/pr.service";
import {
  PRApprovalItem,
  PRApprovalLevel,
  PRUpdateStatusRequest,
} from "~/services/pr/pr.type";
import { PRApprovalDetailSheet } from "../sheets/PRApprovalDetailSheet";
import { PRItemDetailSheet } from "../sheets/PRItemDetailSheet";
import { PRBudgetDetailSheet } from "../sheets/PRBudgetDetailSheet";
import { PRHistoryDetailSheet } from "../sheets/PRHistoryDetailSheet";
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
  const { showToast } = useToast();

  const handleShowApprovalDetail = React.useCallback(
    (level: PRApprovalLevel, item: PRApprovalItem) => {
      openSheet(<PRApprovalDetailSheet level={level} item={item} />);
    },
    [openSheet],
  );

  const handleShowItemDetail = React.useCallback(
    (item: any) => {
      openSheet(<PRItemDetailSheet item={item} />);
    },
    [openSheet],
  );

  const handleShowBudgetDetail = React.useCallback(
    (item: any) => {
      openSheet(<PRBudgetDetailSheet item={item} />);
    },
    [openSheet],
  );

  const handleShowHistoryDetail = React.useCallback(
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
    mutationFn: (request: PRUpdateStatusRequest) =>
      prService.approvePR(request),
    onSuccess: (res) => {
      if (res.data?.success) {
        showToast({
          type: "success",
          message: "Cập nhật trạng thái thành công",
        });
        refetch();
      } else {
        showToast({
          type: "danger",
          message: res.data?.message || "Cập nhật thất bại",
        });
      }
    },
    onError: () => {
      showToast({
        type: "danger",
        message: "Có lỗi xảy ra, vui lòng thử lại sau",
      });
    },
  });

  const handleUpdateStatus = (status: PR_STATUS) => {
    Alert.alert(
      "Xác nhận",
      `Bạn có chắc chắn muốn ${status === PR_STATUS.APPROVED ? "phê duyệt" : "từ chối"} PR này?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xác nhận",
          onPress: () => {
            // Note: approvePR in pr.service.ts expects PRUpdateStatusRequest
            // Adjust if rejectPR should be used for rejected status
            if (status === PR_STATUS.APPROVED) {
              updateStatusMutation.mutate({
                id: data.id,
                status,
              } as any);
            } else {
              // Placeholder for reject logic
              prService.rejectPR({ id: data.id } as any).then((res) => {
                if (res.data?.success) {
                  showToast({ type: "success", message: "Từ chối thành công" });
                  refetch();
                } else {
                  showToast({
                    type: "danger",
                    message: res.data?.message || "Từ chối thất bại",
                  });
                }
              });
            }
          },
        },
      ],
    );
  };

  return (
    <Linear>
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <Container>
          <Header title="Chi tiết PR" showBack showSearch={false} />

          <SegmentedTab
            tabs={[
              { label: "Chi tiết PR", value: 0 },
              { label: "Điều chỉnh ngân sách", value: 1 },
              { label: "Lịch sử thao tác", value: 2 },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <View style={{ flex: 1 }}>
            {activeTab === 0 && (
              <PRDetailInfoTab
                data={data}
                onShowApprovalDetail={handleShowApprovalDetail}
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
      )}

      {/* Action Buttons */}
      {data?.status === PR_STATUS.WAITING_APPROVAL && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.btnAction, { backgroundColor: "#F80D53" }]}
            onPress={() => handleUpdateStatus(PR_STATUS.REJECTED)}
          >
            <Text bold color="white">
              Từ chối
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnAction, { backgroundColor: colors.primary }]}
            onPress={() => handleUpdateStatus(PR_STATUS.APPROVED)}
          >
            <Text bold color="white">
              Phê duyệt
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Linear>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    paddingBottom: 32,
    backgroundColor: "white",
    gap: 12,
  },
  btnAction: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PRDetail;
