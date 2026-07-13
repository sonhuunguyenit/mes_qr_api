import moment from "moment";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { Spacer, Table } from "~/common";
import { useSheet } from "~/contexts/SheetContext";
import { useTheme } from "~/hooks/useTheme";
import { InboundItem } from "~/services/inbound/inbound.type";
import { PODetailData } from "~/services/po/po.type";
import globalStyle from "~/styles/global-style";
import { useInboundList } from "../hooks";
import POInboundDetailSheet from "../sheets/POInboundDetailSheet";

interface POInboundTabProps {
  data: Partial<PODetailData>;
}

const POInboundTab = ({ data }: POInboundTabProps) => {
  const { colors } = useTheme();
  const { openSheet, closeSheet } = useSheet();
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;

  const poId = data?.id || (data as any)?.response?.id;
  const { data: inboundData, isLoading } = useInboundList({
    pageIndex,
    pageSize,
    poIds: poId,
  });

  const handleOpenDetail = (item: InboundItem) => {
    openSheet(<POInboundDetailSheet data={item} onClose={closeSheet} />);
  };

  const handleRowDoublePress = (index: number) => {
    const item = inboundData?.data?.[index];
    if (item) {
      handleOpenDetail(item);
    }
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
  ];

  const columnWidths = [150, 150, 150, 150, 200, 150, 150, 150, 180, 150, 150];

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
      <Spacer size={10} />
    </ScrollView>
  );
};

export default POInboundTab;

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
