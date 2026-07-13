import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import moment from "moment";
import React from "react";
import { View } from "react-native";
import { Column, Row } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";
import { InboundItem } from "~/services/inbound/inbound.type";

interface POInboundDetailSheetProps {
  data: InboundItem;
  onClose: () => void;
}

const POInboundDetailSheet = ({ data }: POInboundDetailSheetProps) => {
  const { spacing } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="detail" />

      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <Row>
            <ColumnInfo label="Số Inbound PMS" value={data.inboundNumber} />
            <ColumnInfo label="Số Inbound SAP" value={data.sapShipmentNumber} />
          </Row>

          <Row>
            <ColumnInfo label="Số shipment" value={data.shippingType} />
            <ColumnInfo
              label="Số Shipment Cost"
              value={data.shipmentCostNumber}
            />
          </Row>

          <ColumnInfo label="Nhà cung cấp" value={data.supplierName} full />

          <Row>
            <ColumnInfo
              label="Ngày về cảng"
              value={
                data.dateArrivalPort
                  ? moment(data.dateArrivalPort).format("DD/MM/YYYY")
                  : "---"
              }
            />
            <ColumnInfo
              label="Ngày về kho dự kiến"
              value={
                data.dateArrivalWarehouse
                  ? moment(data.dateArrivalWarehouse).format("DD/MM/YYYY")
                  : "---"
              }
            />
          </Row>

          <Row>
            <ColumnInfo
              label="Ngày tạo"
              value={
                data.createdAt
                  ? moment(data.createdAt).format("DD/MM/YYYY HH:mm")
                  : "---"
              }
            />
            <ColumnInfo label="Người tạo" value={data.createdByName} />
          </Row>

          <ColumnInfo
            label="Trạng thái"
            value={data.statusName || "---"}
            full
            last
          />

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};

export default POInboundDetailSheet;
