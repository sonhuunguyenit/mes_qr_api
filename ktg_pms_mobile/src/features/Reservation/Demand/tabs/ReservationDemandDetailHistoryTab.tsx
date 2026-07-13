import React, { useCallback, useMemo } from "react";
import { ScrollView } from "react-native";
import Table from "~/common/Table";
import { useSheet } from "~/contexts/SheetContext";
import { ReservationDetailData } from "~/services/reservation/reservation.type";
import globalStyle from "~/styles/global-style";
import DateHelper from "~/utils/date";
import { ReservationDemandHistoryDetailSheet } from "../sheets/ReservationDemandHistoryDetailSheet";

interface Props {
  data: ReservationDetailData;
}

export const ReservationDemandDetailHistoryTab = ({ data }: Props) => {
  const { openSheet, closeSheet } = useSheet();
  const historyData = useMemo(() => data.lstHistory || data.history || [], [data.lstHistory, data.history]);

  const tableContent = useMemo(() => {
    return historyData.map((item, index) => {
      return {
        cells: [
          index + 1,
          DateHelper.formatDate(item.createdAt, "DD/MM/YYYY HH:mm"),
          item.createdByName || "---",
          item.description || "---",
        ],
      };
    });
  }, [historyData]);

  const handleRowDoublePress = useCallback(
    (index: number) => {
      const item = historyData[index];
      if (item) {
        openSheet(<ReservationDemandHistoryDetailSheet item={item} index={index} />);
      }
    },
    [historyData, openSheet],
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={globalStyle.scrollContainerDetail}
    >
      <Table
        horizontalScroll
        columns={["STT", "Ngày tạo", "Người tạo", "Nội dung"]}
        columnWidths={[60, 150, 150, 300]}
        rows={tableContent}
        onRowDoublePress={handleRowDoublePress}
        pagination={{ enabled: false }}
      />
    </ScrollView>
  );
};
