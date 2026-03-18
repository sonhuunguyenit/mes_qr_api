import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Icon } from "@rneui/themed";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Input, Row, Text, DatePicker } from "~/common";
import { useTheme } from "~/hooks/useTheme";

export interface POItemTableFilters {
  itemClosed?: string;
  itemDeleted?: string;
  itemNo?: string;
  acccate?: string;
  category?: string;
  materialCode?: string;
  matGroup?: string;
  extMatGr?: string;
  assetCode?: string;
  serviceCode?: string;
  shortText?: string;
  quantityUptoPO?: string;
  uom?: string;
  deliveryDate?: Date;
  grossPrice?: string;
  currencyRfq?: string;
  perRfq?: string;
  pricePo?: string;
  currencyPo?: string;
  perPo?: string;
  opu?: string;
  fc?: string;
  fp?: string;
  ci?: string;
  ciName?: string;
  budgetPeriod?: string;
  valueItem?: string;
  totalBudget?: string;
  storageLocation?: string;
  valType?: string;
  rfqCode?: string;
  rfqItem?: string;
  prCode?: string;
  prItem?: string;
}

interface POItemTableFilterSheetProps {
  initialFilters: POItemTableFilters;
  onApply: (filters: POItemTableFilters) => void;
  onClose: () => void;
}

