import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Icon } from "@rneui/themed";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Input, Row, Text } from "~/common";
import { useTheme } from "~/hooks/useTheme";

export interface POInvoiceTableFilters {
  billCode: string;
  currencyName: string;
  invoiceValue: string;
  vat: string;
  totalInvoiceValue: string;
  statusName: string;
}

interface POInvoiceTableFilterSheetProps {
  initialFilters: POInvoiceTableFilters;
  onApply: (filters: POInvoiceTableFilters) => void;
  onClose: () => void;
}

const POInvoiceTableFilterSheet = ({
  initialFilters,
  onApply,
  onClose,
}: POInvoiceTableFilterSheetProps) => {
  const { colors, radius } = useTheme();
  const [filters, setFilters] = useState<POInvoiceTableFilters>(initialFilters);

  const handleUpdate = (key: keyof POInvoiceTableFilters, val: string) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const reset = {
      billCode: "",
      currencyName: "",
      invoiceValue: "",
      vat: "",
      totalInvoiceValue: "",
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
          Bộ lọc bảng hóa đơn
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
          <View style={styles.section}>
            <Text bold color={colors.title} style={styles.sectionTitle}>
              Số hóa đơn (Invoice Number)
            </Text>
            <Input
              placeholder="Nhập số hóa đơn..."
              value={filters.billCode}
              onChangeText={(v) => handleUpdate("billCode", v)}
            />
          </View>

          <Row full gap={12}>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Đơn vị tiền tệ
              </Text>
              <Input
                placeholder="Tiền tệ..."
                value={filters.currencyName}
                onChangeText={(v) => handleUpdate("currencyName", v)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Trạng thái
              </Text>
              <Input
                placeholder="Trạng thái..."
                value={filters.statusName}
                onChangeText={(v) => handleUpdate("statusName", v)}
              />
            </View>
          </Row>

          <Row full gap={12}>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Trị giá
              </Text>
              <Input
                placeholder="Trị giá..."
                value={filters.invoiceValue}
                onChangeText={(v) => handleUpdate("invoiceValue", v)}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Thuế VAT
              </Text>
              <Input
                placeholder="VAT..."
                value={filters.vat}
                onChangeText={(v) => handleUpdate("vat", v)}
                keyboardType="numeric"
              />
            </View>
          </Row>

          <View style={styles.section}>
            <Text bold color={colors.title} style={styles.sectionTitle}>
              Tổng trị giá
            </Text>
            <Input
              placeholder="Tổng trị giá..."
              value={filters.totalInvoiceValue}
              onChangeText={(v) => handleUpdate("totalInvoiceValue", v)}
              keyboardType="numeric"
            />
          </View>
        </View>
      </BottomSheetScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border + "50" }]}>
        <Row full gap={12}>
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

export default POInvoiceTableFilterSheet;
