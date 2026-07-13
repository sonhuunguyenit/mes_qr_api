import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { View } from "react-native";
import { Column, Row } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";

interface SupplierLegalRepresentativeDetailSheetProps {
  item: any;
}

export const SupplierLegalRepresentativeDetailSheet = ({
  item,
}: SupplierLegalRepresentativeDetailSheetProps) => {
  const { spacing } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="detail" />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <ColumnInfo label="Họ và tên" value={item.name || "---"} full />
          
          <Row>
            <ColumnInfo label="Loại định danh" value={item.idType || "---"} />
            <ColumnInfo label="Mã định danh" value={item.idNumber || "---"} />
          </Row>

          <ColumnInfo label="Lưu ý" value={item.note || "---"} full />

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};
