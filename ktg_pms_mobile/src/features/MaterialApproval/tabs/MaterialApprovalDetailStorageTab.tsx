import React, { useCallback, useMemo } from "react";
import { ScrollView, View } from "react-native";
import { Column, Row, Spacer, Text } from "~/common";
import Table, { ColumnTable } from "~/common/Table";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useSheet } from "~/contexts/SheetContext";
import { useTheme } from "~/hooks/useTheme";
import {
  MaterialItemData,
  MaterialStorageLocationItem,
} from "~/services/material/material.type";
import globalStyle from "~/styles/global-style";
import { MaterialStorageDetailSheet } from "../sheets/MaterialStorageDetailSheet";

interface MaterialApprovalDetailStorageTabProps {
  data: MaterialItemData;
}

const STORAGE_WIDTHS = [50, 200, 150];

const STORAGE_ALIGNS: ("left" | "center" | "right")[] = [
  "center", // STT
  "left", // Storage Location
  "center", // DF stor. loc. level
];

export const MaterialApprovalDetailStorageTab = React.memo(
  ({ data }: MaterialApprovalDetailStorageTabProps) => {
    const { colors } = useTheme();
    const { openSheet } = useSheet();

    const handleRowDoublePress = useCallback(
      (index: number) => {
        const items = data?.lstStorageLocation || [];
        const item = items[index];
        if (item) {
          openSheet(<MaterialStorageDetailSheet item={item} index={index} />);
        }
      },
      [data?.lstStorageLocation, openSheet],
    );

    const storageTableContent = useMemo(() => {
      const items = data?.lstStorageLocation || [];
      return items.map((item: MaterialStorageLocationItem, idx: number) => ({
        cells: [
          (idx + 1).toString(),
          item.storageLocationCode || "---",
          item.dfStorLocLevel ? "Có" : "Không",
        ] as ColumnTable[],
      }));
    }, [data?.lstStorageLocation]);

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

        {/* DANH SÁCH THÔNG TIN LƯU TRỮ (STORAGE) */}
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
              Danh sách thông tin lưu trữ (Storage)
            </Text>
            <Table
              horizontalScroll
              columns={["STT", "Storage Location", "DF stor. loc. level"]}
              columnWidths={STORAGE_WIDTHS}
              columnTextAlignments={STORAGE_ALIGNS}
              rows={storageTableContent}
              onRowDoublePress={handleRowDoublePress}
              pagination={{ enabled: false }}
            />
          </Column>
        </View>
      </ScrollView>
    );
  },
);

export default MaterialApprovalDetailStorageTab;
