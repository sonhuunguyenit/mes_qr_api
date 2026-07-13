import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useMemo } from "react";
import { ScrollView, StyleSheet } from "react-native";
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
import { BrandConfig } from "~/styles/theme-config";
import SupplierLockDetailSkeleton from "../components/SupplierLockDetailSkeleton";
import { useSupplierLock } from "../hooks/useSupplierLock";
import { SupplierLockBusinessAreaDetailSheet } from "../sheets/SupplierLockBusinessAreaDetailSheet";
import { SupplierLockFactoryDetailSheet } from "../sheets/SupplierLockFactoryDetailSheet";

type Props = NativeStackScreenProps<
  AppNavigatorParamList,
  typeof ROUTE_KEYS.SupplierLockDetail
>;

const SupplierLockDetailScreen = ({ route }: Props) => {
  const { item } = route.params;
  const { colors, spacing } = useTheme();
  const { show, hide } = useModal();
  const { openSheet } = useSheet();
  const { showToast } = useToast();

  const { useLockDetail, useApprove, useReject } = useSupplierLock();
  const { data: detail, isLoading } = useLockDetail(item.id) as {
    data: ISupplierLockDetail | undefined;
    isLoading: boolean;
  };

  const approveMutation = useApprove();
  const handleApprove = useCallback(() => {
    show({
      style: {
        width: 340,
      },
      component: (
        <Status
          type="accept"
          title="Phê duyệt"
          message="Bạn có chắc chắn muốn duyệt yêu cầu Mở khoá Nhà cung cấp này?"
        />
      ),
      onConfirm: () => {
        approveMutation.mutate(
          {
            requestUpdateSupplierId: item.id || (detail as any)?.id,
            supplierId: (detail as any)?.supplierId || item.supplierId,
            supplierServiceId: "",
          },
          {
            onSuccess: () => {
              showToast({ type: "success", message: "Phê duyệt thành công" });
              // refetch or goBack based on existing logic (existing code called goBack in LawDetail, but LockDetail didn't have onSuccess handler)
              // Actually looking at LockDetail.tsx, it didn't have onSuccess handler.
              // I'll add onSuccess that shows toast and goBack if needed, or just let the hook handle it?
              // Most screens here seem to goBack.
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
            supplierServiceId: "",
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
    return (detail?.supplierInfo?.lstSupplierService || []).map(
      (service, index) => ({
        cells: [index + 1, service.serviceName || "---"],
      }),
    );
  }, [detail]);

  return (
    <Linear>
      <Header
        title="Chi tiết điều chỉnh"
        subTitle={"Mở khoá NCC: " + item.code}
        showBack
      />
      <Container disableInsetBottom={true} style={{ paddingHorizontal: 5 }}>
        {isLoading ? (
          <SupplierLockDetailSkeleton />
        ) : (
          <ScrollView
            contentContainerStyle={globalStyle.scrollContainerDetail}
            showsVerticalScrollIndicator={false}
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
                    label="Địa chỉ trụ sở"
                    value={detail?.supplierInfo?.address || detail?.address}
                    last
                  />
                </Row>

                <ColumnInfo
                  label="Loại (Mở Khóa/Khóa)"
                  value={
                    detail?.lockTypeName ||
                    detail?.adjustmentTypeName ||
                    SUPPLIER_LOCK_TYPE_CONFIG[detail?.adjustmentType || ""]
                      ?.label ||
                    (detail?.adjustmentType === SupplierLockType.LOCK
                      ? "Khóa"
                      : "Mở Khóa")
                  }
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
                    <SupplierLockFactoryDetailSheet item={item} />
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
                  const items = detail?.supplierInfo?.lstSupplierService || [];
                  const item = items[index];
                  if (!item) return;
                  openSheet(() => (
                    <SupplierLockBusinessAreaDetailSheet item={item} />
                  ));
                }}
                pagination={{ enabled: false }}
              />
            </Collapse>

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

export default SupplierLockDetailScreen;

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: BrandConfig.radius.card,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  infoItem: {
    width: "45%",
  },
  listItem: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
});
