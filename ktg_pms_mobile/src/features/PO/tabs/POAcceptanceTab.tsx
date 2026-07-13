import React, { useState } from "react";
import { View, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import moment from "moment";
import { Table, Spacer } from "~/common";
import globalStyle from "~/styles/global-style";
import { useTheme } from "~/hooks/useTheme";
import { useSheet } from "~/contexts/SheetContext";
import { useAcceptanceList } from "../hooks";
import { PODetailData } from "~/services/po/po.type";
import { AcceptanceItem } from "~/services/acceptance/acceptance.type";
import POAcceptanceDetailSheet from "../sheets/POAcceptanceDetailSheet";

interface POAcceptanceTabProps {
  data: Partial<PODetailData>;
}

const POAcceptanceTab = ({ data }: POAcceptanceTabProps) => {
  const { colors } = useTheme();
  const { openSheet, closeSheet } = useSheet();
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;

  const poId = data?.id || (data as any)?.response?.id;

  const { data: acceptanceData, isLoading } = useAcceptanceList({
    poId: poId,
    pageIndex,
    pageSize,
  });

  const handleOpenDetail = (item: AcceptanceItem) => {
    openSheet(<POAcceptanceDetailSheet data={item} onClose={closeSheet} />);
  };

  const handleRowDoublePress = (index: number) => {
    const item = acceptanceData?.data?.[index];
    if (item) {
      handleOpenDetail(item);
    }
  };

  const columns = [
    "Số BB nghiệm thu",
    "Đối tượng",
    "Ngày nghiệm thu",
    "Người nghiệm thu",
    "Kết quả",
  ];

  const columnWidths = [180, 200, 150, 180, 200];

  const rows = (acceptanceData?.data || []).map((item: AcceptanceItem) => ({
    cells: [
      item.acceptanceNumber,
      item.acceptanceObject,
      item.handoverTime
        ? moment(item.handoverTime).format("DD/MM/YYYY")
        : "---",
      item.employeeName,
      item.acceptanceResults,
    ],
  }));

  if (isLoading && pageIndex === 1) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={globalStyle.scrollContainerDetail}
    >
      <Table
        columns={columns}
        rows={rows}
        columnWidths={columnWidths}
        horizontalScroll
        onRowDoublePress={handleRowDoublePress}
        containerStyle={styles.table}
      />
      <Spacer size={20} />
    </ScrollView>
  );
};

export default POAcceptanceTab;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  table: {
    marginHorizontal: 0,
  },
});
