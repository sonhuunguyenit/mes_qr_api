import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Table, Spacer, Text } from "~/common";
import { useTheme } from "~/hooks/useTheme";
import { useSheet } from "~/contexts/SheetContext";
import { useInvoiceList } from "../hooks";
import { PODetailData } from "~/services/po/po.type";
import { InvoiceItem } from "~/services/invoice/invoice.type";
import POInvoiceTableFilterSheet, {
  POInvoiceTableFilters,
} from "../sheets/POInvoiceTableFilterSheet";
import POInvoiceDetailSheet from "../sheets/POInvoiceDetailSheet";

interface POInvoiceTabProps {
  data: Partial<PODetailData>;
}

const POInvoiceTab = ({ data }: POInvoiceTabProps) => {
  const { colors } = useTheme();
  const { openSheet, closeSheet } = useSheet();
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;

  const [filters, setFilters] = useState<POInvoiceTableFilters>({
    billCode: "",
    currencyName: "",
    invoiceValue: "",
    vat: "",
    totalInvoiceValue: "",
    statusName: "",
  });

  const { data: invoiceData, isLoading } = useInvoiceList({
    ...filters,
    pageIndex,
    pageSize,
  });

  const handleOpenFilter = () => {
    openSheet(
      <POInvoiceTableFilterSheet
        initialFilters={filters}
        onApply={setFilters}
        onClose={closeSheet}
      />,
    );
  };

  const handleOpenDetail = (item: InvoiceItem) => {
    openSheet(<POInvoiceDetailSheet data={item} onClose={closeSheet} />);
  };

  const columns = [
    "STT",
    "Số hóa đơn",
    "File hóa đơn",
    "Đơn vị tiền tệ",
    "Trị giá",
    "Thuế VAT",
    "Tổng trị giá",
    <Table.ButtonFilterTable key="invoice-filter" onPress={handleOpenFilter} />,
  ];

  const columnWidths = [60, 150, 120, 120, 120, 100, 150, 50];

  const rows = (invoiceData?.data || []).map(
    (item: InvoiceItem, index: number) => ({
      cells: [
        (pageIndex - 1) * pageSize + index + 1,
        item.code,
        item.fileXml ? (
          <TouchableOpacity onPress={() => Linking.openURL(item.fileXml)}>
            <Text
              color={colors.primary}
              style={{ textDecorationLine: "underline" }}
            >
              Xem file
            </Text>
          </TouchableOpacity>
        ) : (
          "---"
        ),
        item.currencyName,
        item.invoiceValue?.toLocaleString(),
        item.vat,
        item.totalInvoiceValue?.toLocaleString(),
        <Table.EyeDetailRow onPress={() => handleOpenDetail(item)} />,
      ],
    }),
  );

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

export default POInvoiceTab;

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
