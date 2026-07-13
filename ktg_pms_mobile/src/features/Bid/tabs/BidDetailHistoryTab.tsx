import React, { useMemo } from "react";
import { ScrollView } from "react-native";
import { Table } from "~/common";
import globalStyle from "~/styles/global-style";
import DateHelper from "~/utils/date";
import { useSheet } from "~/contexts/SheetContext";
import { BidHistoryDetailSheet } from "../sheets/BidHistoryDetailSheet";

interface BidDetailHistoryTabProps {
  data: any;
}

export const BidDetailHistoryTab = React.memo(
  ({ data }: BidDetailHistoryTabProps) => {
    const { openSheet, closeSheet } = useSheet();

    const tableContent = useMemo(() => {
      return (data?.auditLogs || []).map((item: any, index: number) => ({
        cells: [
          (index + 1).toString(),
          DateHelper.formatDate(item.createdAt, "DD/MM/YYYY HH:mm"),
          item.description || item.content || "---",
        ],
      }));
    }, [data?.auditLogs]);

    const handleRowDoublePress = (index: number) => {
      const item = data?.auditLogs?.[index];
      if (item) {
        openSheet(<BidHistoryDetailSheet item={item} index={index} />);
      }
    };

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={globalStyle.scrollContainerDetail}
      >
        <Table
          columns={["STT", "Ngày tạo", "Nội dung"]}
          columnWidths={[60, 150, 350]}
          horizontalScroll
          rows={tableContent}
          onRowDoublePress={handleRowDoublePress}
        />
      </ScrollView>
    );
  },
);
