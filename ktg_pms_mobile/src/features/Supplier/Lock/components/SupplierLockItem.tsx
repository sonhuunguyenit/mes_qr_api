import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { Card, Row, Spacer, Tag } from "~/common";
import { Badge, MainItemInfo } from "~/components";
import {
  SUPPLIER_LAW_STATUS_CONFIG,
  SUPPLIER_LOCK_TYPE_CONFIG,
  SupplierLockType,
} from "~/enums";
import { useTheme } from "~/hooks/useTheme";
import { SupplierLockItem as ISupplierLockItem } from "~/services/supplier/supplier-lock.type";
import globalStyle from "~/styles/global-style";
import DateHelper from "~/utils/date";

interface SupplierLockItemProps {
  item: ISupplierLockItem;
  onPress: (item: ISupplierLockItem) => void;
  isLoading?: boolean;
}

const SupplierLockItem = ({
  item,
  onPress,
  isLoading,
}: SupplierLockItemProps) => {
  const { colors } = useTheme();

  return (
    <Card shadow={false} style={globalStyle.item} onPress={() => onPress(item)}>
      <View style={globalStyle.tagRow}>
        <Badge
          label="Trạng thái"
          value={
            SUPPLIER_LAW_STATUS_CONFIG[item.status]?.label || item.statusName
          }
          color={
            SUPPLIER_LAW_STATUS_CONFIG[item.status]?.color || colors.active
          }
          showDot={true}
        />
      </View>

      <Spacer size={12} />

      <Row align="center" justify="space-between">
        <Row align="center" style={{ flex: 1 }}>
          <MainItemInfo
            title={item.supplierInfo?.name || item.supplierName || "---"}
          />
        </Row>
      </Row>

      <Spacer size={12} />

      <View style={globalStyle.tagRow}>
        <Tag
          icon="file-text"
          label="Mã số doanh nghiệp"
          value={item.supplierInfo?.code || item.taxCode || "---"}
          fullWidth
        />
        <Tag
          icon="lock"
          label="Loại (Mở Khóa/Khóa)"
          value={
            item.lockTypeName ||
            item.adjustmentTypeName ||
            SUPPLIER_LOCK_TYPE_CONFIG[item.adjustmentType]?.label ||
            (item.adjustmentType === SupplierLockType.LOCK ? "Khóa" : "Mở Khóa")
          }
          fullWidth
        />
        <Tag
          icon="briefcase"
          label="Loại hình"
          value={item.businessTypeName || "---"}
          fullWidth
        />
        <Tag
          icon="calendar"
          label="Ngày yêu cầu"
          value={DateHelper.formatDate(item.createdAt, "DD/MM/YYYY")}
        />
      </View>
    </Card>
  );
};

export default memo(SupplierLockItem);

const styles = StyleSheet.create({});
