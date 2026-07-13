import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { View } from "react-native";
import { Column, Row } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";
import { ContractLot } from "~/services/contract/contract.type";
import DateHelper from "~/utils/date";
import NumberHelper from "~/utils/number";

interface ContractLotDetailSheetProps {
  rowIndex: number;
  lstLot: ContractLot[];
}

export const ContractLotDetailSheet = ({
  rowIndex,
  lstLot,
}: ContractLotDetailSheetProps) => {
  const { spacing } = useTheme();

  const formatNum = (val: any) => {
    if (val === undefined || val === null || val === "") return "---";
    const num = Number(val);
    return isNaN(num) ? val.toString() : NumberHelper.formatMoney(num);
  };

  if (!lstLot || lstLot.length === 0) return null;

  const firstLot = lstLot[0];
  const item = firstLot.lstLotItem?.[rowIndex];
  if (!item) return null;

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="detail" />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <Row>
            <ColumnInfo label="Item line" value={item.itemNo || "---"} />
            <ColumnInfo label="Tổng số lượng" value={formatNum(item.quantityTotal)} />
          </Row>

          <ColumnInfo label="Short text" value={item.shortText || "---"} full />

          {lstLot.map((lot, idx) => {
            const matchingItem = lot.lstLotItem?.[rowIndex];
            const formattedDate = lot.lotDate
              ? ` (${DateHelper.formatDate(lot.lotDate, "DD/MM/YYYY")})`
              : "";
            const label = lot.title || `Lot ${idx + 1}${formattedDate}`;
            return (
              <ColumnInfo
                key={lot.id || idx}
                label={label}
                value={matchingItem ? formatNum(matchingItem.quantity) : "0"}
                full
                last={idx === lstLot.length - 1}
              />
            );
          })}

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};
