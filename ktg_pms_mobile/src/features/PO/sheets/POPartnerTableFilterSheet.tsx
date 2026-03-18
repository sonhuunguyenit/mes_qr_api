import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Icon } from "@rneui/themed";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Input, Row, Text } from "~/common";
import { useTheme } from "~/hooks/useTheme";

export interface POPartnerTableFilters {
  functionCode: string;
  functionName: string;
  partnerType: string;
  partnerCode: string;
  partnerName: string;
}

interface POPartnerTableFilterSheetProps {
  initialFilters: POPartnerTableFilters;
  onApply: (filters: POPartnerTableFilters) => void;
  onClose: () => void;
}

const POPartnerTableFilterSheet = ({
  initialFilters,
  onApply,
  onClose,
}: POPartnerTableFilterSheetProps) => {
  const { colors, radius } = useTheme();
  const [filters, setFilters] = useState<POPartnerTableFilters>(initialFilters);

  const handleUpdate = (key: keyof POPartnerTableFilters, val: string) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const reset = {
      functionCode: "",
      functionName: "",
      partnerType: "",
      partnerCode: "",
      partnerName: "",
    };
    setFilters(reset);
    onApply(reset);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Icon name="sliders" type="feather" size={22} color={colors.label} />
        <Text bold size={16} color={colors.title}>
          Bộ lọc đối tác
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
              Mã chức năng đối tác
            </Text>
            <Input
              placeholder="Nhập mã chức năng"
              value={filters.functionCode}
              onChangeText={(v) => handleUpdate("functionCode", v)}
            />
          </View>

          <View style={styles.section}>
            <Text bold color={colors.title} style={styles.sectionTitle}>
              Chức năng đối tác
            </Text>
            <Input
              placeholder="Nhập chức năng đối tác"
              value={filters.functionName}
              onChangeText={(v) => handleUpdate("functionName", v)}
            />
          </View>

          <View style={styles.section}>
            <Text bold color={colors.title} style={styles.sectionTitle}>
              Loại mã đối tác
            </Text>
            <Input
              placeholder="Nhập loại đối tác"
              value={filters.partnerType}
              onChangeText={(v) => handleUpdate("partnerType", v)}
            />
          </View>

          <View style={styles.section}>
            <Text bold color={colors.title} style={styles.sectionTitle}>
              Mã đối tác
            </Text>
            <Input
              placeholder="Nhập mã đối tác"
              value={filters.partnerCode}
              onChangeText={(v) => handleUpdate("partnerCode", v)}
            />
          </View>

          <View style={styles.section}>
            <Text bold color={colors.title} style={styles.sectionTitle}>
              Tên đối tác
            </Text>
            <Input
              placeholder="Nhập tên đối tác"
              value={filters.partnerName}
              onChangeText={(v) => handleUpdate("partnerName", v)}
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

export default POPartnerTableFilterSheet;
