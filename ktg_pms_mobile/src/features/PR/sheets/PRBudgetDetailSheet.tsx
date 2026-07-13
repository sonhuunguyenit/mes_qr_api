import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { View } from "react-native";
import { Column, Row } from "~/common";
import { HeaderSheet, StatusBadge } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { BUDGET_STATUS, BUDGET_STATUS_CONFIG } from "~/enums/pr.enum";
import { useTheme } from "~/hooks/useTheme";
import { PRBudgetReceiptItem } from "~/services/pr/pr.type";
import DateHelper from "~/utils/date";

interface PRBudgetDetailSheetProps {
  item: PRBudgetReceiptItem;
}

export const PRBudgetDetailSheet = ({ item }: PRBudgetDetailSheetProps) => {
  const { spacing, colors } = useTheme();

  const statusConfig = BUDGET_STATUS_CONFIG[item.status as BUDGET_STATUS];

  const formatNum = (val: any) =>
    val ? Number(val).toLocaleString("en-US") : "0";

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="detail" />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <ColumnInfo
            label="Số phiếu"
            value={item.budgetReceiptCode || "---"}
            full
          />

          <Row>
            <ColumnInfo label="Kỳ" value={item.budgetPeriod || "---"} />
            <ColumnInfo label="Số tiền" value={formatNum(item.moneyPropose)} />
          </Row>

          <Row>
            <ColumnInfo label="Người tạo" value={item.employeeName || "---"} />
            <ColumnInfo
              label="Ngày tạo"
              value={
                item.createdAt ? DateHelper.formatDate(item.createdAt) : "---"
              }
            />
          </Row>

          <Row>
            <ColumnInfo label="Fund" value={item.fund || "---"} />
            <ColumnInfo label="CI" value={item.ci || "---"} />
          </Row>

          <Row>
            <ColumnInfo label="FP" value={item.fp || "---"} />
            <ColumnInfo label="FC" value={item.fc || "---"} />
          </Row>

          <ColumnInfo
            label="Trạng thái"
            value={
              <StatusBadge
                value={
                  item.statusName || statusConfig?.label || item.status || "---"
                }
                color={
                  (item.statusColor ||
                    statusConfig?.color ||
                    colors.text) as string
                }
                bgColor={
                  (item.statusBgColor ||
                    statusConfig?.bgColor ||
                    colors.neutral150) as string
                }
              />
            }
            full
            last
          />

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};
