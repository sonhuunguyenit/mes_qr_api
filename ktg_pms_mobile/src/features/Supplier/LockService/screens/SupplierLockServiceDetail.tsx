import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Checkbox,
  Collapse,
  Column,
  Container,
  Header,
  Linear,
  Row,
  Spacer,
  Table,
  Text,
} from "~/common";
import { ApprovalButton, Status } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { ROUTE_KEYS } from "~/constants/route";
import { useSheet } from "~/contexts/SheetContext";
import {
  SUPPLIER_LOCK_TYPE_CONFIG,
  SupplierLawStatus,
  SupplierLockType,
} from "~/enums";
import { useModal } from "~/hooks/useModal";
import { useTheme } from "~/hooks/useTheme";
import { useToast } from "~/hooks/useToast";
import { AppNavigatorParamList } from "~/navigation/navigation.type";
import { SupplierLockDetail as ISupplierLockDetail } from "~/services/supplier/supplier-lock.type";
import globalStyle from "~/styles/global-style";
import SupplierLockServiceDetailSkeleton from "../components/SupplierLockServiceDetailSkeleton";
import { useSupplierLockService } from "../hooks/useSupplierLockService";
import { SupplierLockServiceBusinessAreaDetailSheet } from "../sheets/SupplierLockServiceBusinessAreaDetailSheet";
import { SupplierLockServiceFactoryDetailSheet } from "../sheets/SupplierLockServiceFactoryDetailSheet";

type Props = NativeStackScreenProps<
  AppNavigatorParamList,
  typeof ROUTE_KEYS.SupplierLockServiceDetail
>;

