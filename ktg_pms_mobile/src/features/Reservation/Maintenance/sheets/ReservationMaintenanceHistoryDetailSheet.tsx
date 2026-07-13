import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { View } from "react-native";
import { Column, Row } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";
import { ReservationHistoryItem } from "~/services/reservation/reservation.type";
import DateHelper from "~/utils/date";

interface Props {
  item: ReservationHistoryItem;
  index: number;
}

export const ReservationMaintenanceHistoryDetailSheet = ({ item, index }: Props) => {
  const { spacing } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet title="Chi tiết lịch sử sửa chữa" type="detail" />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <Row>
            <ColumnInfo label="STT" value={index + 1} />
            <ColumnInfo
              label="Ngày tạo"
              value={DateHelper.formatDate(item.createdAt, "DD/MM/YYYY HH:mm")}
              last
            />
          </Row>

          <ColumnInfo label="Người tạo" value={item.createdByName || "---"} />

          <ColumnInfo
            label="Nội dung"
            value={item.description || "---"}
            full
            last
          />
          
          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};
