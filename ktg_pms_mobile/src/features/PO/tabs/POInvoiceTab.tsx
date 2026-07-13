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
import globalStyle from "~/styles/global-style";
import { useTheme } from "~/hooks/useTheme";
import { useSheet } from "~/contexts/SheetContext";
import { useInvoiceList } from "../hooks";
import { PODetailData } from "~/services/po/po.type";
import { InvoiceItem } from "~/services/invoice/invoice.type";
import POInvoiceDetailSheet from "../sheets/POInvoiceDetailSheet";

interface POInvoiceTabProps {
  data: Partial<PODetailData>;
}

const POInvoiceTab = ({ data }: POInvoiceTabProps) => {
  const { colors } = useTheme();
  const { openSheet, closeSheet } = useSheet();
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;

  const poId = data?.id || (data as any)?.response?.id;
  const { data: invoiceData, isLoading } = useInvoiceList({
    pageIndex,
    pageSize,
    poId: poId,
  });

  const handleOpenDetail = (item: InvoiceItem) => {
    openSheet(<POInvoiceDetailSheet data={item} onClose={closeSheet} />);
  };

  const handleRowDoublePress = (index: number) => {
    const item = invoiceData?.data?.[index];
    if (item) {
      handleOpenDetail(item);
    }
  };

  const columns = [
    "STT",
    "Số hóa đơn",
    "File hóa đơn",
    "Đơn vị tiền tệ",
    "Trị giá",
    "Thuế VAT",
    "Tổng trị giá",
  ];

  const columnWidths = [60, 150, 120, 120, 120, 100, 150];

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
      <Spacer size={10} />
    </ScrollView>
  );
};

export default POInvoiceTab;

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
