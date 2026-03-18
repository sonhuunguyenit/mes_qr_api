import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Icon } from "@rneui/themed";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Input, Row, Text } from "~/common";
import { useTheme } from "~/hooks/useTheme";

export interface PRItemTableFilters {
  itemNo?: string;
  materialCode?: string;
  shortText?: string;
  acccate?: string;
  category?: string;
  plantCode?: string;
  costCenterCode?: string;
  assetCode?: string;
  orderCode?: string;
  materialGroupCode?: string;
  externalMaterialGroupCode?: string;
  purchasingGroupCode?: string;
  glAccountCode?: string;
  fund?: string;
  fc?: string;
  fp?: string;
  ci?: string;
  requisitioner?: string;
  sloc?: string;
}

interface PRItemTableFilterSheetProps {
  initialFilters: PRItemTableFilters;
  onApply: (filters: PRItemTableFilters) => void;
  onClose: () => void;
}

const PRItemTableFilterSheet = ({
  initialFilters,
  onApply,
  onClose,
}: PRItemTableFilterSheetProps) => {
  const { colors, radius } = useTheme();
  const [filters, setFilters] = useState<PRItemTableFilters>(initialFilters);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: PRItemTableFilters = {
      itemNo: "",
      materialCode: "",
      shortText: "",
      acccate: "",
      category: "",
      plantCode: "",
      costCenterCode: "",
      assetCode: "",
      orderCode: "",
      materialGroupCode: "",
      externalMaterialGroupCode: "",
      purchasingGroupCode: "",
      glAccountCode: "",
      fund: "",
      fc: "",
      fp: "",
      ci: "",
      requisitioner: "",
      sloc: "",
    };
    setFilters(resetFilters);
    onApply(resetFilters);
  };

  const updateFilter = <K extends keyof PRItemTableFilters>(
    key: K,
    value: PRItemTableFilters[K],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Icon name="sliders" type="feather" size={22} color={colors.label} />
        <Text bold size={16} color={colors.title}>
          Lọc bảng Item
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
          <Row gap={12}>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Số Item line
              </Text>
              <Input
                placeholder="Số item..."
                value={filters.itemNo}
                onChangeText={(val) => updateFilter("itemNo", val)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Acc/Category
              </Text>
              <Input
                placeholder="Acc / Cat..."
                value={filters.acccate}
                onChangeText={(val) => updateFilter("acccate", val)}
              />
            </View>
          </Row>

          <View style={styles.section}>
            <Text bold color={colors.title} style={styles.sectionTitle}>
              Mã vật tư (Material)
            </Text>
            <Input
              placeholder="Tìm theo mã vật tư..."
              value={filters.materialCode}
              onChangeText={(val) => updateFilter("materialCode", val)}
            />
          </View>

          <View style={styles.section}>
            <Text bold color={colors.title} style={styles.sectionTitle}>
              Mô tả (Short text)
            </Text>
            <Input
              placeholder="Tìm theo mô tả..."
              value={filters.shortText}
              onChangeText={(val) => updateFilter("shortText", val)}
            />
          </View>

          <Row gap={12}>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Plant
              </Text>
              <Input
                placeholder="Plant..."
                value={filters.plantCode}
                onChangeText={(val) => updateFilter("plantCode", val)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Sloc
              </Text>
              <Input
                placeholder="Sloc..."
                value={filters.sloc}
                onChangeText={(val) => updateFilter("sloc", val)}
              />
            </View>
          </Row>

          <Row gap={12}>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Cost Center
              </Text>
              <Input
                placeholder="Mã CC..."
                value={filters.costCenterCode}
                onChangeText={(val) => updateFilter("costCenterCode", val)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Order
              </Text>
              <Input
                placeholder="Mã order..."
                value={filters.orderCode}
                onChangeText={(val) => updateFilter("orderCode", val)}
              />
            </View>
          </Row>

          <View style={styles.section}>
            <Text bold color={colors.title} style={styles.sectionTitle}>
              Asset
            </Text>
            <Input
              placeholder="Tìm theo mã asset..."
              value={filters.assetCode}
              onChangeText={(val) => updateFilter("assetCode", val)}
            />
          </View>

          <Row gap={12}>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Material Group
              </Text>
              <Input
                placeholder="Mat Group..."
                value={filters.materialGroupCode}
                onChangeText={(val) => updateFilter("materialGroupCode", val)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Ext Mat Group
              </Text>
              <Input
                placeholder="Ext Group..."
                value={filters.externalMaterialGroupCode}
                onChangeText={(val) =>
                  updateFilter("externalMaterialGroupCode", val)
                }
              />
            </View>
          </Row>

          <View style={styles.section}>
            <Text bold color={colors.title} style={styles.sectionTitle}>
              GL Account
            </Text>
            <Input
              placeholder="Tìm theo GL Account..."
              value={filters.glAccountCode}
              onChangeText={(val) => updateFilter("glAccountCode", val)}
            />
          </View>

          <Row gap={12}>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Fund
              </Text>
              <Input
                placeholder="Fund..."
                value={filters.fund}
                onChangeText={(val) => updateFilter("fund", val)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                FC
              </Text>
              <Input
                placeholder="FC..."
                value={filters.fc}
                onChangeText={(val) => updateFilter("fc", val)}
              />
            </View>
          </Row>

          <Row gap={12}>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                FP
              </Text>
              <Input
                placeholder="FP..."
                value={filters.fp}
                onChangeText={(val) => updateFilter("fp", val)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                CI
              </Text>
              <Input
                placeholder="CI..."
                value={filters.ci}
                onChangeText={(val) => updateFilter("ci", val)}
              />
            </View>
          </Row>

          <View style={styles.section}>
            <Text bold color={colors.title} style={styles.sectionTitle}>
              Requisitioner
            </Text>
            <Input
              placeholder="Tìm theo Requisitioner..."
              value={filters.requisitioner}
              onChangeText={(val) => updateFilter("requisitioner", val)}
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

export default PRItemTableFilterSheet;
