import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Header,
  Linear,
  Row,
  Text,
  Spacer,
  Column,
  Tabs,
  Input,
  Button,
} from "~/common";
import { Container, ApprovalButton, Status } from "~/components";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useTheme } from "~/hooks/useTheme";
import { useModal } from "~/hooks/useModal";
import {
  useSupplierPotentialDetail,
  useSupplierPotentialServices,
  useApproveSupplierPotential,
  useRecheckSupplierPotential,
} from "./hooks";
import { SupplierPotentialDetailSkeleton } from "./components";
import {
  SupplierPotentialInfoTab,
  SupplierPotentialBusinessAreaTab,
  SupplierPotentialCapacityTab,
} from "./tabs";
import { useToast } from "~/hooks/useToast";
import { Badge } from "~/components";
import {
  SupplierPotentialUpgradeStatus,
  SUPPLIER_POTENTIAL_UPGRADE_STATUS_CONFIG,
} from "~/enums/supplier.enum";
import { logger } from "~/utils/logger";

const RecheckModalContent = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: (reason: string) => void;
  onCancel: () => void;
}) => {
  const [reason, setReason] = useState("");
  const isInvalid = reason.trim().length < 4;
  const { colors } = useTheme();

  return (
    <View style={{ width: "100%" }}>
      <Status
        type="recheck"
        title="Kiểm tra lại"
        message="Nhập lý do yêu cầu đánh giá lại nhà cung cấp này:"
      />
      <Spacer size={15} />
      <Input
        placeholder="Nhập lý do điều chỉnh (tối thiểu 4 ký tự)"
        multiline={true}
        numberOfLines={4}
        value={reason}
        onChangeText={setReason}
        maxLength={1500}
        inputContainerStyle={{
          minHeight: 80,
          maxHeight: 120,
          alignItems: "flex-start",
          paddingVertical: 8,
        }}
        inputStyle={{
          textAlignVertical: "top",
          height: "100%",
        }}
        errorMessage={
          reason.length > 0 && isInvalid ? "Lý do phải có ít nhất 4 ký tự" : ""
        }
      />
      <Spacer size={15} />
      <Row style={{ gap: 10 }}>
        <Button
          title="Hủy bỏ"
          type="clear"
          titleStyle={{ color: colors.inactive as string }}
          buttonStyle={{ borderWidth: 0 }}
          containerStyle={{ flex: 1 }}
          onPress={onCancel}
        />
        <Button
          title="Đồng ý"
          disabled={isInvalid}
          buttonStyle={{
            backgroundColor: (isInvalid ? colors.disabledBg : colors.primary) as string,
            borderColor: (isInvalid ? colors.disabled : colors.primary) as string,
          }}
          titleStyle={{
            color: (isInvalid ? colors.placeholder : colors.black) as string,
          }}
          containerStyle={{ flex: 1 }}
          onPress={() => onSubmit(reason.trim())}
        />
      </Row>
    </View>
  );
};

const SupplierPotentialDetail = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { item } = route.params || {};
  const { showToast } = useToast();

  // 0: Thông tin chung, 1: Thông tin năng lực, 2: Danh sách LVKD
  const [activeTab, setActiveTab] = useState(0);

  const {
    data: detailData,
    isLoading: isDetailLoading,
    refetch: refetchDetail,
  } = useSupplierPotentialDetail(item?.id);

  const { data: servicesData, isLoading: isServicesLoading } =
    useSupplierPotentialServices(item?.id);

  const approveMutation = useApproveSupplierPotential();
  const recheckMutation = useRecheckSupplierPotential();

  const { show, hide } = useModal();
  const isLoading = isDetailLoading || isServicesLoading;

  if (isLoading) {
    return (
      <Linear>
        <Header title="Chi tiết nhà cung cấp" showBack={true} />
        <SupplierPotentialDetailSkeleton />
      </Linear>
    );
  }

  const data = {
    ...(detailData?.data || {}),
    businessAreas:
      (servicesData?.data as any)?.data || servicesData?.data || [],
  };

  const handleUpdateStatus = (type: "approve" | "recheck") => {
    if (type === "recheck") {
      show({
        style: {
          width: 340,
        },
        component: (
          <RecheckModalContent
            onSubmit={(reason) => {
              recheckMutation.mutate(
                {
                  id: item.id,
                  reasonRequestReCheck: reason,
                  fileReasonReCheck: "",
                },
                {
                  onSuccess: () => {
                    showToast({
                      type: "success",
                      message: "Gửi yêu cầu kiểm tra lại thành công",
                    });
                    hide();
                    navigation.goBack();
                  },
                  onError: (error: any) => {
                    showToast({
                      type: "danger",
                      message: error?.message || "Gửi yêu cầu thất bại",
                    });
                  },
                },
              );
            }}
            onCancel={hide}
          />
        ),
      });
      return;
    }

    show({
      style: {
        width: 340,
      },
      component: (
        <Status
          type="accept"
          title="Phê duyệt"
          message="Bạn có chắc chắn muốn phê duyệt nhà cung cấp này?"
        />
      ),
      onConfirm: () => {
        approveMutation.mutate(
          { id: item.id, isPass: data.isPass },
          {
            onSuccess: () => {
              showToast({ type: "success", message: "Phê duyệt thành công" });
              navigation.goBack();
            },
            onError: (error: any) => {
              showToast({
                type: "danger",
                message: error?.message || "Phê duyệt thất bại",
              });
            },
          },
        );
      },
      onCancel: () => {
        hide();
      },
    });
  };

  return (
    <Linear>
      <Header title="Chi tiết nhà cung cấp" showBack={true} />
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.Item label="Thông tin chung" />
        <Tabs.Item label="TT năng lực" />
        <Tabs.Item label="DS LVKD" />
      </Tabs>

      <Container disableInsetBottom={true}>
        <View style={{ flex: 1 }}>
          {activeTab === 0 && <SupplierPotentialInfoTab data={data} />}
          {activeTab === 1 && <SupplierPotentialCapacityTab data={data} />}
          {activeTab === 2 && <SupplierPotentialBusinessAreaTab data={data} />}
        </View>
      </Container>

      {data.canApprove &&
        String(data.status || "").toUpperCase() === "INREVIEW" && (
        <ApprovalButton
          onApprove={() => handleUpdateStatus("approve")}
          onReject={() => handleUpdateStatus("recheck")}
          isLoading={approveMutation.isPending || recheckMutation.isPending}
        />
      )}
    </Linear>
  );
};

export default SupplierPotentialDetail;
