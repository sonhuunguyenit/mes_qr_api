import React, { useState } from "react";
import { View, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import moment from "moment";
import { Table, Spacer } from "~/common";
import { useTheme } from "~/hooks/useTheme";
import { useSheet } from "~/contexts/SheetContext";
import { useAcceptanceList } from "../hooks";
import { PODetailData } from "~/services/po/po.type";
import { AcceptanceItem } from "~/services/acceptance/acceptance.type";
import POAcceptanceTableFilterSheet, {
  POAcceptanceTableFilters,
} from "../sheets/POAcceptanceTableFilterSheet";
import POAcceptanceDetailSheet from "../sheets/POAcceptanceDetailSheet";

interface POAcceptanceTabProps {
  data: Partial<PODetailData>;
}

const POAcceptanceTab = ({ data }: POAcceptanceTabProps) => {
  const { colors } = useTheme();
  const { openSheet, closeSheet } = useSheet();
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;

  const [filters, setFilters] = useState<POAcceptanceTableFilters>({
    acceptanceNumber: "",
    acceptanceObject: "",
    employeeName: "",
  });

  const poId = data?.id || (data as any)?.response?.id;

  const { data: acceptanceData, isLoading } = useAcceptanceList({
    ...filters,
    poId: poId,
    pageIndex,
    pageSize,
  });

  const handleOpenFilter = () => {
    openSheet(
      <POAcceptanceTableFilterSheet
        initialFilters={filters}
        onApply={setFilters}
        onClose={closeSheet}
      />,
    );
  };

  const handleOpenDetail = (item: AcceptanceItem) => {
    openSheet(<POAcceptanceDetailSheet data={item} onClose={closeSheet} />);
  };

  const columns = [
    "Số BB nghiệm thu",
    "Đối tượng",
    "Ngày nghiệm thu",
    "Người nghiệm thu",
    "Kết quả",
    <Table.ButtonFilterTable
      key="acceptance-filter"
      onPress={handleOpenFilter}
    />,
  ];

  const columnWidths = [180, 200, 150, 180, 200, 50];

  const rows = (acceptanceData?.data || []).map((item: AcceptanceItem) => ({
    cells: [
      item.acceptanceNumber,
      item.acceptanceObject,
      item.handoverTime
        ? moment(item.handoverTime).format("DD/MM/YYYY")
        : "---",
      item.employeeName,
      item.acceptanceResults,
      <Table.EyeDetailRow onPress={() => handleOpenDetail(item)} />,
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
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Table
          columns={columns}
          rows={rows}
          columnWidths={columnWidths}
          horizontalScroll
          stickyColumn="right"
          containerStyle={styles.table}
          pagination={{
            enabled: true,
            defaultPageSize: 5,
            pageSizeOptions: [],
            showTotal: false,
          }}
        />
        <Spacer size={20} />
      </ScrollView>
    </View>
  );
};

export default POAcceptanceTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  table: {
    marginHorizontal: 0,
  },
});
