import { Button, Column, Text } from "~/common";
import { getFontStyle } from "~/common/Text";
import { BOTTOM_SHEET_HEIGHT, MONTHS } from "~/constants";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Icon } from "@rneui/base";
import React, { useCallback, forwardRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "~/hooks/useTheme";

export interface MonthRangeResult {
  startDate: string;
  endDate: string;
  selectedMonths: string[];
}

interface Props {
  onConfirm?: (result: MonthRangeResult) => void;
  initialDate?: Date;
}

const MonthCalendar = forwardRef<BottomSheetModal, Props>((props, ref) => {
  const { onConfirm, initialDate = new Date() } = props;
  const { colors } = useTheme();

  const insets = useSafeAreaInsets();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);

  const changeYear = (offset: number) => {
    setViewYear((prev) => prev + offset);
  };

  const toggleMonth = (monthIndex: number) => {
    const monthKey = `${viewYear}-${(monthIndex + 1).toString().padStart(2, "0")}`;
    setSelectedMonths((prev) =>
      prev.includes(monthKey)
        ? prev.filter((m) => m !== monthKey)
        : [...prev, monthKey],
    );
  };

  const handleConfirm = () => {
    if (selectedMonths.length === 0) return;

    const sorted = [...selectedMonths].sort();
    const firstMonthStr = sorted[0];
    const lastMonthStr = sorted[sorted.length - 1];

    const startDate = `${firstMonthStr}-01`;
    const [lastYear, lastMonth] = lastMonthStr.split("-").map(Number);
    const lastDayOfMonth = new Date(lastYear, lastMonth, 0).getDate();
    const endDate = `${lastMonthStr}-${lastDayOfMonth.toString().padStart(2, "0")}`;

    onConfirm?.({ startDate, endDate, selectedMonths: sorted });
    (ref as any).current?.dismiss();
  };

  const renderBackdrop = useCallback(
    (p: any) => (
      <BottomSheetBackdrop
        {...p}
        pressBehavior="close"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={[BOTTOM_SHEET_HEIGHT]}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.surface }}
      handleIndicatorStyle={{ backgroundColor: colors.divider }}
    >
      <BottomSheetView style={{ flex: 1, paddingHorizontal: 20 }}>
        <Text
          style={{
            color: colors.primary,
            textAlign: "center",
            fontSize: 17,
            ...getFontStyle("600"),
            paddingVertical: 10,
          }}
        >
          Chọn tháng
        </Text>

        <Column full>
          <View
            style={[
              styles.container,
              {
                backgroundColor: colors.surface as string,
                borderColor: colors.divider as string,
              },
            ]}
          >
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => changeYear(-1)}
                style={styles.arrowBtn}
              >
                <Icon
                  name="chevron-left"
                  type="material-community"
                  size={27}
                  color={colors.text as string}
                />
              </TouchableOpacity>
              <View style={styles.title}>
                <Text style={[styles.yearTitle, { color: colors.label as string }]}>
                  {viewYear}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => changeYear(1)}
                style={styles.arrowBtn}
              >
                <Icon
                  name="chevron-right"
                  type="material-community"
                  size={27}
                  color={colors.text as string}
                />
              </TouchableOpacity>
            </View>

            <FlatList
              data={MONTHS.map((item) => item.label)}
              keyExtractor={(item) => item}
              numColumns={3}
              scrollEnabled={false}
              columnWrapperStyle={styles.row}
              renderItem={({ item, index }) => {
                const monthKey = `${viewYear}-${(index + 1).toString().padStart(2, "0")}`;
                const isSelected = selectedMonths.includes(monthKey);

                return (
                  <TouchableOpacity
                    style={[
                      styles.monthItem,
                      { backgroundColor: colors.neutral15 },
                      isSelected && [
                        styles.selectedMonthItem,
                        {
                          backgroundColor: colors.lgreenBg as string,
                          borderColor: colors.primary as string,
                        },
                      ],
                    ]}
                    onPress={() => toggleMonth(index)}
                  >
                    <Text
                      style={[
                        styles.monthText,
                        { color: colors.label as string },
                        isSelected && [
                          styles.selectedMonthText,
                          { color: colors.primary as string },
                        ],
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </Column>

        <View style={{ marginBottom: insets.bottom + 20, marginTop: 20 }}>
          <Button
            title={`Xác nhận`}
            onPress={handleConfirm}
            containerStyle={{ borderRadius: 50 }}
            buttonStyle={{ height: 50, backgroundColor: colors.primary }}
            titleStyle={{ color: colors.white, ...getFontStyle("700") }}
            disabled={selectedMonths.length === 0}
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

MonthCalendar.displayName = "MonthCalendar";

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    width: "100%",
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    width: 100,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  yearTitle: {
    fontSize: 20,
    ...getFontStyle("700"),
  },
  arrowBtn: {
    padding: 10,
    borderRadius: 8,
  },
  row: {
    justifyContent: "space-between",
  },
  monthItem: {
    flex: 1,
    margin: 5,
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedMonthItem: {},
  monthText: {
    fontSize: 14,
  },
  selectedMonthText: {
    ...getFontStyle("700"),
  },
});

export default MonthCalendar;
