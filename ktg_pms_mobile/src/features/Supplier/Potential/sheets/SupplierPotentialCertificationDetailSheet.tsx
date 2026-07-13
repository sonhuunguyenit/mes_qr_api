import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { View } from "react-native";
import { Column, Row } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";

interface SupplierPotentialCertificationDetailSheetProps {
  item: any;
}

export const SupplierPotentialCertificationDetailSheet = ({
  item,
}: SupplierPotentialCertificationDetailSheetProps) => {
  const { spacing } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="detail" />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <ColumnInfo label="Tên chứng chỉ" value={item.name || "---"} full />
          
          <ColumnInfo
            label="File đính kèm"
            value={item.fileAttachment ? "[Có file đính kèm]" : "---"}
            full
          />

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};
