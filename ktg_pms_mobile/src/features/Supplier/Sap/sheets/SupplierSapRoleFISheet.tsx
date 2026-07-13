import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { View } from "react-native";
import { Column, Row } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";

interface SupplierSapRoleFISheetProps {
  item: any;
}

export const SupplierSapRoleFISheet = ({
  item,
}: SupplierSapRoleFISheetProps) => {
  const { spacing } = useTheme();

  const formatValue = (code?: string, name?: string) => {
    if (!code && !name) return "---";
    if (!code) return name || "---";
    if (!name) return code || "---";
    return `${code} - ${name}`;
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet title="Chi tiết Role FI Supplier" type="detail" />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <ColumnInfo
            label="Tài khoản hoạch toán"
            value={formatValue(item.glAccountCode, item.glAccountName)}
            full
          />
          <ColumnInfo
            label="Thời hạn thanh toán"
            value={formatValue(item.paymentTermCode, item.paymentTermName)}
            full
          />
          <ColumnInfo
            label="Phương thức thanh toán"
            value={formatValue(item.paymentMethodCode, item.paymentMethodName)}
            full
          />
          <ColumnInfo
            label="Phân nhóm dòng tiền"
            value={formatValue(item.planningGroupCode, item.planningGroupName)}
            full
          />
          
          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};
