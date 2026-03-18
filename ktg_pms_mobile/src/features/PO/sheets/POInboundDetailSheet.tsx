import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Icon } from "@rneui/themed";
import moment from "moment";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Column, Row, Spacer, Text } from "~/common";
import { useTheme } from "~/hooks/useTheme";
import { InboundItem } from "~/services/inbound/inbound.type";

interface POInboundDetailSheetProps {
  data: InboundItem;
  onClose: () => void;
}

const POInboundDetailSheet = ({ data, onClose }: POInboundDetailSheetProps) => {
  const { colors } = useTheme();

  const DetailItem = ({ label, value }: { label: string; value?: string }) => (
    <View style={styles.detailItem}>
      <Text size={12} color={colors.label} style={styles.label}>
        {label}
      </Text>
      <Text bold size={14} color={colors.title}>
        {value || "---"}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Icon name="info" type="feather" size={22} color={colors.primary} />
        <Text bold size={16} color={colors.title}>
          Chi tiết Inbound
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Icon name="x" type="feather" size={24} color={colors.label} />
        </TouchableOpacity>
      </View>

      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Column gap={16}>
          <Row full gap={12}>
            <View style={{ flex: 1 }}>
              <DetailItem label="Số Inbound PMS" value={data.inboundNumber} />
            </View>
            <View style={{ flex: 1 }}>
              <DetailItem
                label="Số Inbound SAP"
                value={data.sapShipmentNumber}
              />
            </View>
          </Row>

          <Row full gap={12}>
            <View style={{ flex: 1 }}>
              <DetailItem label="Số shipment" value={data.shippingType} />
            </View>
            <View style={{ flex: 1 }}>
              <DetailItem
                label="Số Shipment Cost"
                value={data.shipmentCostNumber}
              />
            </View>
          </Row>

          <Row full gap={12}>
            <DetailItem label="Nhà cung cấp" value={data.supplierName} />
          </Row>

          <Row full gap={12}>
            <View style={{ flex: 1 }}>
              <DetailItem
                label="Ngày về cảng"
                value={
                  data.dateArrivalPort
                    ? moment(data.dateArrivalPort).format("DD/MM/YYYY")
                    : "---"
                }
              />
            </View>
            <View style={{ flex: 1 }}>
              <DetailItem
                label="Ngày về kho dự kiến"
                value={
                  data.dateArrivalWarehouse
                    ? moment(data.dateArrivalWarehouse).format("DD/MM/YYYY")
                    : "---"
                }
              />
            </View>
          </Row>

          <Row full gap={12}>
            <View style={{ flex: 1 }}>
              <DetailItem
                label="Ngày tạo"
                value={
                  data.createdAt
                    ? moment(data.createdAt).format("DD/MM/YYYY HH:mm")
                    : "---"
                }
              />
            </View>
            <View style={{ flex: 1 }}>
              <DetailItem label="Người tạo" value={data.createdByName} />
            </View>
          </Row>

          <Row full gap={12}>
            <DetailItem label="Trạng thái" value={data.statusName} />
          </Row>
        </Column>
        <Spacer size={30} />
      </BottomSheetScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
  },
  detailItem: {
    marginBottom: 8,
  },
  label: {
    marginBottom: 4,
  },
});

export default POInboundDetailSheet;
