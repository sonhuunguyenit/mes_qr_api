import React, { useMemo } from "react";
import { View } from "react-native";
import { Collapse, Table } from "~/common";
import globalStyle from "~/styles/global-style";
import { useSheet } from "~/contexts/SheetContext";
import { BidPriceDetailSheet } from "../sheets/BidPriceDetailSheet";

interface BidDetailPriceTableProps {
  data: any;
}

const formatNumber = (val: any) => {
  if (val === undefined || val === null || val === "") return "---";
  const num = Number(val);
  return isNaN(num) ? val : num.toLocaleString("en-US");
};

export const BidDetailPriceTable = React.memo(
  ({ data }: BidDetailPriceTableProps) => {
    const { openSheet, closeSheet } = useSheet();

    const priceRows = useMemo(() => {
      return (data?.listPrice || []).map((item: any) => {
        return {
          cells: [
            item.sort || "",
            item.name || "",
            ...(data?.listPriceCol || []).map((c: any) =>
              formatNumber(item[c.id] || ""),
            ),
            item.unit || "",
            item.currency || "",
            formatNumber(item.number),
            item.isRequired ? "Bắt buộc" : "Không",
          ],
        };
      });
    }, [data]);

    const handleRowDoublePress = (index: number) => {
      const item = data?.listPrice?.[index];
      if (item) {
        openSheet(
          <BidPriceDetailSheet
            item={item}
            columns={data?.listPriceCol || []}
          />,
        );
      }
    };

    if (data?.reference !== "NO_ITEM") return null;

    const dynamicCols = (data?.listPriceCol || []).map((c: any) => c.name);

    return (
      <Collapse
        title="VI. Bảng chào giá"
        collapsible
        containerStyle={globalStyle.collapseContainer}
      >
        <View style={{ width: "100%" }}>
          <Table
            columns={[
              "STT",
              "Tên hạng mục",
              ...dynamicCols,
              "Đơn vị tính",
              "Đơn vị tiền tệ",
              "Số lượng",
              "Bắt buộc?",
            ]}
            columnWidths={[
              50,
              200,
              ...Array(dynamicCols.length).fill(150),
              120,
              120,
              100,
              100,
            ]}
            horizontalScroll
            rows={priceRows as any}
            onRowDoublePress={handleRowDoublePress}
          />
        </View>
      </Collapse>
    );
  },
);
