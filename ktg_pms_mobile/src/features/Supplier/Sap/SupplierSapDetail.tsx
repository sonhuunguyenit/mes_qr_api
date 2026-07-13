import { useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Header, Linear, Tabs } from "~/common";
import { ApprovalButton, Status } from "~/components";
import { Container } from "~/components/Container";
import { SupplierNumberAprovalStatus } from "~/enums/supplier.enum";
import { useAuth } from "~/hooks/useAuth";
import { useModal } from "~/hooks/useModal";
import { useTheme } from "~/hooks/useTheme";
import { useToast } from "~/hooks/useToast";
import SupplierSapDetailSkeleton from "./components/SupplierSapDetailSkeleton";
import {
  useApproveSupplierSap,
  useRecheckSupplierSap,
  useSupplierSapDetail,
} from "./hooks/useSupplierSap";
import BusinessPartnerTab from "./tabs/BusinessPartnerTab";
import RoleFISupplierTab from "./tabs/RoleFISupplierTab";
import RoleSupplierTab from "./tabs/RoleSupplierTab";

const SupplierSapDetail = () => {
  const route = useRoute<any>();
  const { item } = route.params || {};
  const { user } = useAuth();
  const supplierNumberId = item?.id;
  const supplierId = item?.supplierId;

  const { colors } = useTheme();
  const { show, hide } = useModal();
  const { showToast } = useToast();
  const [index, setIndex] = useState(0);

  const {
    data: detailData,
    isLoading,
    refetch,
  } = useSupplierSapDetail(supplierNumberId, supplierId);

  const approveMutation = useApproveSupplierSap();
  const recheckMutation = useRecheckSupplierSap();

  if (isLoading) {
    return (
      <Linear>
        <Header title="Chi tiết tạo mã SAP" showBack={true} />
        <SupplierSapDetailSkeleton />
      </Linear>
    );
  }

  const dataObject = detailData?.dataObject || {};
  const dataSupplier = detailData?.dataSupplier || {};

  const handleApprove = () => {
    show({
      style: {
        width: 340,
      },
      component: (
        <Status
          type="accept"
          title="Phê duyệt"
          message="Bạn có chắc chắn muốn phê duyệt tạo mã SAP này?"
        />
      ),
      onConfirm: () => {
        approveMutation.mutate(
          {
            id: dataObject.id,
            supplierId: dataObject.supplierId,
            businessPartnerGroupId: dataObject.businessPartnerGroupId,
          },
          {
            onSuccess: () => {
              showToast({ type: "success", message: "Phê duyệt thành công" });
              refetch();
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

  const handleRecheck = () => {
    show({
      style: {
        width: 340,
      },
      component: (
        <Status
          type="recheck"
          title="Kiểm tra lại"
          message="Bạn có chắc chắn muốn yêu cầu kiểm tra lại tạo mã SAP này?"
        />
      ),
      onConfirm: () => {
        recheckMutation.mutate(
          {
            id: dataObject.id,
            listRole: [
              ...(dataObject.lstRoleFISupplier || []),
              ...(dataObject.lstRoleSupplier || []),
            ],
            objectNote: null,
          },
          {
            onSuccess: () => {
              showToast({
                type: "success",
                message: "Đã gửi yêu cầu kiểm tra lại",
              });
              refetch();
            },
            onError: (error: any) => {
              showToast({
                type: "danger",
                message: error?.message || "Gửi yêu cầu thất bại",
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

  const canApprove =
    dataObject?.approvalStatus === SupplierNumberAprovalStatus.PENDING;
  const isMutating = approveMutation.isPending || recheckMutation.isPending;

  return (
    <Linear>
      <Header title="Chi tiết tạo mã SAP" showBack={true} />

      <Tabs value={index} onChange={setIndex} mode="underline">
        <Tabs.Item label="Business Partner" />
        <Tabs.Item label="Role Supplier" />
        <Tabs.Item label="Role FI Supplier" />
      </Tabs>

      <Container disableInsetBottom={true} style={styles.containerStyle}>
        <Tabs.View value={index} onChange={setIndex}>
          <BusinessPartnerTab data={dataObject} supplier={dataSupplier} />
          <RoleSupplierTab data={dataObject} />
          <RoleFISupplierTab data={dataObject} />
        </Tabs.View>
      </Container>

      {canApprove && (
        <ApprovalButton
          onApprove={() => handleApprove()}
          onReject={() => handleRecheck()}
          isLoading={isMutating}
        />
      )}
    </Linear>
  );
};

export default SupplierSapDetail;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 0,
    marginTop: 0,
    marginHorizontal: 0,
    borderRadius: 0,
  },
});
