import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { View } from "react-native";
import { Column, Row } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";
import DateHelper from "~/utils/date";

interface BidHistoryDetailSheetProps {
  item: any;
  index: number;
}

export const BidHistoryDetailSheet = ({
  item,
  index,
}: BidHistoryDetailSheetProps) => {
  const { spacing } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="detail" />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <Row>
            <ColumnInfo label="STT" value={(index + 1).toString()} />
            <ColumnInfo
              label="Ngày tạo"
              value={DateHelper.formatDate(item.createdAt, "DD/MM/YYYY HH:mm")}
            />
          </Row>

          <ColumnInfo
            label="Nội dung"
            value={item.description || item.content || "---"}
            full
            last
          />

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};
