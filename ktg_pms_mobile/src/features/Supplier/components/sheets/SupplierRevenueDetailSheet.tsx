import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import moment from "moment";
import React from "react";
import { View } from "react-native";
import { Column, Row } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";
import NumberHelper from "~/utils/number";

interface SupplierRevenueDetailSheetProps {
  item: any;
}

export const SupplierRevenueDetailSheet = ({
  item,
}: SupplierRevenueDetailSheetProps) => {
  const { spacing } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="detail" />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <ColumnInfo
            label="Năm"
            value={item.year ? moment(item.year).format("YYYY") : "---"}
            full
          />
          <ColumnInfo
            label="Doanh thu"
            value={NumberHelper.formatMoney(item.revenue)}
            full
          />

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};
