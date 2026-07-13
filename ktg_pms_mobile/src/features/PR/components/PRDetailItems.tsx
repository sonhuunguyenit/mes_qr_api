import moment from "moment";
import React, { useCallback, useMemo } from "react";
import { Collapse } from "~/common";
import Table, { ColumnTable, RowTable } from "~/common/Table";
import { PRItemData } from "~/services/pr/pr.type";
import { useTheme } from "~/hooks/useTheme";
import globalStyle from "~/styles/global-style";

interface PRDetailItemsProps {
  data: PRItemData;
  onShowDetail?: (item: any) => void;
}

const WIDTHS = [
  100, 180, 300, 60, 60, 60, 150, 150, 100, 150, 170, 150, 250, 250, 150, 150,
  150, 100, 150, 200, 200, 150, 100, 100, 100, 120, 100, 150, 150, 150, 150,
  150, 150, 150,
];

const ALIGNS: ("left" | "center" | "right")[] = [
  "left", // 0 Item line
  "left", // 1 Material
  "left", // 2 Short text
  "center", // 3 Close
  "center", // 4 Delete
  "left", // 5 Acc
  "left", // 6 Category
  "right", // 7 Số lượng
  "left", // 8 Unit
  "right", // 9 Valuation Price
  "right", // 10 Ngân sách Item
  "right", // 11 Ngân sách
  "left", // 12 Material Group
  "left", // 13 External Mat Group
  "left", // 14 Cost Center
  "left", // 15 Asset
  "left", // 16 Order
  "left", // 17 Uom
  "center", // 18 Delivery Date
  "left", // 19 Nhóm mua hàng
  "left", // 20 Nhóm tổ chức mua hàng
  "left", // 21 GL Account
  "left", // 22 Fund
  "left", // 23 FC
  "left", // 24 FP
  "left", // 25 CI
  "left", // 26 AUFC
  "center", // 27 File đính kèm
  "left", // 28 Requisitioner
  "left", // 29 Mrp Areas
  "left", // 30 Omrp
  "left", // 31 Fix Vendor
  "left", // 32 Tracking Number
  "left", // 33 Sloc
];

export const PRDetailItems = React.memo(
  ({ data, onShowDetail }: PRDetailItemsProps) => {
    const { colors } = useTheme();
    const formatNum = (val: any) =>
      val ? Number(val).toLocaleString("en-US") : "0";

    const tableContent = useMemo(() => {
      const items = data.lstDetail || [];
      const content: RowTable[] = items.map((item, idx) => ({
        cells: [
          item.itemNo || "",
          item.materialCode || "---",
          item.shortText || "",
          item.itemClosed || "",
          item.itemDeleted || "",
          item.acccate || "",
          item.category || "",
          formatNum(item.quantity),
          item.unitName || "",
          formatNum(item.valuationPrice),
          formatNum(item.total),
          formatNum(item.budget),
          item.materialGroupCode
            ? `${item.materialGroupCode} - ${item.materialGroupName || ""}`
            : "",
          item.externalMaterialGroupCode
            ? `${item.externalMaterialGroupCode} - ${
                item.externalMaterialGroupName || ""
              }`
            : "",
          item.costCenterCode || "",
          item.assetCode ? `${item.assetCode} - ${item.assetDesc || ""}` : "",
          item.orderCode ? `${item.orderCode} - ${item.ioName || ""}` : "",
          item.ounName || "",
          item.deliveryDate
            ? moment(item.deliveryDate).format("DD/MM/YYYY")
            : "",
          item.purchasingGroupCode
            ? `${item.purchasingGroupCode} - ${item.purchasingGroupName || ""}`
            : "",
          item.purchasingOrgCode
            ? `${item.purchasingOrgCode} - ${item.purchasingOrgName || ""}`
            : "",
          item.glAccountCode
            ? `${item.glAccountCode} - ${item.glAccountName || ""}`
            : "",
          item.fund || "",
          item.fc || "",
          item.fp || "",
          item.ci || "",
          item.aufc || "",
          item.fileList && item.fileList.length > 0
            ? `${item.fileList.length} file`
            : "---",
          item.requisitioner || "",
          item.mrp_areas || "",
          item.omrp || "",
          item.fix_vendor || "",
          item.trackingNumber || "",
          item.sloc || "",
        ] as ColumnTable[],
      }));

      // Add summary row summing current items
      if (items.length > 0) {
        const sumQty = items.reduce((s, i) => s + (Number(i.quantity) || 0), 0);
        const sumBudget = items.reduce(
          (s, i) => s + (Number(i.budget) || 0),
          0,
        );

        content.push({
          rowStyle: { backgroundColor: colors.lgrayBg },
          cells: [
            "", // 0 Item line
            "", // 1 Material
            "", // 2 Short text
            "", // 3 Close
            "", // 4 Delete
            "", // 5 Acc
            "", // 6 Category
            {
              text: formatNum(sumQty),
              style: { fontWeight: "bold" },
            }, // 7 Số lượng
            "", // 8 Unit
            "", // 9 Valuation Price
            "", // 10 Ngân sách Item
            {
              text: formatNum(sumBudget),
              style: { fontWeight: "bold" },
            }, // 11 Ngân sách
            "", // 12 Material Group
            "", // 13 External Mat Group
            "", // 14 Cost Center
            "", // 15 Asset
            "", // 16 Order
            "", // 17 Uom
            "", // 18 Delivery Date
            "", // 19 Nhóm mua hàng
            "", // 20 Nhóm tổ chức mua hàng
            "", // 21 GL Account
            "", // 22 Fund
            "", // 23 FC
            "", // 24 FP
            "", // 25 CI
            "", // 26 AUFC
            "", // 27 File đính kèm
            "", // 28 Requisitioner
            "", // 29 Mrp Areas
            "", // 30 Omrp
            "", // 31 Fix Vendor
            "", // 32 Tracking Number
            "", // 33 Sloc
          ] as ColumnTable[],
        });
      }

      return content;
    }, [data.lstDetail, colors]);

    const handleRowDoublePress = useCallback(
      (index: number) => {
        const items = data.lstDetail || [];
        const item = items[index];
        if (item) {
          onShowDetail?.(item);
        }
      },
      [data.lstDetail, onShowDetail],
    );

    return (
      <Collapse
        title="II. Danh sách item"
        collapsible
        containerStyle={globalStyle.collapseContainer}
      >
        <Table
          horizontalScroll
          columns={[
            "Item line",
            "Material",
            "Short text",
            "Close",
            "Delete",
            "Acc",
            "Category",
            "Số lượng",
            "Unit",
            "Valuation Price",
            "Ngân sách Item",
            "Ngân sách",
            "Material Group",
            "External Mat Group",
            "Cost Center",
            "Asset",
            "Order",
            "Uom",
            "Delivery Date",
            "Nhóm mua hàng",
            "Nhóm tổ chức mua hàng",
            "GL Account",
            "Fund",
            "FC",
            "FP",
            "CI",
            "AUFC",
            "File đính kèm",
            "Requisitioner",
            "Mrp Areas",
            "Omrp",
            "Fix Vendor",
            "Tracking Number",
            "Sloc",
          ]}
          columnWidths={WIDTHS}
          columnTextAlignments={ALIGNS}
          rows={tableContent}
          onRowDoublePress={handleRowDoublePress}
          pagination={{ enabled: false }}
        />
      </Collapse>
    );
  },
);
