import {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Keyboard, Platform, View } from "react-native";
import { Column, DatePicker, Input, Row, SelectPicker } from "~/common";
import { FooterSheet, HeaderSheet } from "~/components";
import { ColumnFilter } from "~/components/ColumnFilter";
import {
  SUPPLIER_LAW_STATUS_OPTIONS,
  SUPPLIER_LOCK_TYPE_OPTIONS,
} from "~/enums";
import { useSheet } from "~/contexts/SheetContext";
import { useTheme } from "~/hooks/useTheme";
import { SupplierLockFilterParams } from "~/services/supplier/supplier-lock.type";
import { BOTTOM_SHEET_TIME_LOADING } from "~/constants";
import globalStyle from "~/styles/global-style";

interface SupplierLockServiceFilterSheetProps {
  initialFilters: SupplierLockFilterParams;
  onApply: (filters: SupplierLockFilterParams, isReset?: boolean) => void;
  onClose: () => void;
}

const SupplierLockServiceFilterSheet = ({
  initialFilters,
  onApply,
  onClose,
}: SupplierLockServiceFilterSheetProps) => {
  const { spacing, colors } = useTheme();
  const [filters, setFilters] =
    useState<SupplierLockFilterParams>(initialFilters);
  const [isReady, setIsReady] = useState(false);
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

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: SupplierLockFilterParams = {
      pageIndex: 1,
      pageSize: 10,
      supplierName: "",
      code: "",
      taxCode: "",
      status: undefined,
      adjustmentType: undefined,
      type: "LSS",
    };
    setFilters(resetFilters);
    onApply(resetFilters, true);
  };

  const updateFilter = <K extends keyof SupplierLockFilterParams>(
    key: K,
    value: SupplierLockFilterParams[K],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
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
          <Column style={{ gap: spacing.sm, paddingBottom: 20 }}>
            {/* <ColumnFilter
            label="Trạng thái"
            value={
              <SelectPicker
                listSelection={SUPPLIER_LAW_STATUS_OPTIONS}
                value={filters.status}
                onSelect={(selected: any) =>
                  updateFilter("status", selected.id)
                }
                placeholder="Chọn trạng thái"
                labelKeys={["name"]}
                valueKey="id"
              />
            }
            full
            underline={false}
          /> */}

            <ColumnFilter
              label="Loại (Mở Khóa/Khóa)"
              value={
                <SelectPicker
                  listSelection={SUPPLIER_LOCK_TYPE_OPTIONS}
                  value={filters.adjustmentType}
                  onSelect={(selected: any) =>
                    updateFilter("adjustmentType", selected.id)
                  }
                  placeholder="Chọn loại điều chỉnh"
                  labelKeys={["name"]}
                  valueKey="id"
                />
              }
              full
              underline={false}
            />

            <ColumnFilter
              label="Nhà cung cấp"
              value={
                <Input
                  placeholder="Nhập tên nhà cung cấp"
                  value={filters.supplierName}
                  onChangeText={(val) => updateFilter("supplierName", val)}
                  InputComponent={BottomSheetTextInput}
                />
              }
              full
              underline={false}
            />

            <Row gap={spacing.sm}>
              <ColumnFilter
                label="Mã số doanh nghiệp"
                value={
                  <Input
                    placeholder="Mã doanh nghiệp"
                    value={filters.taxCode}
                    onChangeText={(val) => updateFilter("taxCode", val)}
                    InputComponent={BottomSheetTextInput}
                  />
                }
                underline={false}
              />
              <ColumnFilter
                label="Mã phiếu điều chỉnh"
                value={
                  <Input
                    placeholder="Số phiếu"
                    value={filters.code}
                    onChangeText={(val) => updateFilter("code", val)}
                    InputComponent={BottomSheetTextInput}
                  />
                }
                underline={false}
              />
            </Row>

            <ColumnFilter
              label="Ngày yêu cầu"
              value={
                <Row gap={12}>
                  <DatePicker
                    label="Từ"
                    value={
                      filters.createdAt?.[0]
                        ? moment(filters.createdAt[0]).toDate()
                        : undefined
                    }
                    onChange={(date) =>
                      updateFilter("createdAt", [
                        moment(date).format("YYYY-MM-DD"),
                        filters.createdAt?.[1],
                      ])
                    }
                    containerStyle={{ flex: 1 }}
                  />
                  <DatePicker
                    label="Đến"
                    value={
                      filters.createdAt?.[1]
                        ? moment(filters.createdAt[1]).toDate()
                        : undefined
                    }
                    onChange={(date) =>
                      updateFilter("createdAt", [
                        filters.createdAt?.[0],
                        moment(date).format("YYYY-MM-DD"),
                      ])
                    }
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

export default SupplierLockServiceFilterSheet;
