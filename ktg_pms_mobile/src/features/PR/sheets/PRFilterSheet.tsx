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
import globalStyle from "~/styles/global-style";
import { useSheet } from "~/contexts/SheetContext";
import { PR_STATUS } from "~/enums";
import { useTheme } from "~/hooks/useTheme";
import { PRFilterParams } from "~/services/pr/pr.type";
import { usePRFilterOptions } from "../hooks";

interface PRFilterSheetProps {
  initialFilters: PRFilterParams;
  onApply: (filters: PRFilterParams, isReset?: boolean) => void;
  onClose: () => void;
}

const PRFilterSheet = ({
  initialFilters,
  onApply,
  onClose,
}: PRFilterSheetProps) => {
  const { spacing, colors } = useTheme();
  const [filters, setFilters] = useState<PRFilterParams>(initialFilters);
  const [isReady, setIsReady] = useState(false);
  const { data: options } = usePRFilterOptions();
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
      clearTimeout(timer);
      setIsSheetLoading(false);
      showL.remove();
      hideL.remove();
    };
  }, []);

  const budgetStatuses = [
    { label: "Tất cả ngân sách", value: undefined },
    { label: "Đủ ngân sách", value: "ENOUGH" },
    { label: "Thiếu ngân sách", value: "SHORTAGE" },
  ];

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: PRFilterParams = {
      status: PR_STATUS.WAITING_APPROVAL,
      startDate: undefined,
      endDate: undefined,
      keyword: "",
      uses: "",
      budgetStatus: undefined,
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
  };

  const updateFilter = <K extends keyof PRFilterParams>(
    key: K,
    value: PRFilterParams[K],
  ) => {
    setFilters((prev: PRFilterParams) => ({ ...prev, [key]: value }));
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
        >
          <Column
            style={{
              gap: spacing.sm,
              paddingBottom: 20,
            }}
          >
            <ColumnFilter
              label="Plant"
              value={
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
              }
              full
              underline={false}
            />

            <Row gap={spacing.sm}>
              <ColumnFilter
                label="Ngân sách"
                value={
                  <SelectPicker
                    listSelection={budgetStatuses}
                    value={filters.budgetStatus}
                    onSelect={(item: Record<string, any>) =>
                      updateFilter("budgetStatus", item.value)
                    }
                    placeholder="Chọn..."
                    labelKeys={["label"]}
                    valueKey="value"
                    search={false}
                  />
                }
                underline={false}
              />
              <ColumnFilter
                label="External Mat Group"
                value={
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
                }
                underline={false}
              />
            </Row>

            <Row gap={spacing.sm}>
              <ColumnFilter
                label="Số PR PMS"
                value={
                  <Input
                    placeholder="Nhập số PMS"
                    value={filters.pmsNo}
                    onChangeText={(val) => updateFilter("pmsNo", val)}
                    InputComponent={BottomSheetTextInput}
                  />
                }
                underline={false}
              />
              <ColumnFilter
                label="Số PR SAP"
                value={
                  <Input
                    placeholder="Nhập số SAP"
                    value={filters.sapNo}
                    onChangeText={(val) => updateFilter("sapNo", val)}
                    InputComponent={BottomSheetTextInput}
                  />
                }
                underline={false}
              />
            </Row>

            <ColumnFilter
              label="Mục đích sử dụng"
              value={
                <Input
                  placeholder="Nhập mục đích sử dụng"
                  value={filters.uses}
                  onChangeText={(val) =>
                    updateFilter("uses", val)
                  }
                  InputComponent={BottomSheetTextInput}
                />
              }
              full
              underline={false}
            />

            <Row gap={spacing.sm}>
              <ColumnFilter
                label="Nhóm mua"
                value={
                  <Input
                    placeholder="Mã nhóm mua"
                    value={filters.purchaseGroup}
                    onChangeText={(val) => updateFilter("purchaseGroup", val)}
                    InputComponent={BottomSheetTextInput}
                  />
                }
                underline={false}
              />
              <ColumnFilter
                label="Loại PR"
                value={
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
                }
                underline={false}
              />
            </Row>

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
            />

            <Row gap={spacing.sm}>
              <ColumnFilter
                label="Người tạo"
                value={
                  <Input
                    placeholder="Nhập tên người tạo"
                    value={filters.createdBy}
                    onChangeText={(val) => updateFilter("createdBy", val)}
                    InputComponent={BottomSheetTextInput}
                  />
                }
                underline={false}
              />
              <ColumnFilter
                label="Nguồn tạo"
                value={
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
                }
                underline={false}
              />
            </Row>

            <ColumnFilter
              label="Tổng giá trị (VNĐ)"
              value={
                <Row gap={12}>
                  <Input
                    placeholder="Từ"
                    keyboardType="numeric"
                    value={filters.totalValueFrom?.toString()}
                    onChangeText={(val) => updateFilter("totalValueFrom", val)}
                    style={{ flex: 1 }}
                    InputComponent={BottomSheetTextInput}
                  />
                  <Input
                    placeholder="Đến"
                    keyboardType="numeric"
                    value={filters.totalValueTo?.toString()}
                    onChangeText={(val) => updateFilter("totalValueTo", val)}
                    style={{ flex: 1 }}
                    InputComponent={BottomSheetTextInput}
                  />
                </Row>
              }
              full
              underline={false}
            />

            <ColumnFilter
              label="Ngân sách thiếu (VNĐ)"
              value={
                <Row gap={12}>
                  <Input
                    placeholder="Từ"
                    keyboardType="numeric"
                    value={filters.budgetShortageFrom?.toString()}
                    onChangeText={(val) =>
                      updateFilter("budgetShortageFrom", val)
                    }
                    style={{ flex: 1 }}
                    InputComponent={BottomSheetTextInput}
                  />
                  <Input
                    placeholder="Đến"
                    keyboardType="numeric"
                    value={filters.budgetShortageTo?.toString()}
                    onChangeText={(val) =>
                      updateFilter("budgetShortageTo", val)
                    }
                    style={{ flex: 1 }}
                    InputComponent={BottomSheetTextInput}
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

export default React.memo(PRFilterSheet);
