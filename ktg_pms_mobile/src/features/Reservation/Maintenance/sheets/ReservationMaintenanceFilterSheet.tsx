import {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Keyboard, Platform, View } from "react-native";
import { Column, DatePicker, Input, Row } from "~/common";
import { FooterSheet, HeaderSheet } from "~/components";
import { ColumnFilter } from "~/components/ColumnFilter";
import { BOTTOM_SHEET_TIME_LOADING } from "~/constants";
import { useSheet } from "~/contexts/SheetContext";

import { useAuth } from "~/hooks/useAuth";
import { useTheme } from "~/hooks/useTheme";
import { ReservationFilterParams } from "~/services/reservation/reservation.type";
import globalStyle from "~/styles/global-style";
import { useReservationMaintenanceFilterOptions } from "../hooks/useReservationMaintenance";

interface Props {
  initialFilters: ReservationFilterParams;
  onApply: (filters: ReservationFilterParams, isReset?: boolean) => void;
  onClose: () => void;
}

const ReservationMaintenanceFilterSheet = ({
  initialFilters,
  onApply,
  onClose,
}: Props) => {
  const { spacing, colors } = useTheme();
  const { user } = useAuth();
  const [filters, setFilters] =
    useState<ReservationFilterParams>(initialFilters);
  const [isReady, setIsReady] = useState(false);
  const { data: options } = useReservationMaintenanceFilterOptions(
    user?.companyId,
  );
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

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: ReservationFilterParams = {
      code: "",
      order_des: "",
      order_id: "",
      orderType: "",
      equipment: "",
      createdByName: "",
      departmentName: "",
      notiDate: undefined,
      currentApprover: "",
      moduleType: initialFilters.moduleType,
      companyId: filters.companyId,
    };
    setFilters(resetFilters);
    onApply(resetFilters, true);
  };

  const updateFilter = <K extends keyof ReservationFilterParams>(
    key: K,
    value: ReservationFilterParams[K],
  ) => {
    setFilters((prev: ReservationFilterParams) => ({ ...prev, [key]: value }));
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
          <Column style={{ gap: spacing.sm, paddingBottom: 20 }}>
            <Row gap={spacing.sm}>
              <ColumnFilter
                label="Mã"
                value={
                  <Input
                    placeholder="Nhập mã đơn"
                    value={filters.code}
                    onChangeText={(val) => updateFilter("code", val)}
                    InputComponent={BottomSheetTextInput}
                  />
                }
                underline={false}
              />
              <ColumnFilter
                label="Mã PM"
                value={
                  <Input
                    placeholder="Nhập mã PM"
                    value={filters.order_id}
                    onChangeText={(val) => updateFilter("order_id", val)}
                    InputComponent={BottomSheetTextInput}
                  />
                }
                underline={false}
              />
            </Row>

            <ColumnFilter
              label="Mô tả đơn hàng"
              value={
                <Input
                  placeholder="Nhập mô tả đơn hàng"
                  value={filters.order_des}
                  onChangeText={(val) => updateFilter("order_des", val)}
                  InputComponent={BottomSheetTextInput}
                />
              }
              full
              underline={false}
            />

            <Row gap={spacing.sm}>
              <ColumnFilter
                label="Loại đơn hàng"
                value={
                  <Input
                    placeholder="Nhập loại"
                    value={filters.orderType}
                    onChangeText={(val) => updateFilter("orderType", val)}
                    InputComponent={BottomSheetTextInput}
                  />
                }
                underline={false}
              />
              <ColumnFilter
                label="Thiết bị"
                value={
                  <Input
                    placeholder="Nhập thiết bị"
                    value={filters.equipment}
                    onChangeText={(val) => updateFilter("equipment", val)}
                    InputComponent={BottomSheetTextInput}
                  />
                }
                underline={false}
              />
            </Row>

            <ColumnFilter
              label="Người tạo"
              value={
                <Input
                  placeholder="Nhập tên người tạo"
                  value={filters.createdByName}
                  onChangeText={(val) => updateFilter("createdByName", val)}
                  InputComponent={BottomSheetTextInput}
                />
              }
              full
              underline={false}
            />

            <ColumnFilter
              label="Phòng ban"
              value={
                <Input
                  placeholder="Nhập phòng ban"
                  value={filters.departmentName}
                  onChangeText={(val) => updateFilter("departmentName", val)}
                  InputComponent={BottomSheetTextInput}
                />
              }
              full
              underline={false}
            />

            <ColumnFilter
              label="Ngày lập phiếu"
              value={
                <DatePicker
                  label="Chọn ngày"
                  value={
                    filters.notiDate
                      ? moment(filters.notiDate).toDate()
                      : undefined
                  }
                  onChange={(date) =>
                    updateFilter(
                      "notiDate",
                      date ? moment(date).format("YYYY-MM-DD") : undefined,
                    )
                  }
                  containerStyle={{ flex: 1 }}
                />
              }
              full
              underline={false}
            />

            <ColumnFilter
              label="Người duyệt hiện tại"
              value={
                <Input
                  placeholder="Nhập người duyệt hiện tại"
                  value={filters.currentApprover}
                  onChangeText={(val) => updateFilter("currentApprover", val)}
                  InputComponent={BottomSheetTextInput}
                />
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

export default React.memo(ReservationMaintenanceFilterSheet);
