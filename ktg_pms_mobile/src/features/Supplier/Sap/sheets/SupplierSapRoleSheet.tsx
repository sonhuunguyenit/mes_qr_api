import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { View } from "react-native";
import { Column, Row } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";

interface SupplierSapRoleSheetProps {
  item: any;
}

export const SupplierSapRoleSheet = ({
  item,
}: SupplierSapRoleSheetProps) => {
  const { spacing } = useTheme();

  const formatValue = (code?: string, name?: string) => {
    if (!code && !name) return "---";
    if (!code) return name || "---";
    if (!name) return code || "---";
    return `${code} - ${name}`;
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet title="Chi tiết Role Supplier" type="detail" />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <ColumnInfo
            label="Tổ chức mua hàng"
            value={formatValue(item.purchasingOrgCode, item.purchasingOrgName)}
            full
          />
          <ColumnInfo
            label="Công ty mua hàng"
            value={formatValue(item.companyCode, item.companyName)}
            full
          />
          <ColumnInfo
            label="Nhóm mua hàng"
            value={formatValue(item.purchasingGroupCode, item.purchasingGroupName)}
            full
          />
          <ColumnInfo
            label="Đơn vị tiền tệ"
            value={formatValue(item.currencyCode, item.currencyName)}
            full
          />
          
          <Row full gap={16}>
            <ColumnInfo label="Điều kiện vận chuyển" value={item.shipCnt || "---"} />
            <ColumnInfo label="Nhóm điều kiện giá" value={item.schemaGrp || "---"} />
          </Row>

          <ColumnInfo
            label="Thời hạn thanh toán"
            value={formatValue(item.paymentTermCode, item.paymentTermName)}
            full
          />

          <Row full gap={16}>
            <ColumnInfo label="Xác nhận nhập hàng" value={item.grbInv ? "Có" : "Không"} />
            <ColumnInfo label="Cấp hàng miễn phí" value={item.grfg ? "Có" : "Không"} />
          </Row>
          
          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};
