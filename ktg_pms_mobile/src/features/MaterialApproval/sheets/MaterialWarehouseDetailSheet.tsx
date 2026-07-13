import React from "react";
import { View } from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Column, Row } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";
import { MaterialWarehouseItem } from "~/services/material/material.type";

interface MaterialWarehouseDetailSheetProps {
  item: MaterialWarehouseItem;
  index: number;
}

export const MaterialWarehouseDetailSheet = ({ item, index }: MaterialWarehouseDetailSheetProps) => {
  const { spacing } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="detail" />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <Row>
            <ColumnInfo label="STT" value={(index + 1).toString()} />
            <ColumnInfo label="Warehouse Number" value={item.warehouseCode || "---"} />
          </Row>

          <Row>
            <ColumnInfo label="Stock removal" value={item.stockRemovalCode || "---"} />
            <ColumnInfo label="Stock placement" value={item.stockPlacementCode || "---"} />
          </Row>

          <Row>
            <ColumnInfo label="Storage Section Ind." value={item.storageSectionCode || "---"} />
            <ColumnInfo
              label="2-step picking"
              value={item.stepPicking === "2" ? "2-step - Qua quy trình 2 bước" : "Không áp dụng"}
            />
          </Row>

          <Row>
            <ColumnInfo label="Bulk storage" value={item.bulkStorageCode || "---"} />
            <ColumnInfo label="Allow addn to stock" value={item.allowAddnToStock ? "Có" : "Không"} />
          </Row>

          <Row>
            <ColumnInfo label="Loading equip. qty 1" value={item.leQuantity1 != null ? item.leQuantity1.toString() : "---"} />
            <ColumnInfo label="Unit of measure 1" value={item.unitCode1 || "---"} />
          </Row>

          <Row>
            <ColumnInfo label="Storage unit type 1" value={item.sutCode1 || "---"} />
            <ColumnInfo label="Loading equip. qty 2" value={item.leQuantity2 != null ? item.leQuantity2.toString() : "---"} />
          </Row>

          <Row>
            <ColumnInfo label="Unit of measure 2" value={item.unitCode2 || "---"} />
            <ColumnInfo label="Storage unit type 2" value={item.sutCode2 || "---"} />
          </Row>

          <Row>
            <ColumnInfo label="Loading equip. qty 3" value={item.leQuantity3 != null ? item.leQuantity3.toString() : "---"} />
            <ColumnInfo label="Unit of measure 3" value={item.unitCode3 || "---"} />
          </Row>

          <Row>
            <ColumnInfo label="Storage unit type 3" value={item.sutCode3 || "---"} />
            <ColumnInfo label="Del.flag:warehse no." value={item.delWarehouse ? "Có" : "Không"} last />
          </Row>

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};

export default MaterialWarehouseDetailSheet;
