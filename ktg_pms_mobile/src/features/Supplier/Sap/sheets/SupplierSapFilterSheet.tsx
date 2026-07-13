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
import { SupplierNumberAprovalStatus } from "~/enums/supplier.enum";
import { useSheet } from "~/contexts/SheetContext";
import { useTheme } from "~/hooks/useTheme";
import { SupplierSapFilterParams } from "~/services/supplier/supplier.type";
import { BOTTOM_SHEET_TIME_LOADING } from "~/constants";
import globalStyle from "~/styles/global-style";

interface SupplierSapFilterSheetProps {
  initialFilters: SupplierSapFilterParams;
  onApply: (filters: SupplierSapFilterParams, isReset?: boolean) => void;
  onClose: () => void;
  companies?: any[];
}

const SupplierSapFilterSheet = ({
  initialFilters,
  onApply,
  onClose,
  companies = [],
}: SupplierSapFilterSheetProps) => {
  const { spacing, colors } = useTheme();
  const [filters, setFilters] =
    useState<SupplierSapFilterParams>(initialFilters);
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
  }, [setIsSheetLoading]);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: SupplierSapFilterParams = {
      supplierName: "",
      name: "",
      code: "",
      supplierCode: "",
      status: SupplierNumberAprovalStatus.PENDING,
      companyId: undefined,
      createdAt: undefined,
      createdBy: "",
      businessPartnerGroupName: "",
    };
    setFilters(resetFilters);
    onApply(resetFilters, true);
  };

  const updateFilter = <K extends keyof SupplierSapFilterParams>(
    key: K,
    value: SupplierSapFilterParams[K],
  ) => {
    setFilters((prev: SupplierSapFilterParams) => ({
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
          <Column style={{ gap: spacing.sm, paddingBottom: 20 }}>
            <ColumnFilter
              label="Công ty"
              value={
                <SelectPicker
                  listSelection={companies}
                  value={filters.companyId}
                  onSelect={(item: any) => updateFilter("companyId", item.id)}
                  placeholder="Chọn công ty"
                  labelKeys={["name"]}
                  valueKey="id"
                />
              }
              full
              underline={false}
            />

            <ColumnFilter
              label="Tên nhà cung cấp"
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
                    placeholder="Mã số DN"
                    value={filters.supplierCode}
                    onChangeText={(val) => updateFilter("supplierCode", val)}
                    InputComponent={BottomSheetTextInput}
                  />
                }
                underline={false}
              />
              <ColumnFilter
                label="Mã BP Number"
                value={
                  <Input
                    placeholder="Mã BP Number"
                    value={filters.code}
                    onChangeText={(val) => updateFilter("code", val)}
                    InputComponent={BottomSheetTextInput}
                  />
                }
                underline={false}
              />
            </Row>

            <ColumnFilter
              label="Loại hình doanh nghiệp"
              value={
                <Input
                  placeholder="Loại hình doanh nghiệp"
                  value={filters.businessPartnerGroupName}
                  onChangeText={(val) =>
                    updateFilter("businessPartnerGroupName", val)
                  }
                  InputComponent={BottomSheetTextInput}
                />
              }
              full
              underline={false}
            />

            <ColumnFilter
              label="Người tạo"
              value={
                <Input
                  placeholder="Nhập người tạo"
                  value={filters.createdBy}
                  onChangeText={(val) => updateFilter("createdBy", val)}
                  InputComponent={BottomSheetTextInput}
                />
              }
              full
              underline={false}
            />

            <ColumnFilter
              label="Ngày tạo"
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

export default React.memo(SupplierSapFilterSheet);
