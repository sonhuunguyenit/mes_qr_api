import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Icon } from "@rneui/themed";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Input, Row, Text, DatePicker } from "~/common";
import { useTheme } from "~/hooks/useTheme";

export interface POInboundTableFilters {
  inboundNumber: string;
  sapShipmentNumber: string;
  shippingType: string;
  shipmentCostNumber: string;
  supplierName: string;
  dateArrivalPort?: Date;
  dateArrivalWarehouse?: Date;
  createdAt?: Date;
  createdByName: string;
  statusName: string;
}

interface POInboundTableFilterSheetProps {
  initialFilters: POInboundTableFilters;
  onApply: (filters: POInboundTableFilters) => void;
  onClose: () => void;
}

const POInboundTableFilterSheet = ({
  initialFilters,
  onApply,
  onClose,
}: POInboundTableFilterSheetProps) => {
  const { colors, radius } = useTheme();
  const [filters, setFilters] = useState<POInboundTableFilters>(initialFilters);

  const handleUpdate = (key: keyof POInboundTableFilters, val: any) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const reset: POInboundTableFilters = {
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
    };
    setFilters(reset);
    onApply(reset);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Icon name="sliders" type="feather" size={22} color={colors.label} />
        <Text bold size={16} color={colors.title}>
          Bộ lọc bảng Inbound
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Icon name="x" type="feather" size={24} color={colors.label} />
        </TouchableOpacity>
      </View>

      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { flexGrow: 1 }]}
        style={{ flex: 1, backgroundColor: colors.background }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ paddingBottom: 20 }}>
          <Row full gap={12}>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Số Inbound PMS
              </Text>
              <Input
                placeholder="Số Inbound PMS"
                value={filters.inboundNumber}
                onChangeText={(v) => handleUpdate("inboundNumber", v)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Số Inbound SAP
              </Text>
              <Input
                placeholder="Số Inbound SAP"
                value={filters.sapShipmentNumber}
                onChangeText={(v) => handleUpdate("sapShipmentNumber", v)}
              />
            </View>
          </Row>

          <Row full gap={12}>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Số shipment
              </Text>
              <Input
                placeholder="Số shipment..."
                value={filters.shippingType}
                onChangeText={(v) => handleUpdate("shippingType", v)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Số Shipment Cost
              </Text>
              <Input
                placeholder="Số Shipment Cost..."
                value={filters.shipmentCostNumber}
                onChangeText={(v) => handleUpdate("shipmentCostNumber", v)}
              />
            </View>
          </Row>

          <View style={styles.section}>
            <Text bold color={colors.title} style={styles.sectionTitle}>
              NCC
            </Text>
            <Input
              placeholder="Nhập tên nhà cung cấp..."
              value={filters.supplierName}
              onChangeText={(v) => handleUpdate("supplierName", v)}
            />
          </View>

          <Row full gap={12}>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Ngày về cảng
              </Text>
              <DatePicker
                value={filters.dateArrivalPort as Date}
                onChange={(date) => handleUpdate("dateArrivalPort", date)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Ngày về kho dự kiến
              </Text>
              <DatePicker
                value={filters.dateArrivalWarehouse as Date}
                onChange={(date) => handleUpdate("dateArrivalWarehouse", date)}
              />
            </View>
          </Row>

          <Row full gap={12}>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Ngày tạo
              </Text>
              <DatePicker
                value={filters.createdAt as Date}
                onChange={(date) => handleUpdate("createdAt", date)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Người tạo
              </Text>
              <Input
                placeholder="Người tạo..."
                value={filters.createdByName}
                onChangeText={(v) => handleUpdate("createdByName", v)}
              />
            </View>
          </Row>

          <View style={styles.section}>
            <Text bold color={colors.title} style={styles.sectionTitle}>
              Trạng thái
            </Text>
            <Input
              placeholder="Nhập trạng thái..."
              value={filters.statusName}
              onChangeText={(v) => handleUpdate("statusName", v)}
            />
          </View>
        </View>
      </BottomSheetScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border + "50" }]}>
        <Row gap={12}>
          <View style={{ flex: 1 }}>
            <Button
              title="Áp dụng bộ lọc"
              onPress={handleApply}
              containerStyle={styles.applyBtnContainer}
              buttonStyle={styles.applyBtn}
              titleStyle={styles.applyBtnTitle}
            />
          </View>
          <TouchableOpacity
            onPress={handleReset}
            style={[
              styles.resetBtn,
              { backgroundColor: colors.surface, borderRadius: radius.button },
            ]}
          >
            <Icon
              name="refresh-cw"
              type="feather"
              size={22}
              color={colors.title}
            />
          </TouchableOpacity>
        </Row>
      </View>
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
    paddingVertical: 8,
  },
  closeBtn: {
    paddingVertical: 10,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexGrow: 1,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    marginBottom: 5,
    fontSize: 12,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    paddingBottom: 12,
  },
  resetBtn: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  applyBtnContainer: {
    height: 50,
  },
  applyBtn: {
    height: 50,
    borderRadius: 12,
  },
  applyBtnTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default POInboundTableFilterSheet;
