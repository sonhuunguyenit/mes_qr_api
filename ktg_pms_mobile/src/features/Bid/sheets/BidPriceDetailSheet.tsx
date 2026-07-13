import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { View } from "react-native";
import { Column, Row } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";

interface BidPriceDetailSheetProps {
  item: any;
  columns: any[];
}

export const BidPriceDetailSheet = ({ item, columns }: BidPriceDetailSheetProps) => {
  const { spacing } = useTheme();

  const formatNumber = (val: any) => {
    if (val === undefined || val === null || val === "") return "0";
    const num = Number(val);
    return isNaN(num) ? val : num.toLocaleString("en-US");
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="detail" />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <Row>
            <ColumnInfo label="STT" value={item.sort || "---"} />
            <ColumnInfo label="Bắt buộc?" value={item.isRequired ? "Bắt buộc" : "Không"} />
          </Row>

          <ColumnInfo label="Tên hạng mục" value={item.name || "---"} full />

          {columns.map((col) => (
            <ColumnInfo
              key={col.id}
              label={col.name}
              value={formatNumber(item[col.id])}
              full
            />
          ))}

          <Row>
            <ColumnInfo label="Đơn vị tính" value={item.unit || "---"} />
            <ColumnInfo label="Đơn vị tiền tệ" value={item.currency || "---"} />
          </Row>

          <ColumnInfo label="Số lượng" value={formatNumber(item.number)} full last />

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};