const POItemTableFilterSheet = ({
  initialFilters,
  onApply,
  onClose,
}: POItemTableFilterSheetProps) => {
  const { colors, radius } = useTheme();
  const [filters, setFilters] = useState<POItemTableFilters>(initialFilters);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: POItemTableFilters = {
      itemClosed: "",
      itemDeleted: "",
      itemNo: "",
      acccate: "",
      category: "",
      materialCode: "",
      matGroup: "",
      extMatGr: "",
      assetCode: "",
      serviceCode: "",
      shortText: "",
      quantityUptoPO: "",
      uom: "",
      deliveryDate: undefined,
      grossPrice: "",
      currencyRfq: "",
      perRfq: "",
      pricePo: "",
      currencyPo: "",
      perPo: "",
      opu: "",
      fc: "",
      fp: "",
      ci: "",
      ciName: "",
      budgetPeriod: "",
      valueItem: "",
      totalBudget: "",
      storageLocation: "",
      valType: "",
      rfqCode: "",
      rfqItem: "",
      prCode: "",
      prItem: "",
    };
    setFilters(resetFilters);
    onApply(resetFilters);
  };

  const updateFilter = <K extends keyof POItemTableFilters>(
    key: K,
    value: POItemTableFilters[K],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Icon name="sliders" type="feather" size={22} color={colors.label} />
        <Text bold size={16} color={colors.title}>
          Lọc bảng Item PO
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
                Close
              </Text>
              <Input
                placeholder="Close..."
                value={filters.itemClosed}
                onChangeText={(val) => updateFilter("itemClosed", val)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Delete
              </Text>
              <Input
                placeholder="Delete..."
                value={filters.itemDeleted}
                onChangeText={(val) => updateFilter("itemDeleted", val)}
              />
            </View>
          </Row>

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
                Short text
              </Text>
              <Input
                placeholder="Tìm mô tả..."
                value={filters.shortText}
                onChangeText={(val) => updateFilter("shortText", val)}
              />
            </View>
          </Row>

          <Row gap={12}>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Acc assignment
              </Text>
              <Input
                placeholder="Acc..."
                value={filters.acccate}
                onChangeText={(val) => updateFilter("acccate", val)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Category
              </Text>
              <Input
                placeholder="Category..."
                value={filters.category}
                onChangeText={(val) => updateFilter("category", val)}
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

          <Row gap={12}>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Mat Group
              </Text>
              <Input
                placeholder="Mat Group..."
                value={filters.matGroup}
                onChangeText={(val) => updateFilter("matGroup", val)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Ext Mat Group
              </Text>
              <Input
                placeholder="Ext Group..."
                value={filters.extMatGr}
                onChangeText={(val) => updateFilter("extMatGr", val)}
              />
            </View>
          </Row>

          <Row gap={12}>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Mã tài sản
              </Text>
              <Input
                placeholder="Mã tài sản..."
                value={filters.assetCode}
                onChangeText={(val) => updateFilter("assetCode", val)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Mã dịch vụ
              </Text>
              <Input
                placeholder="Mã dịch vụ..."
                value={filters.serviceCode}
                onChangeText={(val) => updateFilter("serviceCode", val)}
              />
            </View>
          </Row>

          <Row gap={12}>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Số lượng PO
              </Text>
              <Input
                placeholder="Số lượng..."
                value={filters.quantityUptoPO}
                onChangeText={(val) => updateFilter("quantityUptoPO", val)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Unit (OUN)
              </Text>
              <Input
                placeholder="Đơn vị..."
                value={filters.uom}
                onChangeText={(val) => updateFilter("uom", val)}
              />
            </View>
          </Row>

          <Row gap={12}>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Thời gian hàng về
              </Text>
              <DatePicker
                value={filters.deliveryDate as Date}
                onChange={(date) => updateFilter("deliveryDate", date)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Valuation Type
              </Text>
              <Input
                placeholder="ValType..."
                value={filters.valType}
                onChangeText={(val) => updateFilter("valType", val)}
              />
            </View>
          </Row>

          <Row gap={12}>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Đơn giá RFQ
              </Text>
              <Input
                placeholder="Đơn giá RFQ..."
                value={filters.grossPrice}
                onChangeText={(val) => updateFilter("grossPrice", val)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Tiền tệ RFQ
              </Text>
              <Input
                placeholder="Currency..."
                value={filters.currencyRfq}
                onChangeText={(val) => updateFilter("currencyRfq", val)}
              />
            </View>
          </Row>

          <Row gap={12}>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Hệ số RFQ (PER)
              </Text>
              <Input
                placeholder="PER..."
                value={filters.perRfq}
                onChangeText={(val) => updateFilter("perRfq", val)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Đơn giá PO
              </Text>
              <Input
                placeholder="Đơn giá PO..."
                value={filters.pricePo}
                onChangeText={(val) => updateFilter("pricePo", val)}
              />
            </View>
          </Row>

          <Row gap={12}>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Tiền tệ PO
              </Text>
              <Input
                placeholder="Currency PO..."
                value={filters.currencyPo}
                onChangeText={(val) => updateFilter("currencyPo", val)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Hệ số PO (PER)
              </Text>
              <Input
                placeholder="PER PO..."
                value={filters.perPo}
                onChangeText={(val) => updateFilter("perPo", val)}
              />
            </View>
          </Row>

          <Row gap={12}>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                OPU
              </Text>
              <Input
                placeholder="OPU..."
                value={filters.opu}
                onChangeText={(val) => updateFilter("opu", val)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Fund Center
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

          <Row gap={12}>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                CIName
              </Text>
              <Input
                placeholder="CIName..."
                value={filters.ciName}
                onChangeText={(val) => updateFilter("ciName", val)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Kỳ ngân sách
              </Text>
              <Input
                placeholder="Kỳ NS..."
                value={filters.budgetPeriod}
                onChangeText={(val) => updateFilter("budgetPeriod", val)}
              />
            </View>
          </Row>

          <Row gap={12}>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Ngân sách Item
              </Text>
              <Input
                placeholder="NS Item..."
                value={filters.valueItem}
                onChangeText={(val) => updateFilter("valueItem", val)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Ngân sách
              </Text>
              <Input
                placeholder="Ngân sách..."
                value={filters.totalBudget}
                onChangeText={(val) => updateFilter("totalBudget", val)}
              />
            </View>
          </Row>

          <View style={styles.section}>
            <Text bold color={colors.title} style={styles.sectionTitle}>
              Vị trí kho hàng
            </Text>
            <Input
              placeholder="Vị trí kho..."
              value={filters.storageLocation}
              onChangeText={(val) => updateFilter("storageLocation", val)}
            />
          </View>

          <Row gap={12}>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Rfq
              </Text>
              <Input
                placeholder="Mã Rfq..."
                value={filters.rfqCode}
                onChangeText={(val) => updateFilter("rfqCode", val)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Item Rfq
              </Text>
              <Input
                placeholder="Item Rfq..."
                value={filters.rfqItem}
                onChangeText={(val) => updateFilter("rfqItem", val)}
              />
            </View>
          </Row>

          <Row gap={12}>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                PR
              </Text>
              <Input
                placeholder="Mã PR..."
                value={filters.prCode}
                onChangeText={(val) => updateFilter("prCode", val)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text bold color={colors.title} style={styles.sectionTitle}>
                Item PR
              </Text>
              <Input
                placeholder="Item PR..."
                value={filters.prItem}
                onChangeText={(val) => updateFilter("prItem", val)}
              />
            </View>
          </Row>
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

export default POItemTableFilterSheet;
