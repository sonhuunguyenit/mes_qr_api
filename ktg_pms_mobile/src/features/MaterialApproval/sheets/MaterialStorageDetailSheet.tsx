import React from "react";
import { View } from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Column, Row } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";
import { MaterialStorageLocationItem } from "~/services/material/material.type";

interface MaterialStorageDetailSheetProps {
  item: MaterialStorageLocationItem;
  index: number;
}

export const MaterialStorageDetailSheet = ({ item, index }: MaterialStorageDetailSheetProps) => {
  const { spacing } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="detail" />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <Row>
            <ColumnInfo label="STT" value={(index + 1).toString()} />
            <ColumnInfo label="Storage Location" value={item.storageLocationCode || "---"} />
          </Row>

          <Row>
            <ColumnInfo
              label="DF stor. loc. level"
              value={item.dfStorLocLevel ? "Có" : "Không"}
              last
            />
          </Row>

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};

export default MaterialStorageDetailSheet;
