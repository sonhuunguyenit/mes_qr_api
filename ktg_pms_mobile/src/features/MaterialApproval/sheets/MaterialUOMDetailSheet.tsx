import React from "react";
import { View } from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Column, Row } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";

import { MaterialUOMItem } from "~/services/material/material.type";

interface MaterialUOMDetailSheetProps {
  item: MaterialUOMItem;
  index: number;
}

export const MaterialUOMDetailSheet = ({ item, index }: MaterialUOMDetailSheetProps) => {
  const { spacing } = useTheme();

  const formatNum = (val: number | string | null | undefined) =>
    val != null ? Number(val).toLocaleString("en-US") : "0";

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="detail" />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <Row>
            <ColumnInfo label="STT" value={(index + 1).toString()} />
            <ColumnInfo label="Đơn vị tính" value={item.oumCode || "---"} />
          </Row>

          <Row>
            <ColumnInfo label="Hệ số X" value={formatNum(item.coefficientX)} />
            <ColumnInfo label="Đơn vị tính thay thế" value={item.uomAlternativeName || "---"} />
          </Row>

          <Row>
            <ColumnInfo label="Hệ số Y" value={formatNum(item.coefficientY)} />
            <ColumnInfo label="Unit of Dimension" value={item.unitOfDimensionCode || "---"} />
          </Row>

          <Row>
            <ColumnInfo label="Dài" value={formatNum(item.lngth)} />
            <ColumnInfo label="Rộng" value={formatNum(item.width)} />
          </Row>

          <Row>
            <ColumnInfo label="Cao" value={formatNum(item.height)} />
            <ColumnInfo label="Thể tích (CBM/SKU)" value={formatNum(item.cmb)} />
          </Row>

          <Row>
            <ColumnInfo label="Area Unit" value={item.unitOfVolumeMaterialUomCode || "---"} />
            <ColumnInfo label="Gross Weight" value={formatNum(item.grossWeight)} />
          </Row>

          <Row>
            <ColumnInfo label="Net Weight" value={formatNum(item.netWeight)} />
            <ColumnInfo label="Weight unit" value={item.unitOfMassMaterialUomCode || "---"} last />
          </Row>

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};

export default MaterialUOMDetailSheet;
