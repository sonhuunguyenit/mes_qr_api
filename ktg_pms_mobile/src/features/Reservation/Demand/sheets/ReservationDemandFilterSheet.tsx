import {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  View,
} from "react-native";
import { Column, DatePicker, Input, Row, SelectPicker } from "~/common";
import { FooterSheet, HeaderSheet } from "~/components";
import { ColumnFilter } from "~/components/ColumnFilter";
import { BOTTOM_SHEET_TIME_LOADING } from "~/constants";
import { useSheet } from "~/contexts/SheetContext";
import { RESERVATION_STATUS } from "~/enums/reservation.enum";
import { useAuth } from "~/hooks/useAuth";
import { useTheme } from "~/hooks/useTheme";
import { ReservationFilterParams } from "~/services/reservation/reservation.type";
import globalStyle from "~/styles/global-style";
import { useReservationDemandFilterOptions } from "../hooks/useReservationDemand";

interface Props {
  initialFilters: ReservationFilterParams;
  onApply: (filters: ReservationFilterParams, isReset?: boolean) => void;
  onClose: () => void;
}

const ReservationDemandFilterSheet = ({
  initialFilters,
  onApply,
  onClose,
}: Props) => {
  const { spacing, colors } = useTheme();
  const { user } = useAuth();
  const [filters, setFilters] =
    useState<ReservationFilterParams>(initialFilters);
  const [isReady, setIsReady] = useState(false);
  const { data: options } = useReservationDemandFilterOptions(user?.companyId);
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
      startDate: undefined,
      endDate: undefined,
      status: RESERVATION_STATUS.WAITING_APPROVAL,
      keyword: "",
      plantId: undefined,
      departmentId: undefined,
      sourceType: undefined,
      reservationNo: "",
      sapCode: "",
      requisitionerName: "",
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

            <ColumnFilter
              label="Nhà máy"
              value={
                <SelectPicker
                  listSelection={options?.plants || []}
                  value={filters.plantId}
                  onSelect={(item: Record<string, any>) =>
                    updateFilter("plantId", item.value)
                  }
                  placeholder="Chọn nhà máy"
                  labelKeys={["label"]}
                  valueKey="value"
                />
              }
              full
              underline={false}
            />

            <ColumnFilter
              label="Phòng ban"
              value={
                <SelectPicker
                  listSelection={options?.departments || []}
                  value={filters.departmentId}
                  onSelect={(item: Record<string, any>) =>
                    updateFilter("departmentId", item.value)
                  }
                  placeholder="Chọn bộ phận"
                  labelKeys={["label"]}
                  valueKey="value"
                />
              }
              full
              underline={false}
            />

            <ColumnFilter
              label="Người yêu cầu"
              value={
                <Input
                  placeholder="Nhập tên người yêu cầu"
                  value={filters.requisitionerName}
                  onChangeText={(val) => updateFilter("requisitionerName", val)}
                  InputComponent={BottomSheetTextInput}
                />
              }
              full
              underline={false}
            />

            <Row gap={spacing.sm}>
              <ColumnFilter
                label="Loại"
                value={
                  <SelectPicker
                    listSelection={options?.reservationTypes || []}
                    value={filters.sourceType}
                    onSelect={(item: Record<string, any>) =>
                      updateFilter("sourceType", item.value)
                    }
                    placeholder="Chọn loại"
                    labelKeys={["label"]}
                    valueKey="value"
                    search={false}
                  />
                }
                underline={false}
              />
            </Row>

            <Row gap={spacing.sm}>
              <ColumnFilter
                label="Số phiếu"
                value={
                  <Input
                    placeholder="Nhập số PMS"
                    value={filters.reservationNo}
                    onChangeText={(val) => updateFilter("reservationNo", val)}
                    InputComponent={BottomSheetTextInput}
                  />
                }
                underline={false}
              />
              <ColumnFilter
                label="Mã SAP"
                value={
                  <Input
                    placeholder="Nhập số SAP"
                    value={filters.sapCode}
                    onChangeText={(val) => updateFilter("sapCode", val)}
                    InputComponent={BottomSheetTextInput}
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
                        date ? moment(date).format("YYYY-MM-DD") : undefined,
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
                      updateFilter(
                        "endDate",
                        date ? moment(date).format("YYYY-MM-DD") : undefined,
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

export default React.memo(ReservationDemandFilterSheet);
