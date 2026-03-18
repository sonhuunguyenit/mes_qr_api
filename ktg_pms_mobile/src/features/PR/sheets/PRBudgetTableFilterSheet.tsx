import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Icon } from "@rneui/themed";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Input, Row, SelectPicker, Spacer, Text } from "~/common";
import { BUDGET_STATUS, BUDGET_STATUS_CONFIG } from "~/enums/pr.enum";
import { useTheme } from "~/hooks/useTheme";

export interface PRBudgetTableFilters {
  budgetReceiptCode?: string;
  budgetPeriod?: string;
  status?: string;
}

interface PRBudgetTableFilterSheetProps {
  initialFilters: PRBudgetTableFilters;
  onApply: (filters: PRBudgetTableFilters) => void;
  onClose: () => void;
}

const PRBudgetTableFilterSheet = ({
  initialFilters,
  onApply,
  onClose,
}: PRBudgetTableFilterSheetProps) => {
  const { colors, radius } = useTheme();
  const [filters, setFilters] = useState<PRBudgetTableFilters>(initialFilters);

  const statuses = [
    { label: "Tất cả", value: "" },
    {
      label: BUDGET_STATUS_CONFIG[BUDGET_STATUS.APPROVED].label,
      value: BUDGET_STATUS_CONFIG[BUDGET_STATUS.APPROVED].label,
    },
    {
      label: BUDGET_STATUS_CONFIG[BUDGET_STATUS.WAIT_EPAY].label,
      value: BUDGET_STATUS_CONFIG[BUDGET_STATUS.WAIT_EPAY].label,
    },
    {
      label: BUDGET_STATUS_CONFIG[BUDGET_STATUS.REJECT].label,
      value: BUDGET_STATUS_CONFIG[BUDGET_STATUS.REJECT].label,
    },
    {
      label: BUDGET_STATUS_CONFIG[BUDGET_STATUS.NEW].label,
      value: BUDGET_STATUS_CONFIG[BUDGET_STATUS.NEW].label,
    },
  ];

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: PRBudgetTableFilters = {
      budgetReceiptCode: "",
      budgetPeriod: "",
      status: "",
    };
    setFilters(resetFilters);
    onApply(resetFilters);
  };

  const updateFilter = <K extends keyof PRBudgetTableFilters>(
    key: K,
    value: PRBudgetTableFilters[K],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Icon name="sliders" type="feather" size={22} color={colors.label} />
        <Text bold size={16} color={colors.title}>
          Lọc bảng ngân sách
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
              Số phiếu
            </Text>
            <Input
              placeholder="Tìm theo số phiếu..."
              value={filters.budgetReceiptCode}
              onChangeText={(val) => updateFilter("budgetReceiptCode", val)}
            />
          </View>

          <View style={styles.section}>
            <Text bold color={colors.title} style={styles.sectionTitle}>
              Kỳ ngân sách
            </Text>
            <Input
              placeholder="Tìm theo kỳ (YYYYMM)..."
              value={filters.budgetPeriod}
              onChangeText={(val) => updateFilter("budgetPeriod", val)}
            />
          </View>

          <View style={styles.section}>
            <Text bold color={colors.title} style={styles.sectionTitle}>
              Trạng thái
            </Text>
            <SelectPicker
              listSelection={statuses}
              value={filters.status}
              onSelect={(item: any) => updateFilter("status", item.value)}
              placeholder="Tất cả trạng thái"
              labelKeys={["label"]}
              valueKey="value"
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

export default PRBudgetTableFilterSheet;
