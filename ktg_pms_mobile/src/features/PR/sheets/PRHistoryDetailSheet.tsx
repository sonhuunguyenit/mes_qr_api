import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import moment from "moment";
import React from "react";
import { View } from "react-native";
import { Column } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";
import { PRHistoryItem } from "~/services/pr/pr.type";

interface PRHistoryDetailSheetProps {
  item: PRHistoryItem;
}

export const PRHistoryDetailSheet = ({ item }: PRHistoryDetailSheetProps) => {
  const { spacing } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="detail" />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <ColumnInfo
            label="Thời gian"
            value={moment(item.createdAt).format("DD/MM/YYYY HH:mm")}
            full
          />

          <ColumnInfo
            label="Người thực hiện"
            value={item.createdByName || "---"}
            full
          />

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
