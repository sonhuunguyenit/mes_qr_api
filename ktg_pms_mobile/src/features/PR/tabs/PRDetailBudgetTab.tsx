import React, { useCallback, useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "~/common";
import Table from "~/common/Table";
import { BUDGET_STATUS, BUDGET_STATUS_CONFIG } from "~/enums/pr.enum";
import { useTheme } from "~/hooks/useTheme";
import { PRBudgetReceiptItem, PRItemData } from "~/services/pr/pr.type";
import DateHelper from "~/utils/date";
import globalStyle from "~/styles/global-style";

interface PRDetailBudgetTabProps {
  data: PRItemData;
  onShowDetail?: (item: PRBudgetReceiptItem) => void;
}

export const PRDetailBudgetTab = React.memo(
  ({ data, onShowDetail }: PRDetailBudgetTabProps) => {
    const { colors } = useTheme();

    const tableContent = useMemo(() => {
      // sync from pr-detail.component.ts:262
      const dataItems = data.lstBudgetReceiptItem || [];
      const result: any[] = [];
      const groupMap = new Map<string, any[]>();

      for (const item of dataItems) {
        const ciKey = item.ci || "NO_CI";
        if (!groupMap.has(ciKey)) {
          groupMap.set(ciKey, []);
        }
        groupMap.get(ciKey)!.push(item);
      }

      let totalAll = 0;

      for (const [ci, items] of groupMap.entries()) {
        let totalCi = 0;

        for (const item of items) {
          totalCi += Number(item.moneyPropose || 0);
          totalAll += Number(item.moneyPropose || 0);

          const statusConfig =
            BUDGET_STATUS_CONFIG[item.status as BUDGET_STATUS];
          result.push({
            cells: [
              item.budgetReceiptCode,
              item.budgetPeriod,
              item.employeeName,
              item.createdAt ? DateHelper.formatDate(item.createdAt) : "",
              item.fund,
              item.ci,
              item.fp,
              item.fc,
              item.moneyPropose
                ? Number(item.moneyPropose).toLocaleString("en-US")
                : "0",
              <View
                key={`status-${item.budgetReceiptCode}`}
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      item.statusBgColor ||
                      statusConfig?.bgColor ||
                      colors.disabledBg,
                    borderColor:
                      item.statusColor ||
                      statusConfig?.borderColor ||
                      colors.divider,
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
            ],
          });
        }

        // Add subtotal row for CI
        result.push({
          rowStyle: { backgroundColor: colors.lgrayBg },
          cells: [
            {
              text: `Tổng theo CI: ${ci}`,
              colSpan: 8,
              style: { textAlign: "right", fontWeight: "bold" },
            },
            "",
            "",
            "",
            "",
            "",
            "",
            "", // Placeholders for colSpan
            {
              text: totalCi.toLocaleString("en-US"),
              style: { textAlign: "right", fontWeight: "bold" },
            },
            "",
          ],
        });
      }

      // Add grand total row
      if (dataItems.length > 0) {
        result.push({
          rowStyle: { backgroundColor: colors.disabledBg },
          cells: [
            {
              text: "Tổng cộng",
              colSpan: 8,
              style: { textAlign: "right", fontWeight: "bold" },
            },
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            {
              text: totalAll.toLocaleString("en-US"),
              style: { textAlign: "right", fontWeight: "bold" },
            },
            "",
          ],
        });
      }

      return result;
    }, [data.lstBudgetReceiptItem, colors]);

    const handleRowDoublePress = useCallback(
      (index: number) => {
        const items = data.lstBudgetReceiptItem || [];
        const item = items[index];
        if (item) {
          onShowDetail?.(item);
        }
      },
      [data.lstBudgetReceiptItem, onShowDetail],
    );

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={globalStyle.scrollContainerDetail}
      >
        <Table
          horizontalScroll
          containerStyle={{ marginHorizontal: 0 }}
          columns={[
            "Số phiếu",
            "Kỳ",
            "Người tạo",
            "Ngày tạo",
            "Fund",
            "CI",
            "FP",
            "FC",
            "Số tiền",
            "Trạng thái",
          ]}
          columnWidths={[250, 80, 150, 100, 120, 120, 120, 120, 120, 120]}
          rows={tableContent}
          onRowDoublePress={handleRowDoublePress}
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
    alignSelf: "center",
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
  },
});