const SupplierLockServiceDetail = ({ route }: Props) => {
  const { item } = route.params;
  const { colors, spacing } = useTheme();
  const { show, hide } = useModal();
  const { openSheet } = useSheet();
  const { showToast } = useToast();

  const { useLockDetail, useApprove, useReject } = useSupplierLockService();

  const { data: detail, isLoading } = useLockDetail(item.id) as {
    data: ISupplierLockDetail | undefined;
    isLoading: boolean;
  };

  const approveMutation = useApprove();

  const handleApprove = useCallback(() => {
    const actionLabel =
      detail?.adjustmentType === SupplierLockType.LOCK ? "Khóa" : "Mở khóa";
    show({
      style: {
        width: 340,
      },
      component: (
        <Status
          type="accept"
          title="Phê duyệt"
          message={`Bạn có chắc chắn muốn duyệt yêu cầu ${actionLabel} Lĩnh vực kinh doanh này?`}
        />
      ),
      onConfirm: () => {
        approveMutation.mutate(
          {
            requestUpdateSupplierId: detail?.id || item.id,
            supplierId: detail?.supplierId || item.supplierId,
            supplierServiceId: detail?.id || item.id,
          },
          {
            onSuccess: () => {
              showToast({ type: "success", message: "Phê duyệt thành công" });
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
  }, [approveMutation, item, detail, show, hide, showToast]);

  const rejectMutation = useReject();
  const handleReject = useCallback(() => {
    show({
      style: {
        width: 340,
      },
      component: (
        <Status
          type="refuse"
          title="Từ chối"
          message="Bạn có chắc chắn muốn từ chối yêu cầu này?"
        />
      ),
      onConfirm: () => {
        rejectMutation.mutate(
          {
            id: item.id || (detail as any)?.id,
            status: SupplierLawStatus.CANCEL,
            supplierServiceId: item.id || (detail as any)?.id,
          },
          {
            onSuccess: () => {
              showToast({ type: "success", message: "Từ chối thành công" });
            },
            onError: (error: any) => {
              showToast({
                type: "danger",
                message: error?.message || "Từ chối thất bại",
              });
            },
          },
        );
      },
      onCancel: () => {
        hide();
      },
    });
  }, [rejectMutation, item, detail, show, hide, showToast]);

  const canApprove = useMemo(() => {
    return (
      (detail?.canApprove || item.canApprove) &&
      (detail?.status === SupplierLawStatus.WAIT_APPROVE ||
        item.status === SupplierLawStatus.WAIT_APPROVE)
    );
  }, [detail, item]);

  const factoryRows = useMemo(() => {
    return (detail?.supplierInfo?.lstFactorySupplier || []).map(
      (factory, index) => ({
        cells: [
          index + 1,
          factory.name || "---",
          factory.address || "---",
          factory.phone || "---",
          factory.fax || "---",
        ],
      }),
    );
  }, [detail]);

  const serviceRows = useMemo(() => {
    const list =
      detail?.supplierInfo?.lstSupplierService || detail?.lstBusinessArea || [];
    return list.map((service, index) => ({
      cells: [index + 1, service.serviceName || service.name || "---"],
    }));
  }, [detail]);

  const adjustmentTypeLabel = useMemo(() => {
    if (detail?.lockTypeName) return detail.lockTypeName;
    if (detail?.adjustmentTypeName) return detail.adjustmentTypeName;
    const config = SUPPLIER_LOCK_TYPE_CONFIG[detail?.adjustmentType || ""];
    if (config) return config.label;
    return detail?.adjustmentType === SupplierLockType.LOCK
      ? "Khóa"
      : "Mở Khóa";
  }, [detail]);

  return (
    <Linear>
      <Header
        title="Chi tiết điều chỉnh"
        subTitle={`${adjustmentTypeLabel} LVKD: ${item.code}`}
        showBack
      />
      <Container disableInsetBottom={true}>
        {isLoading ? (
          <SupplierLockServiceDetailSkeleton />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={globalStyle.scrollContainerDetail}
          >
            <Spacer size={spacing.sm} />

            <Collapse title="I. Thông tin nhà cung cấp" collapsible>
              <Column gap={12} align="stretch">
                <Row full gap={16}>
                  <ColumnInfo
                    label="Mã nhà cung cấp"
                    value={detail?.supplierCode || detail?.supplierInfo?.code}
                  />
                  <ColumnInfo
                    label="Tên nhà cung cấp"
                    value={detail?.supplierInfo?.name || detail?.supplierName}
                  />
                </Row>

                <Row full gap={16}>
                  <ColumnInfo
                    label="Loại hình doanh nghiệp"
                    value={
                      detail?.supplierInfo?.businessTypeName ||
                      detail?.businessTypeName
                    }
                  />
                  <ColumnInfo
                    label="MST"
                    value={detail?.supplierInfo?.code || detail?.taxCode}
                  />
                </Row>

                <ColumnInfo
                  label="Địa chỉ trụ sở"
                  value={detail?.supplierInfo?.address || detail?.address}
                  full
                  last
                />

                <ColumnInfo
                  label="Loại (Mở Khóa/Khóa)"
                  value={adjustmentTypeLabel}
                  full
                  last
                />
              </Column>
            </Collapse>

            <Spacer size={10} />

            <Collapse title="Danh sách nhà máy" collapsible>
              <Table
                horizontalScroll
                columns={[
                  "STT",
                  "Tên nhà máy sản xuất",
                  "Địa chỉ nhà máy sản xuất",
                  "Số điện thoại",
                  "Số fax",
                ]}
                columnWidths={[50, 200, 300, 150, 150]}
                rows={factoryRows}
                onRowDoublePress={(index) => {
                  const items = detail?.supplierInfo?.lstFactorySupplier || [];
                  const item = items[index];
                  if (!item) return;
                  openSheet(() => (
                    <SupplierLockServiceFactoryDetailSheet item={item} />
                  ));
                }}
                pagination={{ enabled: false }}
              />
            </Collapse>

            <Spacer size={10} />

            <Collapse title="Danh sách lĩnh vực kinh doanh" collapsible>
              <Table
                columns={["STT", "Tên lĩnh vực"]}
                columnFlexValues={[1, 5]}
                rows={serviceRows}
                onRowDoublePress={(index) => {
                  const list =
                    detail?.supplierInfo?.lstSupplierService ||
                    detail?.lstBusinessArea ||
                    [];
                  const item = list[index];
                  if (!item) return;
                  openSheet(() => (
                    <SupplierLockServiceBusinessAreaDetailSheet item={item} />
                  ));
                }}
                pagination={{ enabled: false }}
              />
            </Collapse>

            {item.serviceName && (
              <>
                <Spacer size={10} />
                <View
                  style={[
                    styles.highlightSection,
                    { backgroundColor: colors.divider },
                  ]}
                >
                  <Text bold color={colors.title}>
                    Lĩnh vực kinh doanh bị{" "}
                    {detail?.adjustmentType === SupplierLockType.LOCK ||
                    item.adjustmentType === SupplierLockType.LOCK
                      ? "khóa"
                      : "mở"}
                    : {item.serviceName}
                  </Text>
                </View>
              </>
            )}

            <Spacer size={10} />

            <Collapse title="II. Nội dung điều chỉnh" collapsible>
              <Column gap={8} pointerEvents="none">
                <Checkbox
                  label="Khóa/mở khóa lĩnh vực kinh doanh"
                  checked={!!detail?.isLockSupplierService}
                />
                <Checkbox
                  label="Khóa/mở khóa nhà cung cấp"
                  checked={!!detail?.isLockSupplier}
                />
                <Checkbox label="Pháp lý" checked={!!detail?.isPL} />
                <Checkbox label="Năng lực" checked={!!detail?.isNL} />
                <Checkbox
                  label="Nâng cấp nhà cung cấp"
                  checked={!!detail?.isUpgradeSupplier}
                />
              </Column>
            </Collapse>

            <Spacer size={10} />

            <Collapse title="III. Lý do điều chỉnh" collapsible>
              <Text color={colors.title}>{detail?.reasonUpdate || "---"}</Text>
            </Collapse>
          </ScrollView>
        )}
      </Container>

      {!isLoading && canApprove && (
        <ApprovalButton
          onApprove={handleApprove}
          onReject={handleReject}
          isLoading={approveMutation.isPending || rejectMutation.isPending}
        />
      )}
    </Linear>
  );
};

export default SupplierLockServiceDetail;

const styles = StyleSheet.create({
  highlightSection: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
});
