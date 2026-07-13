import {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Keyboard, Platform, View, ActivityIndicator } from "react-native";
import { Column, DatePicker, Input, Row, SelectPicker } from "~/common";
import { FooterSheet, HeaderSheet } from "~/components";
import { ColumnFilter } from "~/components/ColumnFilter";
import { useSheet } from "~/contexts/SheetContext";
import { useTheme } from "~/hooks/useTheme";
import { SupplierPotentialFilterParams } from "~/services/supplier/supplier.type";
import {
  SUPPLIER_POTENTIAL_UPGRADE_STATUS_CONFIG,
  SupplierPotentialUpgradeStatus,
} from "~/enums/supplier.enum";
import { useSupplierPotentialFilterOptions } from "../hooks";
import { BOTTOM_SHEET_TIME_LOADING } from "~/constants";
import globalStyle from "~/styles/global-style";

interface SupplierPotentialFilterSheetProps {
  initialFilters: SupplierPotentialFilterParams;
  onApply: (filters: SupplierPotentialFilterParams, isReset?: boolean) => void;
  onClose: () => void;
}

const SupplierPotentialFilterSheet = ({
  initialFilters,
  onApply,
  onClose,
}: SupplierPotentialFilterSheetProps) => {
  const { spacing, colors } = useTheme();
  const [filters, setFilters] =
    useState<SupplierPotentialFilterParams>(initialFilters);
  const [isReady, setIsReady] = useState(false);
  const { data: options } = useSupplierPotentialFilterOptions();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const { setIsSheetLoading } = useSheet();

  useEffect(() => {
    setIsSheetLoading(true);
    const timer = setTimeout(() => {
      setIsReady(true);
      setIsSheetLoading(false);
    }, BOTTOM_SHEET_TIME_LOADING);

    const showL = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true),
    );
    const hideL = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false),
    );
    return () => {
      setIsSheetLoading(false);
      clearTimeout(timer);
      showL.remove();
      hideL.remove();
    };
  }, []);

  // Mapping status (Workflow)
  const workflowStatuses = Object.entries(
    SUPPLIER_POTENTIAL_UPGRADE_STATUS_CONFIG,
  ).map(([value, config]) => ({
    label: config.label,
    value,
  }));

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: SupplierPotentialFilterParams = {
      supplierName: "",
      name: "",
      code: "",
      status: SupplierPotentialUpgradeStatus.WaitApprove,
      sapStatus: undefined,
      companyCode: undefined,
      purchasingGroupName: undefined,
      businessTypeName: undefined,
      supplierGrade: undefined,
      createdByName: undefined,
      createdAt: undefined,
    };
    setFilters(resetFilters);
    onApply(resetFilters, true);
  };

  const updateFilter = <K extends keyof SupplierPotentialFilterParams>(
    key: K,
    value: SupplierPotentialFilterParams[K],
  ) => {
    setFilters((prev: SupplierPotentialFilterParams) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="filter" onClose={onClose} />
      {!isReady ? (
        <View style={globalStyle.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={globalStyle.loadingIndicator}
          />
        </View>
      ) : (
        <BottomSheetScrollView
          style={{
            flex: 1,
            padding: spacing.sm,
            backgroundColor: colors.lgrayBg,
          }}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={Platform.OS === "android"}
        >
          <Column
            style={{
              gap: spacing.sm,
              paddingBottom: 40,
            }}
          >
            {/* 1. Tên nhà cung cấp */}
            <ColumnFilter
              label="Tên nhà cung cấp"
              value={
                <Input
                  placeholder="Nhập tên nhà cung cấp..."
                  value={filters.supplierName || filters.name}
                  onChangeText={(val) => {
                    updateFilter("supplierName", val);
                    updateFilter("name", val);
                  }}
                  InputComponent={BottomSheetTextInput}
                />
              }
              full
              underline={false}
            />

            {/* 2. Mã số doanh nghiệp */}
            <ColumnFilter
              label="Mã số doanh nghiệp"
              value={
                <Input
                  placeholder="Nhập mã số doanh nghiệp..."
                  value={filters.code || filters.supplierCode}
                  onChangeText={(val) => {
                    updateFilter("code", val);
                    updateFilter("supplierCode", val);
                  }}
                  InputComponent={BottomSheetTextInput}
                />
              }
              full
              underline={false}
            />

            {/* 3. Trạng thái SAP */}
            <ColumnFilter
              label="Trạng thái SAP"
              value={
                <SelectPicker
                  listSelection={options?.sapStatuses || []}
                  value={filters.sapStatus}
                  onSelect={(item: any) =>
                    updateFilter("sapStatus", item.value)
                  }
                  placeholder="Chọn..."
                  labelKeys={["label"]}
                  valueKey="value"
                  search={false}
                />
              }
              full
              underline={false}
            />

            {/* 4. Company Code & Purchasing Group */}
            <Row gap={spacing.sm}>
              <ColumnFilter
                label="Company Code"
                value={
                  <SelectPicker
                    listSelection={options?.companies || []}
                    value={filters.companyCode}
                    onSelect={(item: any) =>
                      updateFilter("companyCode", item.value)
                    }
                    placeholder="Chọn..."
                    labelKeys={["label"]}
                    valueKey="value"
                  />
                }
                underline={false}
              />
              <ColumnFilter
                label="Purchasing Group"
                value={
                  <SelectPicker
                    listSelection={options?.purchaseGroups || []}
                    value={filters.purchasingGroupName}
                    onSelect={(item: any) =>
                      updateFilter("purchasingGroupName", item.value)
                    }
                    placeholder="Chọn..."
                    labelKeys={["label"]}
                    valueKey="value"
                  />
                }
                underline={false}
              />
            </Row>

            {/* 5. Loại hình & Xếp loại */}
            <Row gap={spacing.sm}>
              <ColumnFilter
                label="Loại hình DN"
                value={
                  <SelectPicker
                    listSelection={options?.businessTypes || []}
                    value={filters.businessTypeName}
                    onSelect={(item: any) =>
                      updateFilter("businessTypeName", item.value)
                    }
                    placeholder="Chọn..."
                    labelKeys={["label"]}
                    valueKey="value"
                  />
                }
                underline={false}
              />
              <ColumnFilter
                label="Xếp loại NCC"
                value={
                  <SelectPicker
                    listSelection={options?.supplierGrades || []}
                    value={filters.supplierGrade}
                    onSelect={(item: any) =>
                      updateFilter("supplierGrade", item.value)
                    }
                    placeholder="Chọn..."
                    labelKeys={["label"]}
                    valueKey="value"
                    search={false}
                  />
                }
                underline={false}
              />
            </Row>

            {/* 6. Người tạo */}
            <ColumnFilter
              label="Người tạo"
              value={
                <Input
                  placeholder="Nhập tên người tạo..."
                  value={filters.createdByName}
                  onChangeText={(val) => updateFilter("createdByName", val)}
                  InputComponent={BottomSheetTextInput}
                />
              }
              full
              underline={false}
            />

            {/* 7. Ngày đăng ký */}
            <ColumnFilter
              label="Ngày đăng ký"
              value={
                <Row gap={12}>
                  <DatePicker
                    label="Từ"
                    value={
                      filters.createdAt?.[0]
                        ? moment(filters.createdAt[0]).toDate()
                        : undefined
                    }
                    onChange={(date) => {
                      const newRange = [...(filters.createdAt || [])];
                      newRange[0] = moment(date).format("YYYY-MM-DD");
                      updateFilter("createdAt", newRange);
                    }}
                    containerStyle={{ flex: 1 }}
                  />
                  <DatePicker
                    label="Đến"
                    value={
                      filters.createdAt?.[1]
                        ? moment(filters.createdAt[1]).toDate()
                        : undefined
                    }
                    onChange={(date) => {
                      const newRange = [...(filters.createdAt || [])];
                      newRange[1] = moment(date).format("YYYY-MM-DD");
                      updateFilter("createdAt", newRange);
                    }}
                    containerStyle={{ flex: 1 }}
                  />
                </Row>
              }
              full
              underline={false}
              last
            />
          </Column>
        </BottomSheetScrollView>
      )}

      {isReady && (Platform.OS === "ios" || !isKeyboardVisible) && (
        <FooterSheet onApply={handleApply} onReset={handleReset} />
      )}
    </View>
  );
};

export default React.memo(SupplierPotentialFilterSheet);
