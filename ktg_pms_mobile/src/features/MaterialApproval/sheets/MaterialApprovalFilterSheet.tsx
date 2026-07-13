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
import { useTheme } from "~/hooks/useTheme";
import { MaterialFilterParams } from "~/services/material/material.type";
import { useMaterialFilterOptions } from "../hooks";

interface MaterialApprovalFilterSheetProps {
  initialFilters: MaterialFilterParams;
  onApply: (filters: MaterialFilterParams, isReset?: boolean) => void;
  onClose: () => void;
}

const MaterialApprovalFilterSheet = ({
  initialFilters,
  onApply,
  onClose,
}: MaterialApprovalFilterSheetProps) => {
  const { spacing, colors } = useTheme();
  const [filters, setFilters] = useState<MaterialFilterParams>(initialFilters);
  const [isReady, setIsReady] = useState(false);
  const { data: options } = useMaterialFilterOptions();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const { setIsSheetLoading } = useSheet();

  // Local state for blockAllDate range
  const [blockAllDateStart, setBlockAllDateStart] = useState<
    string | undefined
  >(initialFilters.blockAllDate?.[0]);
  const [blockAllDateEnd, setBlockAllDateEnd] = useState<string | undefined>(
    initialFilters.blockAllDate?.[1],
  );

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

  const handleApply = () => {
    const updatedFilters = { ...filters };
    if (blockAllDateStart && blockAllDateEnd) {
      updatedFilters.blockAllDate = [blockAllDateStart, blockAllDateEnd];
    } else {
      updatedFilters.blockAllDate = undefined;
    }
    onApply(updatedFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: MaterialFilterParams = {
      status: "WAIT_APPROVE",
      isDeleted: undefined,
      code: "",
      name: "",
      materialGroupId: undefined,
      externalMaterialGroupId: undefined,
      plantId: undefined,
      divisionId: undefined,
      createdAt: undefined,
      createdByName: "",
      blockAllDate: undefined,
      keyword: "",
    };
    setBlockAllDateStart(undefined);
    setBlockAllDateEnd(undefined);
    setFilters(resetFilters);
    onApply(resetFilters, true);
  };

  const updateFilter = <K extends keyof MaterialFilterParams>(
    key: K,
    value: MaterialFilterParams[K],
  ) => {
    setFilters((prev: MaterialFilterParams) => ({ ...prev, [key]: value }));
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="filter" onClose={onClose} />

      {isReady ? (
        <BottomSheetScrollView
          style={{
            flex: 1,
            padding: spacing.sm,
            backgroundColor: colors.lgrayBg,
          }}
          contentContainerStyle={{
            paddingBottom: 40,
            gap: 12,
          }}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={Platform.OS === "android"}
        >
          <Column style={{ gap: spacing.sm, paddingBottom: 20 }}>
            {/* Plant */}
            <ColumnFilter
              label="Plant"
              value={
                <SelectPicker
                  listSelection={options?.plants || []}
                  value={filters.plantId}
                  onSelect={(item) =>
                    updateFilter("plantId", (item as { value: string }).value)
                  }
                  placeholder="Chọn plant"
                  labelKeys={["label"]}
                  valueKey="value"
                />
              }
              full
              underline={false}
            />

            {/* Trạng thái duyệt & Trạng thái hoạt động */}
            <Row gap={spacing.sm}>
              {/* <ColumnFilter
                label="Trạng thái duyệt"
                value={
                  <SelectPicker
                    listSelection={options?.statuses || []}
                    value={filters.status}
                    onSelect={(item) =>
                      updateFilter("status", (item as { value: string }).value)
                    }
                    placeholder="Chọn trạng thái"
                    labelKeys={["label"]}
                    valueKey="value"
                    search={false}
                  />
                }
                underline={false}
              /> */}
              <ColumnFilter
                label="Hoạt động"
                value={
                  <SelectPicker
                    listSelection={options?.activeStatuses || []}
                    value={filters.isDeleted?.toString()}
                    onSelect={(item) =>
                      updateFilter("isDeleted", (item as { value: string }).value)
                    }
                    placeholder="Chọn hoạt động"
                    labelKeys={["label"]}
                    valueKey="value"
                    search={false}
                  />
                }
                underline={false}
              />
            </Row>

            {/* Mã & Tên vật tư */}
            <Row gap={spacing.sm}>
              <ColumnFilter
                label="Mã vật tư"
                value={
                  <Input
                    placeholder="Nhập mã"
                    value={filters.code}
                    onChangeText={(val) => updateFilter("code", val)}
                    InputComponent={BottomSheetTextInput}
                  />
                }
                underline={false}
              />
              <ColumnFilter
                label="Tên vật tư"
                value={
                  <Input
                    placeholder="Nhập tên"
                    value={filters.name}
                    onChangeText={(val) => updateFilter("name", val)}
                    InputComponent={BottomSheetTextInput}
                  />
                }
                underline={false}
              />
            </Row>

            {/* Nhóm vật tư & Ext.Mat.Group */}
            <Row gap={spacing.sm}>
              <ColumnFilter
                label="Nhóm vật tư"
                value={
                  <SelectPicker
                    listSelection={options?.materialGroups || []}
                    value={filters.materialGroupId}
                    onSelect={(item) =>
                      updateFilter("materialGroupId", (item as { value: string }).value)
                    }
                    placeholder="Chọn nhóm"
                    labelKeys={["label"]}
                    valueKey="value"
                  />
                }
                underline={false}
              />
              <ColumnFilter
                label="Ext.Mat.Group"
                value={
                  <SelectPicker
                    listSelection={options?.externalMaterialGroups || []}
                    value={filters.externalMaterialGroupId}
                    onSelect={(item) =>
                      updateFilter("externalMaterialGroupId", (item as { value: string }).value)
                    }
                    placeholder="Chọn nhóm"
                    labelKeys={["label"]}
                    valueKey="value"
                  />
                }
                underline={false}
              />
            </Row>

            {/* Division & Người yêu cầu */}
            <Row gap={spacing.sm}>
              <ColumnFilter
                label="Division"
                value={
                  <SelectPicker
                    listSelection={options?.divisions || []}
                    value={filters.divisionId}
                    onSelect={(item) =>
                      updateFilter("divisionId", (item as { value: string }).value)
                    }
                    placeholder="Chọn division"
                    labelKeys={["label"]}
                    valueKey="value"
                  />
                }
                underline={false}
              />
              <ColumnFilter
                label="Người yêu cầu"
                value={
                  <Input
                    placeholder="Nhập tên"
                    value={filters.createdByName}
                    onChangeText={(val) => updateFilter("createdByName", val)}
                    InputComponent={BottomSheetTextInput}
                  />
                }
                underline={false}
              />
            </Row>

            {/* Ngày yêu cầu range */}
            <ColumnFilter
              label="Ngày yêu cầu"
              value={
                <Row gap={12}>
                  <DatePicker
                    label="Từ ngày"
                    value={
                      filters.createdAt?.[0]
                        ? moment(filters.createdAt[0]).toDate()
                        : undefined
                    }
                    onChange={(date) => {
                      const current = filters.createdAt || [];
                      updateFilter("createdAt", [
                        moment(date).format("YYYY-MM-DD"),
                        current[1] || "",
                      ]);
                    }}
                    containerStyle={{ flex: 1 }}
                  />
                  <DatePicker
                    label="Đến ngày"
                    value={
                      filters.createdAt?.[1]
                        ? moment(filters.createdAt[1]).toDate()
                        : undefined
                    }
                    onChange={(date) => {
                      const current = filters.createdAt || [];
                      updateFilter("createdAt", [
                        current[0] || "",
                        moment(date).format("YYYY-MM-DD"),
                      ]);
                    }}
                    containerStyle={{ flex: 1 }}
                  />
                </Row>
              }
              full
              underline={false}
            />

            {/* Ngày khóa range */}
            <ColumnFilter
              label="Ngày khóa"
              value={
                <Row gap={12}>
                  <DatePicker
                    label="Từ ngày"
                    value={
                      blockAllDateStart
                        ? moment(blockAllDateStart).toDate()
                        : undefined
                    }
                    onChange={(date) =>
                      setBlockAllDateStart(moment(date).format("YYYY-MM-DD"))
                    }
                    containerStyle={{ flex: 1 }}
                  />
                  <DatePicker
                    label="Đến ngày"
                    value={
                      blockAllDateEnd
                        ? moment(blockAllDateEnd).toDate()
                        : undefined
                    }
                    onChange={(date) =>
                      setBlockAllDateEnd(moment(date).format("YYYY-MM-DD"))
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
            color={colors.primary}
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

export default React.memo(MaterialApprovalFilterSheet);
