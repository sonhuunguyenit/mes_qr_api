import moment from "moment";
import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import Table from "~/common/Table";
import { useSheet } from "~/contexts/SheetContext";
import { useTheme } from "~/hooks/useTheme";
import { PRHistoryItem, PRItemData } from "~/services/pr/pr.type";
import PRHistoryTableFilterSheet, {
  PRHistoryTableFilters,
} from "../sheets/PRHistoryTableFilterSheet";

interface PRDetailHistoryTabProps {
  data: PRItemData;
  onShowDetail?: (item: PRHistoryItem) => void;
}

export const PRDetailHistoryTab = React.memo(
  ({ data, onShowDetail }: PRDetailHistoryTabProps) => {
    const { colors } = useTheme();
    const { openSheet, closeSheet } = useSheet();
    const [tableFilters, setTableFilters] = useState<PRHistoryTableFilters>({
      date: "",
      userName: "",
      description: "",
    });

    const isFiltered = !!(
      tableFilters.date ||
      tableFilters.userName ||
      tableFilters.description
    );

    const handleOpenFilter = useCallback(() => {
      openSheet(
        <PRHistoryTableFilterSheet
          initialFilters={tableFilters}
          onApply={setTableFilters}
          onClose={closeSheet}
        />,
      );
    }, [openSheet, tableFilters, closeSheet]);

    const tableContent = useMemo(() => {
      const filteredData =
        data.lstHistories?.filter((item) => {
          const dateStr = moment(item.createdAt).format("DD/MM/YYYY HH:mm");
          const matchDate =
            !tableFilters.date ||
            dateStr.toLowerCase().includes(tableFilters.date.toLowerCase());
          const matchUser =
            !tableFilters.userName ||
            item.createdByName
              ?.toLowerCase()
              .includes(tableFilters.userName.toLowerCase());
          const matchDesc =
            !tableFilters.description ||
            item.description
              ?.toLowerCase()
              .includes(tableFilters.description.toLowerCase());

          return matchDate && matchUser && matchDesc;
        }) || [];

      return filteredData.map((item: PRHistoryItem) => ({
        cells: [
          moment(item.createdAt).format("DD/MM/YYYY HH:mm"),
          item.createdByName,
          item.description,
          <Table.EyeDetailRow
            key={`eye-${item.id}`}
            onPress={() => onShowDetail?.(item)}
          />,
        ],
      }));
    }, [data.lstHistories, tableFilters, onShowDetail]);

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Table
          columns={[
            "Ngày",
            "Người",
            "Nội dung",
            <Table.ButtonFilterTable
              key="item-filter"
              onPress={handleOpenFilter}
              isFiltered={isFiltered}
            />,
          ]}
          columnWidths={[120, 100, 200, 60]}
          horizontalScroll
          containerStyle={{ marginHorizontal: 0 }}
          stickyColumn="right"
          rows={tableContent}
        />
      </ScrollView>
    );
  },
);

const styles = StyleSheet.create({
  scrollContent: {
    padding: 5,
    paddingTop: 10,
  },
  dot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F80D53",
  },
});
