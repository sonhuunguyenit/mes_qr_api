import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Icon } from "@rneui/themed";
import moment from "moment";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  Button,
  DatePicker,
  Input,
  Row,
  SelectPicker,
  Spacer,
  Text,
} from "~/common";
import { useTheme } from "~/hooks/useTheme";
import { PRFilterParams } from "~/services/pr/pr.type";
import { usePRFilterOptions } from "../hooks";

interface PRFilterSheetProps {
  initialFilters: PRFilterParams;
  onApply: (filters: PRFilterParams, isReset?: boolean) => void;
  onClose: () => void;
  isApprove?: boolean;
}

const PRFilterSheet = ({
  initialFilters,
  onApply,
  onClose,
  isApprove,
}: PRFilterSheetProps) => {
  const { colors, radius } = useTheme();
  const [filters, setFilters] = useState<PRFilterParams>(initialFilters);
  const { data: options } = usePRFilterOptions();

  const budgetStatuses = [
    { label: "Tất cả ngân sách", value: "ALL" },
    { label: "Đủ ngân sách", value: "ENOUGH" },
    { label: "Thiếu ngân sách", value: "SHORTAGE" },
  ];

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: PRFilterParams = {
      status: undefined,
      startDate: moment().subtract(1, "month").format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
      keyword: "",
      uses: "",
      budgetStatus: isApprove ? "ALL" : undefined,
      prType: undefined,
      plantId: undefined,
      purchaseGroup: undefined,
      pmsNo: "",
      sapNo: "",
      externalMaterialGroupId: undefined,
      createdBy: "",
      sourceType: undefined,
      totalValueFrom: undefined,
      totalValueTo: undefined,
      budgetShortageFrom: undefined,
      budgetShortageTo: undefined,
    };
    setFilters(resetFilters);
    onApply(resetFilters, true);
    // Don't call onClose() here so user can see it being reset
  };

  const updateFilter = <K extends keyof PRFilterParams>(
    key: K,
    value: PRFilterParams[K],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Icon
          name="sliders"
          type="feather"
          size={22}
          color={colors.label}
          // containerStyle={{
          //   backgroundColor: "#CBD5E1",
          //   padding: 8,
          //   borderRadius: 8,
          //   marginRight: 10,
          // }}
        />
        <Text bold size={16} color={colors.title}>
          Bộ lọc tìm kiếm
        </Text>
        <TouchableOpacity
          onPress={onClose}
          style={styles.closeBtn}
          activeOpacity={0.7}
        >
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
          {/* 1. Trạng thái & Ngân sách */}
          <View style={styles.section}>
            <Row>
              <View style={{ flex: 1 }}>
                <Text bold color={colors.title} style={styles.sectionTitle}>
                  Trạng thái
                </Text>
                <SelectPicker
                  listSelection={options?.statuses || []}
                  value={filters.status}
                  onSelect={(item: Record<string, any>) =>
                    updateFilter("status", item.value)
                  }
                  placeholder="Chọn trạng thái"
                  labelKeys={["label"]}
                  valueKey="value"
                  search={true}
                />
              </View>
              <Spacer size={12} horizontal />
              <View style={{ flex: 1 }}>
                <Text bold color={colors.title} style={styles.sectionTitle}>
                  Ngân sách
                </Text>
                <SelectPicker
                  listSelection={budgetStatuses}
                  value={filters.budgetStatus}
                  onSelect={(item: Record<string, any>) =>
                    updateFilter("budgetStatus", item.value)
                  }
                  placeholder="Tất cả"
                  labelKeys={["label"]}
                  valueKey="value"
                  search={false}
                />
              </View>
            </Row>
          </View>

          {/* 2. Plant */}
          <View style={styles.section}>
            <Text bold color={colors.title} style={styles.sectionTitle}>
              Plant
            </Text>
            <SelectPicker
              listSelection={options?.plants || []}
              value={filters.plantId}
              onSelect={(item: Record<string, any>) =>
                updateFilter("plantId", item.value)
              }
              placeholder="Chọn plant"
              labelKeys={["label"]}
              valueKey="value"
            />
          </View>

          {/* Số PR PMS & SAP */}
          <View style={styles.section}>
            <Row>
              <View style={{ flex: 1 }}>
                <Text bold color={colors.title} style={styles.sectionTitle}>
                  Số PR PMS
                </Text>
                <Input
                  placeholder="Nhập số PMS"
                  value={filters.pmsNo}
                  onChangeText={(val) => updateFilter("pmsNo", val)}
                />
              </View>
              <Spacer size={12} horizontal />
              <View style={{ flex: 1 }}>
                <Text bold color={colors.title} style={styles.sectionTitle}>
                  Số PR SAP
                </Text>
                <Input
                  placeholder="Nhập số SAP"
                  value={filters.sapNo}
                  onChangeText={(val) => updateFilter("sapNo", val)}
                />
              </View>
            </Row>
          </View>

          {/* 4. External Mat Group */}
          <View style={styles.section}>
            <Text bold color={colors.title} style={styles.sectionTitle}>
              External Mat Group
            </Text>
            <SelectPicker
              listSelection={options?.externalMaterialGroups || []}
              value={filters.externalMaterialGroupId}
              onSelect={(item: Record<string, any>) =>
                updateFilter("externalMaterialGroupId", item.value)
              }
              placeholder="Chọn nhóm"
              labelKeys={["label"]}
              valueKey="value"
              search={true}
            />
          </View>

          {/* 5. Mục đích sử dụng */}
          <View style={styles.section}>
            <Text bold color={colors.title} style={styles.sectionTitle}>
              Mục đích sử dụng
            </Text>
            <Input
              placeholder="Nhập mục đích sử dụng"
              value={isApprove ? filters.uses : filters.keyword}
              onChangeText={(val) =>
                updateFilter(isApprove ? "uses" : "keyword", val)
              }
              rightIcon={
                <Icon
                  name="file-text"
                  type="feather"
                  size={20}
                  color={colors.label}
                />
              }
            />
          </View>

          {/* 6. Nhóm mua & Loại PR */}
          <View style={styles.section}>
            <Row>
              <View style={{ flex: 1 }}>
                <Text bold color={colors.title} style={styles.sectionTitle}>
                  Nhóm mua
                </Text>
                <Input
                  placeholder="Mã nhóm mua"
                  value={filters.purchaseGroup}
                  onChangeText={(val) => updateFilter("purchaseGroup", val)}
                />
              </View>
              <Spacer size={12} horizontal />
              <View style={{ flex: 1 }}>
                <Text bold color={colors.title} style={styles.sectionTitle}>
                  Loại PR
                </Text>
                <SelectPicker
                  listSelection={options?.prTypes || []}
                  value={filters.prType}
                  onSelect={(item: Record<string, any>) =>
                    updateFilter("prType", item.value)
                  }
                  placeholder="Chọn loại"
                  labelKeys={["label"]}
                  valueKey="value"
                />
              </View>
            </Row>
          </View>

          {/* 7. Ngày tạo */}
          <View style={styles.section}>
            <Text bold color={colors.title} style={styles.sectionTitle}>
              Ngày tạo
            </Text>
            <Row>
              <View style={{ flex: 1 }}>
                <DatePicker
                  label="Từ"
                  value={
                    filters.startDate
                      ? moment(filters.startDate).toDate()
                      : new Date()
                  }
                  onChange={(date) =>
                    updateFilter("startDate", moment(date).format("YYYY-MM-DD"))
                  }
                />
              </View>
              <Spacer size={12} horizontal />
              <View style={{ flex: 1 }}>
                <DatePicker
                  label="Đến"
                  value={
                    filters.endDate
                      ? moment(filters.endDate).toDate()
                      : new Date()
                  }
                  onChange={(date) =>
                    updateFilter("endDate", moment(date).format("YYYY-MM-DD"))
                  }
                />
              </View>
            </Row>
          </View>

          {/* 8. Người tạo & Nguồn tạo */}
          <View style={styles.section}>
            <Row>
              <View style={{ flex: 1 }}>
                <Text bold color={colors.title} style={styles.sectionTitle}>
                  Người tạo
                </Text>
                <Input
                  placeholder="Nhập tên người tạo"
                  value={filters.createdBy}
                  onChangeText={(val) => updateFilter("createdBy", val)}
                />
              </View>
              <Spacer size={12} horizontal />
              <View style={{ flex: 1 }}>
                <Text bold color={colors.label} style={styles.sectionTitle}>
                  Nguồn tạo
                </Text>
                <SelectPicker
                  listSelection={options?.sourceTypes || []}
                  value={filters.sourceType}
                  onSelect={(item: Record<string, any>) =>
                    updateFilter("sourceType", item.value)
                  }
                  placeholder="Chọn nguồn"
                  labelKeys={["label"]}
                  valueKey="value"
                />
              </View>
            </Row>
          </View>

          {/* 9. Tổng giá trị (Từ - Đến) */}
          <View style={styles.section}>
            <Text bold color={colors.title} style={styles.sectionTitle}>
              Tổng giá trị (VNĐ)
            </Text>
            <Row>
              <View style={{ flex: 1 }}>
                <Input
                  placeholder="Từ"
                  keyboardType="numeric"
                  value={filters.totalValueFrom?.toString()}
                  onChangeText={(val) => updateFilter("totalValueFrom", val)}
                />
              </View>
              <Spacer size={12} horizontal />
              <View style={{ flex: 1 }}>
                <Input
                  placeholder="Đến"
                  keyboardType="numeric"
                  value={filters.totalValueTo?.toString()}
                  onChangeText={(val) => updateFilter("totalValueTo", val)}
                />
              </View>
            </Row>
          </View>

          {/* 10. Ngân sách thiếu (Từ - Đến) */}
          <View style={styles.section}>
            <Text bold color={colors.title} style={styles.sectionTitle}>
              Ngân sách thiếu (VNĐ)
            </Text>
            <Row>
              <View style={{ flex: 1 }}>
                <Input
                  placeholder="Từ"
                  keyboardType="numeric"
                  value={filters.budgetShortageFrom?.toString()}
                  onChangeText={(val) =>
                    updateFilter("budgetShortageFrom", val)
                  }
                />
              </View>
              <Spacer size={12} horizontal />
              <View style={{ flex: 1 }}>
                <Input
                  placeholder="Đến"
                  keyboardType="numeric"
                  value={filters.budgetShortageTo?.toString()}
                  onChangeText={(val) => updateFilter("budgetShortageTo", val)}
                />
              </View>
            </Row>
          </View>

          <Spacer size={20} />
        </View>
      </BottomSheetScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border + "50" }]}>
        <Row>
          <View style={{ flex: 1 }}>
            <Button
              title="Áp dụng bộ lọc"
              onPress={handleApply}
              containerStyle={styles.applyBtnContainer}
              buttonStyle={styles.applyBtn}
              titleStyle={styles.applyBtnTitle}
            />
          </View>
          <Spacer size={12} horizontal />
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
  tagContainer: {
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
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

export default PRFilterSheet;
