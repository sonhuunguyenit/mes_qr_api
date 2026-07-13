import React from "react";
import { View } from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import moment from "moment";
import { Column, Row } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";
import { MaterialCoProductChildItem } from "~/services/material/material.type";

interface MaterialStructureDetailSheetProps {
  item: MaterialCoProductChildItem;
  index: number;
}

export const MaterialStructureDetailSheet = ({ item, index }: MaterialStructureDetailSheetProps) => {
  const { spacing } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="detail" />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <Row>
            <ColumnInfo label="STT" value={(index + 1).toString()} />
            <ColumnInfo label="Mã Cấu trúc" value={item.structureCode || "---"} />
          </Row>

          <Row>
            <ColumnInfo label="Mã Co-product sku" value={item.materialCode2 || "---"} />
            <ColumnInfo
              label="Valid to"
              value={item.validTo ? moment(item.validTo).format("DD/MM/YYYY") : "---"}
            />
          </Row>

          <Row>
            <ColumnInfo label="Equivalence Numbers" value={item.equivalenceNumbers != null ? item.equivalenceNumbers.toString() : "---"} />
            <ColumnInfo label="Apportionment Struct" value={item.apportionmentStruct || "---"} last />
          </Row>

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};

export default MaterialStructureDetailSheet;
