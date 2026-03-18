import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Icon } from "@rneui/themed";
import moment from "moment";
import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
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
import { POFilterParams } from "~/services/po/po.type";
import { usePOFilterOptions } from "../hooks";

interface POFilterSheetProps {
  initialFilters: POFilterParams;
  onApply: (filters: POFilterParams, isReset?: boolean) => void;
  onClose: () => void;
  isApprove?: boolean;
}

const POFilterSheet = ({
  initialFilters,
  onApply,
  onClose,
  isApprove,
}: POFilterSheetProps) => {
  const { colors, radius } = useTheme();
  const [filters, setFilters] = useState<POFilterParams>(initialFilters);
  const { data: options } = usePOFilterOptions();

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: POFilterParams = {
      status: undefined,
      budgetStatus: undefined,
      referenceSourceType: undefined,
      startDate: moment().subtract(1, "month").format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
      code: "",
      codeSap: "",
      supplierName: "",
      employeeName: "",
      keyword: "",
      companyId: undefined,
      referenceSourceNumbers: "",
      currencyCode: "",
    };
    setFilters(resetFilters);
    onApply(resetFilters, true);
  };

  const updateFilter = <K extends keyof POFilterParams>(
    key: K,
    value: POFilterParams[K],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Icon name="sliders" type="feather" size={22} color={colors.label} />
        <Text bold size={16} color={colors.title}>
          Bộ lọc tìm kiếm PO
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
                  listSelection={options?.budgetStatuses || []}
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

          {/* 2. Công ty & Nguồn tham chiếu */}
          <View style={styles.section}>
            <Row>
              <View style={{ flex: 1 }}>
                <Text bold color={colors.title} style={styles.sectionTitle}>
                  Công ty
                </Text>
                <SelectPicker
                  listSelection={options?.companies || []}
                  value={filters.companyId}
                  onSelect={(item: Record<string, any>) =>
                    updateFilter("companyId", item.value)
                  }
                  placeholder="Chọn công ty"
                  labelKeys={["label"]}
                  valueKey="value"
                  search={true}
                />
              </View>
              <Spacer size={12} horizontal />
              <View style={{ flex: 1 }}>
                <Text bold color={colors.title} style={styles.sectionTitle}>
                  Nguồn tham chiếu
                </Text>
                <SelectPicker
                  listSelection={options?.referenceSources || []}
                  value={filters.referenceSourceType}
                  onSelect={(item: Record<string, any>) =>
                    updateFilter("referenceSourceType", item.value)
                  }
                  placeholder="Chọn nguồn"
                  labelKeys={["label"]}
                  valueKey="value"
                />
              </View>
            </Row>
          </View>

          {/* 3. Số PO PMS & SAP */}
          <View style={styles.section}>
            <Row>
              <View style={{ flex: 1 }}>
                <Text bold color={colors.title} style={styles.sectionTitle}>
                  Mã PO PMS
                </Text>
                <Input
                  placeholder="Nhập mã PMS"
                  value={filters.code}
                  onChangeText={(val) => updateFilter("code", val)}
                />
              </View>
              <Spacer size={12} horizontal />
              <View style={{ flex: 1 }}>
                <Text bold color={colors.title} style={styles.sectionTitle}>
                  Mã PO SAP
                </Text>
                <Input
                  placeholder="Nhập mã SAP"
                  value={filters.codeSap}
                  onChangeText={(val) => updateFilter("codeSap", val)}
                />
              </View>
            </Row>
          </View>

          {/* 4. Chứng từ tham chiếu & Đơn vị tiền tệ */}
          <View style={styles.section}>
            <Row>
              <View style={{ flex: 1 }}>
                <Text bold color={colors.title} style={styles.sectionTitle}>
                  Chứng từ tham chiếu
                </Text>
                <Input
                  placeholder="Nhập số/mã"
                  value={filters.referenceSourceNumbers}
                  onChangeText={(val) =>
                    updateFilter("referenceSourceNumbers", val)
                  }
                />
              </View>
              <Spacer size={12} horizontal />
              <View style={{ flex: 1 }}>
                <Text bold color={colors.title} style={styles.sectionTitle}>
                  Đơn vị tiền tệ
                </Text>
                <Input
                  placeholder="VND, USD..."
                  value={filters.currencyCode}
                  onChangeText={(val) => updateFilter("currencyCode", val)}
                />
              </View>
            </Row>
          </View>

          {/* 5. Nhà cung cấp */}
          <View style={styles.section}>
            <Text bold color={colors.title} style={styles.sectionTitle}>
              Nhà cung cấp
            </Text>
            <Input
              placeholder="Tên nhà cung cấp"
              value={filters.supplierName}
              onChangeText={(val) => updateFilter("supplierName", val)}
              rightIcon={
                <Icon
                  name="truck"
                  type="feather"
                  size={20}
                  color={colors.label}
                />
              }
            />
          </View>

          {/* 6. Người tạo */}
          <View style={styles.section}>
            <Text bold color={colors.title} style={styles.sectionTitle}>
              Người tạo
            </Text>
            <Input
              placeholder="Tên người tạo"
              value={filters.employeeName}
              onChangeText={(val) => updateFilter("employeeName", val)}
              rightIcon={
                <Icon
                  name="user"
                  type="feather"
                  size={20}
                  color={colors.label}
                />
              }
            />
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

export default POFilterSheet;
