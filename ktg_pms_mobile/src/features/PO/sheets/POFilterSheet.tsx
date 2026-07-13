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
import { PO_STATUS } from "~/enums";
import { useSheet } from "~/contexts/SheetContext";
import { useTheme } from "~/hooks/useTheme";
import { POFilterParams } from "~/services/po/po.type";
import { usePOFilterOptions } from "../hooks";
import { BOTTOM_SHEET_TIME_LOADING } from "~/constants";
import globalStyle from "~/styles/global-style";

interface POFilterSheetProps {
  initialFilters: POFilterParams;
  onApply: (filters: POFilterParams, isReset?: boolean) => void;
  onClose: () => void;
}

const POFilterSheet = ({
  initialFilters,
  onApply,
  onClose,
}: POFilterSheetProps) => {
  const { spacing, colors } = useTheme();
  const [filters, setFilters] = useState<POFilterParams>(initialFilters);
  const [isReady, setIsReady] = useState(false);
  const { data: options } = usePOFilterOptions();
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
    const resetFilters: POFilterParams = {
      status: PO_STATUS.WAITING_APPROVAL,
      budgetStatus: undefined,
      referenceSourceType: undefined,
      startDate: undefined,
      endDate: undefined,
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
    setFilters((prev: POFilterParams) => ({ ...prev, [key]: value }));
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="filter" onClose={onClose} />

      {isReady ? (
        <BottomSheetScrollView
          style={{
            flex: 1,
            padding: spacing.sm,
            gap: 10,
            backgroundColor: colors.lgrayBg,
          }}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={Platform.OS === "android"}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Column
            style={{
              gap: spacing.sm,
              marginTop: spacing.sm,
              paddingBottom: 20,
            }}
          >
            <ColumnFilter
              label="Ngân sách"
              value={
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
              }
              full
              underline={false}
            />

            <Row gap={spacing.sm}>
              <ColumnFilter
                label="Công ty"
                value={
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
                }
                underline={false}
              />
              <ColumnFilter
                label="Nguồn tham chiếu"
                value={
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
                }
                underline={false}
              />
            </Row>

            <Row gap={spacing.sm}>
              <ColumnFilter
                label="Mã PO PMS"
                value={
                  <Input
                    placeholder="Nhập mã PMS"
                    value={filters.code}
                    onChangeText={(val) => updateFilter("code", val)}
                    InputComponent={BottomSheetTextInput}
                  />
                }
                underline={false}
              />
              <ColumnFilter
                label="Mã PO SAP"
                value={
                  <Input
                    placeholder="Nhập mã SAP"
                    value={filters.codeSap}
                    onChangeText={(val) => updateFilter("codeSap", val)}
                    InputComponent={BottomSheetTextInput}
                  />
                }
                underline={false}
              />
            </Row>

            <Row gap={spacing.sm}>
              <ColumnFilter
                label="Chứng từ tham chiếu"
                value={
                  <Input
                    placeholder="Nhập số/mã"
                    value={filters.referenceSourceNumbers}
                    onChangeText={(val) =>
                      updateFilter("referenceSourceNumbers", val)
                    }
                    InputComponent={BottomSheetTextInput}
                  />
                }
                underline={false}
              />
              <ColumnFilter
                label="Đơn vị tiền tệ"
                value={
                  <Input
                    placeholder="VND, USD..."
                    value={filters.currencyCode}
                    onChangeText={(val) => updateFilter("currencyCode", val)}
                    InputComponent={BottomSheetTextInput}
                  />
                }
                underline={false}
              />
            </Row>

            <ColumnFilter
              label="Nhà cung cấp"
              value={
                <Input
                  placeholder="Tên nhà cung cấp"
                  value={filters.supplierName}
                  onChangeText={(val) => updateFilter("supplierName", val)}
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
                  placeholder="Tên người tạo"
                  value={filters.employeeName}
                  onChangeText={(val) => updateFilter("employeeName", val)}
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
                      filters.startDate
                        ? moment(filters.startDate).toDate()
                        : undefined
                    }
                    onChange={(date) =>
                      updateFilter(
                        "startDate",
                        moment(date).format("YYYY-MM-DD"),
                      )
                    }
                    containerStyle={{ flex: 1 }}
                  />
                  <DatePicker
                    label="Đến"
                    value={
                      filters.endDate
                        ? moment(filters.endDate).toDate()
                        : undefined
                    }
                    onChange={(date) =>
                      updateFilter("endDate", moment(date).format("YYYY-MM-DD"))
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
      ) : (
        <View style={globalStyle.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={useTheme().colors.primary}
            style={globalStyle.loadingIndicator}
          />
        </View>
      )}

      {isReady && (Platform.OS === "ios" || !isKeyboardVisible) && (
        <FooterSheet onApply={handleApply} onReset={handleReset} />
      )}
    </View>
  );
};

export default React.memo(POFilterSheet);
