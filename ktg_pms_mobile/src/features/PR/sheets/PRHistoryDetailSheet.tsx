import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Column, Text } from "~/common";
import { useTheme } from "~/hooks/useTheme";
import { PRHistoryItem } from "~/services/pr/pr.type";
import { PRFieldItem } from "../components/PRFieldItem";
import moment from "moment";

interface PRHistoryDetailSheetProps {
  item: PRHistoryItem;
}

export const PRHistoryDetailSheet = ({ item }: PRHistoryDetailSheetProps) => {
  const { spacing } = useTheme();

  return (
    <BottomSheetScrollView style={{ padding: spacing.md }}>
      <Text size={18} bold style={{ marginBottom: 20 }}>
        Chi tiết lịch sử thao tác
      </Text>

      <Column gap={12} align="stretch" style={styles.contentContainer}>
        <PRFieldItem
          label="Thời gian"
          value={moment(item.createdAt).format("DD/MM/YYYY HH:mm")}
          fullWidth
        />

        <PRFieldItem
          label="Người thực hiện"
          value={item.createdByName || "---"}
          fullWidth
        />

        <PRFieldItem
          label="Nội dung"
          value={item.description || "---"}
          fullWidth
        />

        <View style={{ height: 40 }} />
      </Column>
    </BottomSheetScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 20,
  },
});
