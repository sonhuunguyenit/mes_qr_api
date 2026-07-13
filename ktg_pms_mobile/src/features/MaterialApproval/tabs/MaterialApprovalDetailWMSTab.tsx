import React, { useCallback, useMemo } from "react";
import { ScrollView, View } from "react-native";
import { Column, Spacer, Text } from "~/common";
import Table, { ColumnTable } from "~/common/Table";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useSheet } from "~/contexts/SheetContext";
import { useTheme } from "~/hooks/useTheme";
import {
  MaterialItemData,
  MaterialWarehouseItem,
} from "~/services/material/material.type";
import globalStyle from "~/styles/global-style";
import { MaterialWarehouseDetailSheet } from "../sheets/MaterialWarehouseDetailSheet";

interface MaterialApprovalDetailWMSTabProps {
  data: MaterialItemData;
}

const WMS_WIDTHS = [
  50, 150, 120, 120, 150, 200, 120, 150, 150, 120, 150, 150, 120, 150, 150, 120,
  150, 180,
];

const WMS_ALIGNS: ("left" | "center" | "right")[] = [
  "center", // STT
  "center", // Warehouse Number
  "center", // Stock removal
  "center", // Stock placement
  "center", // Storage Section Ind.
  "left", // 2-step picking
  "center", // Bulk storage
  "center", // Allow addn to stock
  "right", // Loading equip. qty 1
  "center", // Unit of measure 1
  "center", // Storage unit type 1
  "right", // Loading equip. qty 2
  "center", // Unit of measure 2
  "center", // Storage unit type 2
  "right", // Loading equip. qty 3
  "center", // Unit of measure 3
  "center", // Storage unit type 3
  "center", // Del.flag:warehse no.
];

export const MaterialApprovalDetailWMSTab = React.memo(
  ({ data }: MaterialApprovalDetailWMSTabProps) => {
    const { colors } = useTheme();
    const { openSheet } = useSheet();

    const handleRowDoublePress = useCallback(
      (index: number) => {
        const items = data?.lstMaterialWarehouse || [];
        const item = items[index];
        if (item) {
          openSheet(<MaterialWarehouseDetailSheet item={item} index={index} />);
        }
      },
      [data?.lstMaterialWarehouse, openSheet],
    );

    const wmsTableContent = useMemo(() => {
      const items = data?.lstMaterialWarehouse || [];
      return items.map((item: MaterialWarehouseItem, idx: number) => ({
        cells: [
          (idx + 1).toString(),
          item.warehouseCode || "---",
          item.stockRemovalCode || "---",
          item.stockPlacementCode || "---",
          item.storageSectionCode || "---",
          item.stepPicking === "2"
            ? "2-step - Qua quy trình 2 bước"
            : "Không áp dụng",
          item.bulkStorageCode || "---",
          item.allowAddnToStock ? "Có" : "Không",
          item.leQuantity1 != null
            ? Number(item.leQuantity1).toLocaleString("en-US")
            : "---",
          item.unitCode1 || "---",
          item.sutCode1 || "---",
          item.leQuantity2 != null
            ? Number(item.leQuantity2).toLocaleString("en-US")
            : "---",
          item.unitCode2 || "---",
          item.sutCode2 || "---",
          item.leQuantity3 != null
            ? Number(item.leQuantity3).toLocaleString("en-US")
            : "---",
          item.unitCode3 || "---",
          item.sutCode3 || "---",
          item.delWarehouse ? "Có" : "Không",
        ] as ColumnTable[],
      }));
    }, [data?.lstMaterialWarehouse]);

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={globalStyle.scrollContainerDetail}
      >
        {/* THÔNG TIN CHUNG */}
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 10,
            paddingHorizontal: 10,
            paddingVertical: 12,
          }}
        >
          <Column gap={12} align="stretch">
            <ColumnInfo label="Mã vật tư" value={data?.code} full last />
          </Column>
        </View>

        <Spacer size={10} />

        {/* DANH SÁCH THÔNG TIN NHÀ KHO (WMS) */}
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 10,
            paddingHorizontal: 10,
            paddingVertical: 12,
          }}
        >
          <Column gap={8} align="stretch">
            <Text
              bold
              size={15}
              color={colors.title}
              style={{ marginBottom: 4 }}
            >
              Danh sách thông tin nhà kho (WMS)
            </Text>
            <Table
              horizontalScroll
              columns={[
                "STT",
                "Warehouse Number",
                "Stock removal",
                "Stock placement",
                "Storage Section Ind.",
                "2-step picking",
                "Bulk storage",
                "Allow addn to stock",
                "Loading equip. qty 1",
                "Unit of measure 1",
                "Storage unit type 1",
                "Loading equip. qty 2",
                "Unit of measure 2",
                "Storage unit type 2",
                "Loading equip. qty 3",
                "Unit of measure 3",
                "Storage unit type 3",
                "Del.flag:warehse no.",
              ]}
              columnWidths={WMS_WIDTHS}
              columnTextAlignments={WMS_ALIGNS}
              rows={wmsTableContent}
              onRowDoublePress={handleRowDoublePress}
              pagination={{ enabled: false }}
            />
          </Column>
        </View>
      </ScrollView>
    );
  },
);

export default MaterialApprovalDetailWMSTab;
