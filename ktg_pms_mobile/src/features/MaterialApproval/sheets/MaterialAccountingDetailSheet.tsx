import React from "react";
import { View } from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Column, Row } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";
import { MaterialAccountingItem } from "~/services/material/material.type";

interface MaterialAccountingDetailSheetProps {
  item: MaterialAccountingItem;
  index: number;
}

export const MaterialAccountingDetailSheet = ({ item, index }: MaterialAccountingDetailSheetProps) => {
  const { spacing } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="detail" />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <Row>
            <ColumnInfo label="STT" value={(index + 1).toString()} />
            <ColumnInfo label="Valuation area" value={item.valuationArea || "---"} />
          </Row>

          <Row>
            <ColumnInfo label="Valuation Category" value={item.valuationCategoryCode || "---"} />
            <ColumnInfo label="Valuation Type" value={item.valuationTypeCode || "---"} />
          </Row>

          <Row>
            <ColumnInfo label="Valuation Class" value={item.valuationClassCode || "---"} />
            <ColumnInfo label="Price Control" value={item.priceControlIndicator || "---"} />
          </Row>

          <Row>
            <ColumnInfo label="Material Price Determination: Control" value={item.priceDetermination || "---"} />
            <ColumnInfo label="Price Unit" value={item.priceUnit != null ? item.priceUnit.toString() : "---"} />
          </Row>

          <Row>
            <ColumnInfo
              label="Del. flag val. type"
              value={item.delType ? "Có" : "Không"}
              last
            />
          </Row>

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};

export default MaterialAccountingDetailSheet;
