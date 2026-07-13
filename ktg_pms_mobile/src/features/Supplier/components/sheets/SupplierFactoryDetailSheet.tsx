import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { View } from "react-native";
import { Column, Row } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";

interface SupplierFactoryDetailSheetProps {
  item: any;
}

export const SupplierFactoryDetailSheet = ({
  item,
}: SupplierFactoryDetailSheetProps) => {
  const { spacing } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="detail" />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <ColumnInfo label="Tên nhà máy sản xuất" value={item.name || "---"} full />
          <ColumnInfo label="Địa chỉ nhà máy sản xuất" value={item.address || "---"} full />
          
          <Row>
            <ColumnInfo label="Số điện thoại" value={item.phone || "---"} />
            <ColumnInfo label="Số fax" value={item.fax || "---"} />
          </Row>

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};
