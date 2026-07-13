import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { View } from "react-native";
import { Column } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";

interface SupplierLawChangeDetailSheetProps {
  item: {
    label: string;
    newVal: string;
    oldVal: string;
  };
}

export const SupplierLawChangeDetailSheet = ({
  item,
}: SupplierLawChangeDetailSheetProps) => {
  const { spacing, colors } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet title="Chi tiết điều chỉnh" type="detail" />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <ColumnInfo label="Tên nội dung" value={item.label} full />
          
          <ColumnInfo
            label="Nội dung sau khi điều chỉnh"
            value={item.newVal || "---"}
            valueStyle={{
              color: item.newVal !== item.oldVal ? colors.error : colors.text,
            }}
            full
          />
          
          <ColumnInfo
            label="Nội dung trước khi điều chỉnh"
            value={item.oldVal || "---"}
            full
          />

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};
