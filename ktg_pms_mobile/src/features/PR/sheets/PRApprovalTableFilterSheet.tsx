import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Icon } from "@rneui/themed";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Input, Row, SelectPicker, Text } from "~/common";
import { PR_STATUS, PR_STATUS_CONFIG } from "~/enums";
import { useTheme } from "~/hooks/useTheme";

export interface PRApprovalTableFilters {
  level?: string;
  tile?: string;
  employeeName?: string;
  status?: string;
  comment?: string;
}

interface PRApprovalTableFilterSheetProps {
  initialFilters: PRApprovalTableFilters;
  onApply: (filters: PRApprovalTableFilters) => void;
  onClose: () => void;
}

const PRApprovalTableFilterSheet = ({
  initialFilters,
  onApply,
  onClose,
}: PRApprovalTableFilterSheetProps) => {
  const { colors, radius } = useTheme();
  const [filters, setFilters] =
    useState<PRApprovalTableFilters>(initialFilters);

  const statuses = [
    { label: "Tất cả", value: "" },
    {
      label: PR_STATUS_CONFIG[PR_STATUS.APPROVED].label,
      value: PR_STATUS_CONFIG[PR_STATUS.APPROVED].label,
    },
    {
      label: PR_STATUS_CONFIG[PR_STATUS.WAITING_APPROVAL].label,
      value: PR_STATUS_CONFIG[PR_STATUS.WAITING_APPROVAL].label,
    },
    {
      label: PR_STATUS_CONFIG[PR_STATUS.REJECTED].label,
      value: PR_STATUS_CONFIG[PR_STATUS.REJECTED].label,
    },
    {
      label: PR_STATUS_CONFIG[PR_STATUS.CHECK_AGAIN].label,
      value: PR_STATUS_CONFIG[PR_STATUS.CHECK_AGAIN].label,
    },
  ];

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: PRApprovalTableFilters = {
      level: "",
      tile: "",
      employeeName: "",
      status: "",
      comment: "",
    };
    setFilters(resetFilters);
    onApply(resetFilters);
  };

  const updateFilter = <K extends keyof PRApprovalTableFilters>(
    key: K,
    value: PRApprovalTableFilters[K],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Icon name="sliders" type="feather" size={22} color={colors.label} />
        <Text bold size={16} color={colors.title}>
          Lọc bảng phê duyệt
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
              Cấp duyệt
            </Text>
            <Input
              placeholder="Tìm theo cấp duyệt..."
              value={filters.level}
              onChangeText={(val) => updateFilter("level", val)}
            />
          </View>

          <View style={styles.section}>
            <Text bold color={colors.title} style={styles.sectionTitle}>
              Vị trí / Nhân viên duyệt
            </Text>
            <Input
              placeholder="Tìm theo vị trí..."
              value={filters.tile}
              onChangeText={(val) => updateFilter("tile", val)}
            />
          </View>

          <View style={styles.section}>
            <Text bold color={colors.title} style={styles.sectionTitle}>
              Người duyệt
            </Text>
            <Input
              placeholder="Tìm theo tên người duyệt..."
              value={filters.employeeName}
              onChangeText={(val) => updateFilter("employeeName", val)}
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

          <View style={styles.section}>
            <Text bold color={colors.title} style={styles.sectionTitle}>
              Ghi chú
            </Text>
            <Input
              placeholder="Tìm theo ghi chú..."
              value={filters.comment}
              onChangeText={(val) => updateFilter("comment", val)}
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

export default PRApprovalTableFilterSheet;
