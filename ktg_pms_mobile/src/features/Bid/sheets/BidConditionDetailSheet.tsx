import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { View } from "react-native";
import { Column, Row } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";

interface BidConditionDetailSheetProps {
  condition: any;
}

export const BidConditionDetailSheet = ({ condition }: BidConditionDetailSheetProps) => {
  const { spacing } = useTheme();

  const formatNumber = (val: any) => {
    if (val === undefined || val === null || val === "") return "---";
    return Number(val).toLocaleString("en-US");
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="detail" />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <Row>
            <ColumnInfo label="STT" value={condition.sort || "---"} />
            <ColumnInfo label="Bắt buộc?" value={condition.isRequired ? "Bắt buộc" : "Không"} />
          </Row>

          <ColumnInfo label="Tên tiêu chí" value={condition.name || "---"} full />

          <Row>
            <ColumnInfo label="Tỉ trọng(%)" value={formatNumber(condition.percent)} />
            <ColumnInfo label="Giá trị đạt" value={formatNumber(condition.percentRule)} />
          </Row>

          <ColumnInfo label="Kiểu dữ liệu" value={condition.type || "---"} full last />

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};
