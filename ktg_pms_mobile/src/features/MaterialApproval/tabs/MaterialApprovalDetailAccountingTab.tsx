import React, { useCallback, useMemo } from "react";
import { ScrollView, View } from "react-native";
import { Column, Spacer, Text } from "~/common";
import Table, { ColumnTable } from "~/common/Table";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useSheet } from "~/contexts/SheetContext";
import { useTheme } from "~/hooks/useTheme";
import {
  MaterialAccountingItem,
  MaterialItemData,
} from "~/services/material/material.type";
import globalStyle from "~/styles/global-style";
import { MaterialAccountingDetailSheet } from "../sheets/MaterialAccountingDetailSheet";

interface MaterialApprovalDetailAccountingTabProps {
  data: MaterialItemData;
}

const ACCOUNTING_WIDTHS = [50, 120, 150, 120, 120, 100, 250, 100, 150];

const ACCOUNTING_ALIGNS: ("left" | "center" | "right")[] = [
  "center", // STT
  "center", // Valuation area
  "center", // Valuation Category
  "center", // Valuation Type
  "center", // Valuation Class
  "center", // Price Control
  "center", // Material Price Determination: Control
  "right", // Price Unit
  "center", // Del. flag val. type
];

export const MaterialApprovalDetailAccountingTab = React.memo(
  ({ data }: MaterialApprovalDetailAccountingTabProps) => {
    const { colors } = useTheme();
    const { openSheet } = useSheet();

    const handleRowDoublePress = useCallback(
      (index: number) => {
        const items = data?.lstMaterialAccouting || [];
        const item = items[index];
        if (item) {
          openSheet(
            <MaterialAccountingDetailSheet item={item} index={index} />,
          );
        }
      },
      [data?.lstMaterialAccouting, openSheet],
    );

    const accountingTableContent = useMemo(() => {
      const items = data?.lstMaterialAccouting || [];
      return items.map((item: MaterialAccountingItem, idx: number) => ({
        cells: [
          (idx + 1).toString(),
          item.valuationArea || "---",
          item.valuationCategoryCode || "---",
          item.valuationTypeCode || "---",
          item.valuationClassCode || "---",
          item.priceControlIndicator || "---",
          item.priceDetermination || "---",
          item.priceUnit != null
            ? Number(item.priceUnit).toLocaleString("en-US")
            : "---",
          item.delType ? "Có" : "Không",
        ] as ColumnTable[],
      }));
    }, [data?.lstMaterialAccouting]);

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

        {/* DANH SÁCH THÔNG TIN KẾ TOÁN */}
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
              Danh sách thông tin kế toán
            </Text>
            <Table
              horizontalScroll
              columns={[
                "STT",
                "Valuation area",
                "Valuation Category",
                "Valuation Type",
                "Valuation Class",
                "Price Control",
                "Material Price Determination: Control",
                "Price Unit",
                "Del. flag val. type",
              ]}
              columnWidths={ACCOUNTING_WIDTHS}
              columnTextAlignments={ACCOUNTING_ALIGNS}
              rows={accountingTableContent}
              onRowDoublePress={handleRowDoublePress}
              pagination={{ enabled: false }}
            />
          </Column>
        </View>
      </ScrollView>
    );
  },
);

export default MaterialApprovalDetailAccountingTab;
