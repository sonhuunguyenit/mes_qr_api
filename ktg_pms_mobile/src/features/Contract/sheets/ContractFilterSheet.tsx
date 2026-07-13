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
import { BOTTOM_SHEET_TIME_LOADING } from "~/constants";
import { useSheet } from "~/contexts/SheetContext";
import {
  ContractStatus,
  ContractType,
  ContractTypeConfig,
} from "~/enums/contract.enum";
import { useTheme } from "~/hooks/useTheme";
import { ContractFilterParams } from "~/services/contract/contract.type";
import globalStyle from "~/styles/global-style";
import { useContract } from "../hooks/useContract";

interface ContractFilterSheetProps {
  initialFilters: ContractFilterParams;
  onApply: (filters: ContractFilterParams, isReset?: boolean) => void;
  onClose: () => void;
}

const TYPE_OPTIONS = [
  { label: "Tất cả", value: "ALL" },
  ...Object.keys(ContractTypeConfig).map((key) => ({
    label: ContractTypeConfig[key as ContractType].name,
    value: key,
  })),
];

const ContractFilterSheet = ({
  initialFilters,
  onApply,
  onClose,
}: ContractFilterSheetProps) => {
  const { spacing, colors } = useTheme();
  const { useContractFilterOptions } = useContract();
  const { data: options } = useContractFilterOptions();
  const [filters, setFilters] = useState<ContractFilterParams>(initialFilters);
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
    const resetFilters: ContractFilterParams = {
      pageIndex: 1,
      pageSize: 10,
      contractNumber: "",
      sapCode: "",
      name: "",
      contractType: "",
      supplierName: "",
      status: ContractStatus.WAIT_APPROVE,
      companyCode: undefined,
      effectiveDateStart: undefined,
      effectiveDateEnd: undefined,
      expiredDateStart: undefined,
      expiredDateEnd: undefined,
      createdDateStart: undefined,
      createdDateEnd: undefined,
    };
    setFilters(resetFilters);
    onApply(resetFilters, true);
  };

  const updateFilter = <K extends keyof ContractFilterParams>(
    key: K,
    value: ContractFilterParams[K],
  ) => {
    setFilters((prev: ContractFilterParams) => ({ ...prev, [key]: value }));
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
          <Column style={{ gap: spacing.sm, paddingBottom: 30 }}>
            {/* PMS Contract Code */}
            <ColumnFilter
              label="Số hợp đồng (PMS)"
              value={
                <Input
                  placeholder="Nhập số hợp đồng PMS"
                  value={filters.contractNumber}
                  onChangeText={(val) => updateFilter("contractNumber", val)}
                  InputComponent={BottomSheetTextInput}
                />
              }
              full
              underline={false}
            />

            {/* SAP Contract Code */}
            <ColumnFilter
              label="Mã hợp đồng SAP"
              value={
                <Input
                  placeholder="Nhập mã hợp đồng SAP"
                  value={filters.sapCode}
                  onChangeText={(val) => updateFilter("sapCode", val)}
                  InputComponent={BottomSheetTextInput}
                />
              }
              full
              underline={false}
            />

            {/* Contract Name */}
            <ColumnFilter
              label="Tên hợp đồng"
              value={
                <Input
                  placeholder="Nhập tên hợp đồng"
                  value={filters.name}
                  onChangeText={(val) => updateFilter("name", val)}
                  InputComponent={BottomSheetTextInput}
                />
              }
              full
              underline={false}
            />

            {/* Supplier Name */}
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

            {/* Contract Type (Dropdown) */}
            <ColumnFilter
              label="Loại hợp đồng"
              value={
                <SelectPicker
                  listSelection={TYPE_OPTIONS}
                  value={filters.contractType}
                  onSelect={(item: Record<string, any>) => {
                    updateFilter("contractType", item.value);
                  }}
                  placeholder="Tất cả loại hợp đồng"
                  labelKeys={["label"]}
                  valueKey="value"
                />
              }
              full
              underline={false}
            />

            {/* Công ty mua (Dropdown) */}
            <ColumnFilter
              label="Công ty mua"
              value={
                <SelectPicker
                  listSelection={options?.companies || []}
                  value={filters.companyCode}
                  onSelect={(item: Record<string, any>) => {
                    updateFilter("companyCode", item.value);
                  }}
                  placeholder="Chọn công ty mua"
                  labelKeys={["label"]}
                  valueKey="value"
                  search={true}
                />
              }
              full
              underline={false}
            />

            {/* Ngày có hiệu lực */}
            <ColumnFilter
              label="Ngày có hiệu lực"
              value={
                <Row gap={12}>
                  <DatePicker
                    label="Từ"
                    value={
                      filters.effectiveDateStart
                        ? moment(filters.effectiveDateStart).toDate()
                        : undefined
                    }
                    onChange={(date) =>
                      updateFilter(
                        "effectiveDateStart",
                        moment(date).format("YYYY-MM-DD"),
                      )
                    }
                    containerStyle={{ flex: 1 }}
                  />
                  <DatePicker
                    label="Đến"
                    value={
                      filters.effectiveDateEnd
                        ? moment(filters.effectiveDateEnd).toDate()
                        : undefined
                    }
                    onChange={(date) =>
                      updateFilter(
                        "effectiveDateEnd",
                        moment(date).format("YYYY-MM-DD"),
                      )
                    }
                    containerStyle={{ flex: 1 }}
                  />
                </Row>
              }
              full
              underline={false}
            />

            {/* Ngày hết hiệu lực */}
            <ColumnFilter
              label="Ngày hết hiệu lực"
              value={
                <Row gap={12}>
                  <DatePicker
                    label="Từ"
                    value={
                      filters.expiredDateStart
                        ? moment(filters.expiredDateStart).toDate()
                        : undefined
                    }
                    onChange={(date) =>
                      updateFilter(
                        "expiredDateStart",
                        moment(date).format("YYYY-MM-DD"),
                      )
                    }
                    containerStyle={{ flex: 1 }}
                  />
                  <DatePicker
                    label="Đến"
                    value={
                      filters.expiredDateEnd
                        ? moment(filters.expiredDateEnd).toDate()
                        : undefined
                    }
                    onChange={(date) =>
                      updateFilter(
                        "expiredDateEnd",
                        moment(date).format("YYYY-MM-DD"),
                      )
                    }
                    containerStyle={{ flex: 1 }}
                  />
                </Row>
              }
              full
              underline={false}
            />

            {/* Ngày tạo */}
            <ColumnFilter
              label="Ngày tạo"
              value={
                <Row gap={12}>
                  <DatePicker
                    label="Từ"
                    value={
                      filters.createdDateStart
                        ? moment(filters.createdDateStart).toDate()
                        : undefined
                    }
                    onChange={(date) =>
                      updateFilter(
                        "createdDateStart",
                        moment(date).format("YYYY-MM-DD"),
                      )
                    }
                    containerStyle={{ flex: 1 }}
                  />
                  <DatePicker
                    label="Đến"
                    value={
                      filters.createdDateEnd
                        ? moment(filters.createdDateEnd).toDate()
                        : undefined
                    }
                    onChange={(date) =>
                      updateFilter(
                        "createdDateEnd",
                        moment(date).format("YYYY-MM-DD"),
                      )
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

export default React.memo(ContractFilterSheet);
