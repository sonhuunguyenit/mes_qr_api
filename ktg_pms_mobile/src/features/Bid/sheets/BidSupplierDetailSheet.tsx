import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { View } from "react-native";
import { Column, Row } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";

interface BidSupplierDetailSheetProps {
  supplier: any;
}

export const BidSupplierDetailSheet = ({ supplier }: BidSupplierDetailSheetProps) => {
  const { spacing } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="detail" />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <Row>
            <ColumnInfo label="Mã SAP NCC" value={supplier.supplierSapCode || "---"} />
            <ColumnInfo label="Mã số NCC" value={supplier.supplierCode || "---"} />
          </Row>

          <ColumnInfo label="Nhà cung cấp" value={supplier.supplierName || "---"} full />
          
          <ColumnInfo label="Địa chỉ" value={supplier.supplierAddress || "---"} full />
          
          <ColumnInfo
            label="Lĩnh vực kinh doanh"
            value={supplier.businessCategoryName || "---"}
            full
            last
          />

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};
