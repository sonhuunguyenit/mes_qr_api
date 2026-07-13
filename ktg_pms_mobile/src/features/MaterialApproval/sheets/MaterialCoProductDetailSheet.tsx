import React from "react";
import { View } from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Column, Row } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";
import { MaterialCoProductItem } from "~/services/material/material.type";

interface MaterialCoProductDetailSheetProps {
  item: MaterialCoProductItem;
  index: number;
}

export const MaterialCoProductDetailSheet = ({ item, index }: MaterialCoProductDetailSheetProps) => {
  const { spacing } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="detail" />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <Row>
            <ColumnInfo label="STT" value={item.stt != null ? item.stt.toString() : (index + 1).toString()} />
            <ColumnInfo label="Structure (Diễn giải)" value={item.structureText || "---"} />
          </Row>

          <Row>
            <ColumnInfo label="Mã Cấu trúc" value={item.structureCode || "---"} last />
          </Row>

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};

export default MaterialCoProductDetailSheet;
