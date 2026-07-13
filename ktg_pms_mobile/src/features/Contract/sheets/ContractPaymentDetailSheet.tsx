import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { View } from "react-native";
import { Column, Row } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";
import { ContractPaymentProgress } from "~/services/contract/contract.type";
import DateHelper from "~/utils/date";
import NumberHelper from "~/utils/number";

interface ContractPaymentDetailSheetProps {
  item: ContractPaymentProgress;
}

export const ContractPaymentDetailSheet = ({
  item,
}: ContractPaymentDetailSheetProps) => {
  const { spacing } = useTheme();

  const formatNum = (val: any) => {
    if (val === undefined || val === null || val === "") return "---";
    const num = Number(val);
    return isNaN(num) ? val.toString() : NumberHelper.formatMoney(num);
  };

  const formatDate = (val: any) => {
    if (!val) return "---";
    return DateHelper.formatDate(val, "DD/MM/YYYY");
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="detail" />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <ColumnInfo label="Tên tiến độ" value={item.name || "---"} full />

          <Row>
            <ColumnInfo
              label="Tiến độ thực hiện (%)"
              value={
                item.percent !== undefined && item.percent !== null
                  ? `${item.percent}%`
                  : "---"
              }
            />
            <ColumnInfo
              label="Phương thức thanh toán"
              value={item.paymentMethodName || "---"}
            />
          </Row>

          <Row>
            <ColumnInfo label="Số tiền" value={formatNum(item.money)} />
            <ColumnInfo
              label="Thời gian thanh toán"
              value={formatDate(item.time)}
            />
          </Row>

          <ColumnInfo
            label="Ghi chú"
            value={item.description || "---"}
            full
            last
          />

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};
