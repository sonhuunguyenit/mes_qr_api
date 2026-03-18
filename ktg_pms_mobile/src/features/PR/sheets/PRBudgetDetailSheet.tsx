import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Column, Row, Text } from "~/common";
import { StatusBadge } from "~/components";
import { BUDGET_STATUS, BUDGET_STATUS_CONFIG } from "~/enums/pr.enum";
import { useTheme } from "~/hooks/useTheme";
import { PRBudgetReceiptItem } from "~/services/pr/pr.type";
import { PRFieldItem } from "../components/PRFieldItem";

interface PRBudgetDetailSheetProps {
  item: PRBudgetReceiptItem;
}

export const PRBudgetDetailSheet = ({ item }: PRBudgetDetailSheetProps) => {
  const { spacing, colors } = useTheme();

  const statusConfig = BUDGET_STATUS_CONFIG[item.status as BUDGET_STATUS];

  const formatNum = (val: any) =>
    val ? Number(val).toLocaleString("en-US") : "0";

  return (
    <BottomSheetScrollView style={{ padding: spacing.md }}>
      <Text size={18} bold style={{ marginBottom: 20 }}>
        Chi tiết điều chỉnh ngân sách
      </Text>

      <Column gap={12} align="stretch" style={styles.contentContainer}>
        <PRFieldItem
          label="Số phiếu"
          value={item.budgetReceiptCode || "---"}
          fullWidth
        />

        <Row full gap={16}>
          <PRFieldItem label="Kỳ" value={item.budgetPeriod || "---"} />
          <PRFieldItem label="Số tiền" value={formatNum(item.moneyPropose)} />
        </Row>

        <PRFieldItem
          label="Trạng thái"
          value={
            <StatusBadge
              value={
                item.statusName || statusConfig?.label || item.status || "---"
              }
              color={item.statusColor || statusConfig?.color || colors.text}
              bgColor={item.statusBgColor || statusConfig?.bgColor || "#f0f0f0"}
            />
          }
          fullWidth
        />

        <View style={{ height: 40 }} />
      </Column>
    </BottomSheetScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 20,
  },
});
