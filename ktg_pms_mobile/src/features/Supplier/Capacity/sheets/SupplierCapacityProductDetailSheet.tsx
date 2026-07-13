import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { View } from "react-native";
import { Column, Row } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";

interface SupplierCapacityProductDetailSheetProps {
  item: any;
}

export const SupplierCapacityProductDetailSheet = ({
  item,
}: SupplierCapacityProductDetailSheetProps) => {
  const { spacing } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet title="Chi tiết Sản phẩm/Dịch vụ" type="detail" />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <ColumnInfo label="Tên sản phẩm/dịch vụ" value={item?.name || "---"} full />
          
          <ColumnInfo
            label="Năng lực cung cấp/Tháng"
            value={
              item?.supplyCapacityPerMonth1 ||
              item?.supplyCapacityPerMonth ||
              "---"
            }
            full
          />

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};
