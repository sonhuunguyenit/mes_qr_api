import moment from "moment";
import React, { useCallback, useMemo } from "react";
import { ScrollView, View } from "react-native";
import { Column, Row, Spacer, Text } from "~/common";
import Table, { ColumnTable } from "~/common/Table";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useSheet } from "~/contexts/SheetContext";
import { useTheme } from "~/hooks/useTheme";
import {
  MaterialCoProductChildItem,
  MaterialItemData,
} from "~/services/material/material.type";
import globalStyle from "~/styles/global-style";
import { MaterialStructureDetailSheet } from "../sheets/MaterialStructureDetailSheet";

interface MaterialApprovalDetailStructureTabProps {
  data: MaterialItemData;
}

const STRUCTURE_WIDTHS = [50, 150, 150, 120, 150, 180];

const STRUCTURE_ALIGNS: ("left" | "center" | "right")[] = [
  "center", // STT
  "center", // Mã Cấu trúc
  "center", // Mã Co-product sku
  "center", // Valid to
  "right", // Equivalence Numbers
  "left", // Apportionment Struct
];

export const MaterialApprovalDetailStructureTab = React.memo(
  ({ data }: MaterialApprovalDetailStructureTabProps) => {
    const { colors } = useTheme();
    const { openSheet } = useSheet();

    const handleRowDoublePress = useCallback(
      (index: number) => {
        const items = data?.lstMaterialCoProductChild || [];
        const item = items[index];
        if (item) {
          openSheet(<MaterialStructureDetailSheet item={item} index={index} />);
        }
      },
      [data?.lstMaterialCoProductChild, openSheet],
    );

    const structureTableContent = useMemo(() => {
      const items = data?.lstMaterialCoProductChild || [];
      return items.map((item: MaterialCoProductChildItem, idx: number) => ({
        cells: [
          (idx + 1).toString(),
          item.structureCode || "---",
          item.materialCode2 || "---",
          item.validTo ? moment(item.validTo).format("DD/MM/YYYY") : "---",
          item.equivalenceNumbers != null
            ? Number(item.equivalenceNumbers).toLocaleString("en-US")
            : "---",
          item.apportionmentStruct || "---",
        ] as ColumnTable[],
      }));
    }, [data?.lstMaterialCoProductChild]);

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

        {/* DANH SÁCH CẤU TRÚC */}
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
              Danh sách Cấu trúc
            </Text>
            <Table
              horizontalScroll
              columns={[
                "STT",
                "Mã Cấu trúc",
                "Mã Co-product sku",
                "Valid to",
                "Equivalence Numbers",
                "Apportionment Struct",
              ]}
              columnWidths={STRUCTURE_WIDTHS}
              columnTextAlignments={STRUCTURE_ALIGNS}
              rows={structureTableContent}
              onRowDoublePress={handleRowDoublePress}
              pagination={{ enabled: false }}
            />
          </Column>
        </View>
      </ScrollView>
    );
  },
);

export default MaterialApprovalDetailStructureTab;
