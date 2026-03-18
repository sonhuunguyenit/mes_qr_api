import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useMutation } from "@tanstack/react-query";
import { Header, Linear, Text } from "~/common";
import { Container, SegmentedTab } from "~/components";
import { ROUTE_KEYS } from "~/constants/route";
import { useTheme } from "~/hooks/useTheme";
import { useSheet } from "~/contexts/SheetContext";
import { useToast } from "~/hooks/useToast";
import { AppNavigatorParamList } from "~/navigation/navigation.type";
import { poService } from "~/services/po/po.service";
import { PO_STATUS } from "~/enums/po.enum";
import { usePODetail, useUoms } from "../hooks";
import PODetailInfoTab from "../tabs/PODetailInfoTab";
import POItemDetailSheet from "../sheets/POItemDetailSheet";
import POInboundTab from "../tabs/POInboundTab";
import POInvoiceTab from "../tabs/POInvoiceTab";
import POAcceptanceTab from "../tabs/POAcceptanceTab";

type Props = DrawerScreenProps<
  AppNavigatorParamList,
  typeof ROUTE_KEYS.PODetail
>;

const PODetail = ({ route }: Props) => {
  const { colors } = useTheme();
  const { openSheet, closeSheet } = useSheet();
  const initialItem = route?.params?.item;
  const [activeTab, setActiveTab] = useState(0);
  const { showToast } = useToast();

  const { data: detailData, isLoading, refetch } = usePODetail(initialItem?.id);
  const { data: uomData } = useUoms();

  const data = detailData || initialItem;

  const updateStatusMutation = useMutation({
    mutationFn: (request: { id: string; status: PO_STATUS }) =>
      request.status === PO_STATUS.APPROVED
        ? poService.approvePO({ id: request.id })
        : poService.rejectPO({ id: request.id }),
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

  const handleUpdateStatus = (status: PO_STATUS) => {
    Alert.alert(
      "Xác nhận",
      `Bạn có chắc chắn muốn ${status === PO_STATUS.APPROVED ? "phê duyệt" : "từ chối"} PO này?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xác nhận",
          onPress: () => {
            updateStatusMutation.mutate({ id: data.id, status });
          },
        },
      ],
    );
  };

  const handleShowItemDetail = React.useCallback(
    (item: any) => {
      openSheet(
        <POItemDetailSheet
          item={item}
          dataUom={uomData}
          onClose={closeSheet}
        />,
      );
    },
    [openSheet, closeSheet, uomData],
  );

  return (
    <Linear>
      <Header title="Chi tiết PO" showBack showSearch={false} />
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <Container>
          <SegmentedTab
            tabs={[
              { label: "Thông tin chung", value: 0 },
              { label: "Inbound", value: 1 },
              { label: "Danh sách hóa đơn", value: 2 },
              { label: "Nghiệm thu", value: 3 },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
          <View style={{ flex: 1 }}>
            {activeTab === 0 && (
              <PODetailInfoTab
                data={data}
                dataUom={uomData}
                onShowItemDetail={handleShowItemDetail}
              />
            )}
            {activeTab === 1 && <POInboundTab data={data} />}
            {activeTab === 2 && <POInvoiceTab data={data} />}
            {activeTab === 3 && <POAcceptanceTab data={data} />}
          </View>
        </Container>
      )}

      {/* Footer Actions: Active only for Waiting Approval */}
      {data?.status === PO_STATUS.WAITING_APPROVAL && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.btnAction, { backgroundColor: "#F80D53" }]}
            onPress={() => handleUpdateStatus(PO_STATUS.REJECT)}
          >
            <Text bold color="white">
              Từ chối
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnAction, { backgroundColor: colors.primary }]}
            onPress={() => handleUpdateStatus(PO_STATUS.APPROVED)}
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

export default PODetail;

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
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  btnAction: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
