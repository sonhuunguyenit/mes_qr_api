import React, { useState } from "react";
import { View, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import moment from "moment";
import { Table, Column, Row, Spacer, Text } from "~/common";
import { useTheme } from "~/hooks/useTheme";
import { useSheet } from "~/contexts/SheetContext";
import { useInboundList } from "../hooks";
import { PODetailData } from "~/services/po/po.type";
import { InboundItem } from "~/services/inbound/inbound.type";
import POInboundTableFilterSheet, {
  POInboundTableFilters,
} from "../sheets/POInboundTableFilterSheet";
import POInboundDetailSheet from "../sheets/POInboundDetailSheet";
import { Scroll } from "~/components/Scroll";

interface POInboundTabProps {
  data: Partial<PODetailData>;
}

const POInboundTab = ({ data }: POInboundTabProps) => {
  const { colors } = useTheme();
  const { openSheet, closeSheet } = useSheet();
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;

  const [filters, setFilters] = useState<POInboundTableFilters>({
    inboundNumber: "",
    sapShipmentNumber: "",
    shippingType: "",
    shipmentCostNumber: "",
    supplierName: "",
    dateArrivalPort: undefined,
    dateArrivalWarehouse: undefined,
    createdAt: undefined,
    createdByName: "",
    statusName: "",
  });

  const { data: inboundData, isLoading } = useInboundList({
    ...filters,
    pageIndex,
    pageSize,
  });

  const handleOpenFilter = () => {
    openSheet(
      <POInboundTableFilterSheet
        initialFilters={filters}
        onApply={setFilters}
        onClose={closeSheet}
      />,
    );
  };

  const handleOpenDetail = (item: InboundItem) => {
    openSheet(<POInboundDetailSheet data={item} onClose={closeSheet} />);
  };

  const columns = [
    "Số Inbound PMS",
    "Số Inbound SAP",
    "Số shipment",
    "Số Shipment Cost",
    "NCC",
    "Ngày về cảng",
    "Ngày về kho dự kiến",
    "Thực giao",
    "Ngày tạo",
    "Người tạo",
    "Trạng thái",
    <Table.ButtonFilterTable key="inbound-filter" onPress={handleOpenFilter} />,
  ];

  const columnWidths = [
    150, 150, 150, 150, 200, 150, 150, 150, 180, 150, 150, 50,
  ];

  const rows = (inboundData?.data || []).map((item: InboundItem) => ({
    cells: [
      item.inboundNumber,
      item.sapShipmentNumber,
      item.shippingType,
      item.shipmentCostNumber,
      item.supplierName,
      item.dateArrivalPort
        ? moment(item.dateArrivalPort).format("DD/MM/YYYY")
        : "---",
      item.dateArrivalWarehouse
        ? moment(item.dateArrivalWarehouse).format("DD/MM/YYYY")
        : "---",
      "---",
      item.createdAt
        ? moment(item.createdAt).format("DD/MM/YYYY HH:mm")
        : "---",
      item.createdByName,
      item.statusName,
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
      <Scroll>
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
      </Scroll>
    </View>
  );
};

export default POInboundTab;

const styles = StyleSheet.create({
  container: {
    padding: 5,
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
