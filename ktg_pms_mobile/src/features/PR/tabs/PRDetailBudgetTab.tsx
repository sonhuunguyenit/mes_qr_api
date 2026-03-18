import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "~/common";
import Table from "~/common/Table";
import { useSheet } from "~/contexts/SheetContext";
import { BUDGET_STATUS, BUDGET_STATUS_CONFIG } from "~/enums/pr.enum";
import { useTheme } from "~/hooks/useTheme";
import { PRBudgetReceiptItem, PRItemData } from "~/services/pr/pr.type";
import PRBudgetTableFilterSheet, {
  PRBudgetTableFilters,
} from "../sheets/PRBudgetTableFilterSheet";

interface PRDetailBudgetTabProps {
  data: PRItemData;
  onShowDetail?: (item: PRBudgetReceiptItem) => void;
}

export const PRDetailBudgetTab = React.memo(
  ({ data, onShowDetail }: PRDetailBudgetTabProps) => {
    const { colors } = useTheme();
    const { openSheet, closeSheet } = useSheet();
    const [tableFilters, setTableFilters] = useState<PRBudgetTableFilters>({
      budgetReceiptCode: "",
      budgetPeriod: "",
      status: "",
    });

    const isFiltered = !!(
      tableFilters.budgetReceiptCode ||
      tableFilters.budgetPeriod ||
      tableFilters.status
    );

    const handleOpenFilter = useCallback(() => {
      openSheet(
        <PRBudgetTableFilterSheet
          initialFilters={tableFilters}
          onApply={setTableFilters}
          onClose={closeSheet}
        />,
      );
    }, [openSheet, tableFilters, closeSheet]);

    const tableContent = useMemo(() => {
      const filteredData =
        data.lstBudgetReceiptItem?.filter((item) => {
          const matchCode =
            !tableFilters.budgetReceiptCode ||
            item.budgetReceiptCode
              ?.toLowerCase()
              .includes(tableFilters.budgetReceiptCode.toLowerCase());
          const matchPeriod =
            !tableFilters.budgetPeriod ||
            item.budgetPeriod
              ?.toLowerCase()
              .includes(tableFilters.budgetPeriod.toLowerCase());

          const statusConfig =
            BUDGET_STATUS_CONFIG[item.status as BUDGET_STATUS];
          const statusName = item.statusName || statusConfig?.label || "";
          const matchStatus =
            !tableFilters.status ||
            statusName.toLowerCase() === tableFilters.status.toLowerCase();

          return matchCode && matchPeriod && matchStatus;
        }) || [];

      return filteredData.map((item: PRBudgetReceiptItem) => {
        const statusConfig = BUDGET_STATUS_CONFIG[item.status as BUDGET_STATUS];
        return {
          cells: [
            item.budgetReceiptCode,
            item.budgetPeriod,
            item.moneyPropose
              ? Number(item.moneyPropose).toLocaleString("en-US")
              : "0",
            <View
              key={`status-${item.budgetReceiptCode}`}
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    item.statusBgColor || statusConfig?.bgColor || "#f0f0f0",
                  borderColor:
                    item.statusColor || statusConfig?.borderColor || "#d9d9d9",
                  borderWidth: 1,
                },
              ]}
            >
              <Text
                bold
                color={item.statusColor || statusConfig?.color || colors.text}
                size={11}
              >
                {item.statusName || statusConfig?.label || item.status}
              </Text>
            </View>,
            <Table.EyeDetailRow
              key={`eye-${item.budgetReceiptCode}`}
              onPress={() => onShowDetail?.(item)}
            />,
          ],
        };
      });
    }, [data.lstBudgetReceiptItem, tableFilters, onShowDetail, colors.text]);

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Table
          horizontalScroll
          containerStyle={{ marginHorizontal: 0 }}
          columns={[
            "Số phiếu",
            "Kỳ",
            "Số tiền",
            "Trạng thái",
            <Table.ButtonFilterTable
              key="item-filter"
              onPress={handleOpenFilter}
              isFiltered={isFiltered}
            />,
            ,
          ]}
          columnWidths={[120, 80, 120, 120, 60]}
          stickyColumn="right"
          rows={tableContent}
        />
      </ScrollView>
    );
  },
);

const styles = StyleSheet.create({
  scrollContent: {
    padding: 5,
    paddingTop: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    alignSelf: "flex-start",
    minHeight: 24,
    justifyContent: "center",
  },
  dot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F80D53",
  },
});
