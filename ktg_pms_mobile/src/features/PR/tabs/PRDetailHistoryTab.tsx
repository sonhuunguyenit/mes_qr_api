import moment from "moment";
import React, { useCallback, useMemo } from "react";
import { ScrollView } from "react-native";
import Table from "~/common/Table";
import { PRHistoryItem, PRItemData } from "~/services/pr/pr.type";
import globalStyle from "~/styles/global-style";

interface PRDetailHistoryTabProps {
  data: PRItemData;
  onShowDetail?: (item: PRHistoryItem) => void;
}

export const PRDetailHistoryTab = React.memo(
  ({ data, onShowDetail }: PRDetailHistoryTabProps) => {
    const tableContent = useMemo(() => {
      const items = data.lstHistories || [];
      return items.map((item: PRHistoryItem) => ({
        cells: [
          moment(item.createdAt).format("DD/MM/YYYY HH:mm"),
          item.createdByName,
          item.description,
        ],
      }));
    }, [data.lstHistories]);

    const handleRowDoublePress = useCallback(
      (index: number) => {
        const items = data.lstHistories || [];
        const item = items[index];
        if (item) {
          onShowDetail?.(item);
        }
      },
      [data.lstHistories, onShowDetail],
    );

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={globalStyle.scrollContainerDetail}
      >
        <Table
          columns={["Ngày", "Người", "Nội dung"]}
          columnWidths={[80, 100, 400]}
          horizontalScroll
          containerStyle={{ marginHorizontal: 0 }}
          rows={tableContent}
          onRowDoublePress={handleRowDoublePress}
        />
      </ScrollView>
    );
  },
);
