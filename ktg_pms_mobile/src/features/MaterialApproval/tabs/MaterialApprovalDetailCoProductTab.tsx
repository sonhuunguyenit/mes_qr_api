import React, { useMemo, useCallback } from "react";
import { ScrollView, View } from "react-native";
import { Column, Row, Spacer, Text } from "~/common";
import Table, { ColumnTable } from "~/common/Table";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";
import { useSheet } from "~/contexts/SheetContext";
import {
  MaterialItemData,
  MaterialCoProductItem,
} from "~/services/material/material.type";
import { MaterialCoProductDetailSheet } from "../sheets/MaterialCoProductDetailSheet";
import globalStyle from "~/styles/global-style";

interface MaterialApprovalDetailCoProductTabProps {
  data: MaterialItemData;
}

const CO_PRODUCT_WIDTHS = [50, 200, 150];

const CO_PRODUCT_ALIGNS: ("left" | "center" | "right")[] = [
  "center", // STT
  "left", // Structure (Diễn giải)
  "center", // Mã Cấu trúc
];

export const MaterialApprovalDetailCoProductTab = React.memo(
  ({ data }: MaterialApprovalDetailCoProductTabProps) => {
    const { colors } = useTheme();
    const { openSheet } = useSheet();

    const handleRowDoublePress = useCallback(
      (index: number) => {
        const items = data?.lstMaterialCoProduct || [];
        const item = items[index];
        if (item) {
          openSheet(<MaterialCoProductDetailSheet item={item} index={index} />);
        }
      },
      [data?.lstMaterialCoProduct, openSheet],
    );

    const coProductTableContent = useMemo(() => {
      const items = data?.lstMaterialCoProduct || [];
      return items.map((item: MaterialCoProductItem, idx: number) => ({
        cells: [
          item.stt != null ? item.stt.toString() : (idx + 1).toString(),
          item.structureText || "---",
          item.structureCode || "---",
        ] as ColumnTable[],
      }));
    }, [data?.lstMaterialCoProduct]);

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
            <Row full gap={16}>
              <ColumnInfo label="Mã vật tư" value={data?.code} />
              <ColumnInfo label="Plant" value={data?.plantCode} />
            </Row>
          </Column>
        </View>

        <Spacer size={10} />

        {/* DANH SÁCH THÔNG TIN CO-PRODUCTION */}
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
              Danh sách thông tin Co-Production
            </Text>
            <Table
              horizontalScroll
              columns={["STT", "Structure (Diễn giải)", "Mã Cấu trúc"]}
              columnWidths={CO_PRODUCT_WIDTHS}
              columnTextAlignments={CO_PRODUCT_ALIGNS}
              rows={coProductTableContent}
              onRowDoublePress={handleRowDoublePress}
              pagination={{ enabled: false }}
            />
          </Column>
        </View>
      </ScrollView>
    );
  },
);

export default MaterialApprovalDetailCoProductTab;
