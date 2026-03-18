import moment from "moment";
import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { Collapse } from "~/common";
import Table, { ColumnTable, RowTable } from "~/common/Table";
import { useSheet } from "~/contexts/SheetContext";
import { PRItemData } from "~/services/pr/pr.type";
import PRItemTableFilterSheet, {
  PRItemTableFilters,
} from "../sheets/PRItemTableFilterSheet";

interface PRDetailItemsProps {
  data: PRItemData;
  onShowDetail?: (item: any) => void;
}

const WIDTHS = [
  100, 180, 200, 100, 100, 100, 100, 150, 100, 150, 170, 150, 200, 250, 150,
  150, 150, 100, 150, 200, 200, 150, 100, 100, 100, 120, 100, 150, 150, 150,
  150, 150, 150, 150, 60,
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
  "center", // 34 Tác vụ
];

export const PRDetailItems = React.memo(
  ({ data, onShowDetail }: PRDetailItemsProps) => {
    const { openSheet, closeSheet } = useSheet();
    const [tableFilters, setTableFilters] = useState<PRItemTableFilters>({
      itemNo: "",
      materialCode: "",
      shortText: "",
      acccate: "",
      category: "",
      plantCode: "",
      costCenterCode: "",
      assetCode: "",
      orderCode: "",
      materialGroupCode: "",
      externalMaterialGroupCode: "",
      purchasingGroupCode: "",
      glAccountCode: "",
      fund: "",
      fc: "",
      fp: "",
      ci: "",
      requisitioner: "",
      sloc: "",
    });

    const isFiltered = !!(
      tableFilters.itemNo ||
      tableFilters.materialCode ||
      tableFilters.shortText ||
      tableFilters.acccate ||
      tableFilters.category ||
      tableFilters.plantCode ||
      tableFilters.costCenterCode ||
      tableFilters.assetCode ||
      tableFilters.orderCode ||
      tableFilters.materialGroupCode ||
      tableFilters.externalMaterialGroupCode ||
      tableFilters.purchasingGroupCode ||
      tableFilters.glAccountCode ||
      tableFilters.fund ||
      tableFilters.fc ||
      tableFilters.fp ||
      tableFilters.ci ||
      tableFilters.requisitioner ||
      tableFilters.sloc
    );

    const handleOpenFilter = useCallback(() => {
      openSheet(
        <PRItemTableFilterSheet
          initialFilters={tableFilters}
          onApply={setTableFilters}
          onClose={closeSheet}
        />,
      );
    }, [openSheet, tableFilters, closeSheet]);

    const formatNum = (val: any) =>
      val ? Number(val).toLocaleString("en-US") : "0";

    const tableContent = useMemo(() => {
      const items =
        data.lstDetail?.filter((item) => {
          const checkFilter = (
            field: string | undefined,
            filter: string | undefined,
          ) => !filter || field?.toLowerCase().includes(filter.toLowerCase());

          return (
            checkFilter(item.itemNo, tableFilters.itemNo) &&
            checkFilter(item.materialCode, tableFilters.materialCode) &&
            checkFilter(item.shortText, tableFilters.shortText) &&
            checkFilter(item.acccate, tableFilters.acccate) &&
            checkFilter(item.category, tableFilters.category) &&
            checkFilter(item.plantCode, tableFilters.plantCode) &&
            checkFilter(item.costCenterCode, tableFilters.costCenterCode) &&
            checkFilter(item.assetCode, tableFilters.assetCode) &&
            checkFilter(item.orderCode, tableFilters.orderCode) &&
            checkFilter(
              item.materialGroupCode,
              tableFilters.materialGroupCode,
            ) &&
            checkFilter(
              item.externalMaterialGroupCode,
              tableFilters.externalMaterialGroupCode,
            ) &&
            checkFilter(
              item.purchasingGroupCode,
              tableFilters.purchasingGroupCode,
            ) &&
            checkFilter(item.glAccountCode, tableFilters.glAccountCode) &&
            checkFilter(item.fund, tableFilters.fund) &&
            checkFilter(item.fc, tableFilters.fc) &&
            checkFilter(item.fp, tableFilters.fp) &&
            checkFilter(item.ci, tableFilters.ci) &&
            checkFilter(item.requisitioner, tableFilters.requisitioner) &&
            checkFilter(item.sloc, tableFilters.sloc)
          );
        }) || [];

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
          <Table.EyeDetailRow
            key={`eye-${idx}`}
            onPress={() => onShowDetail?.(item)}
          />,
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
          rowStyle: { backgroundColor: "#F8FAFC" },
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
            "", // 34 Tác vụ
          ] as ColumnTable[],
        });
      }

      return content;
    }, [data.lstDetail, tableFilters, onShowDetail]);

    return (
      <Collapse title="II. Danh sách Item" collapsible defaultExpanded={true}>
        <Table
          horizontalScroll
          containerStyle={{ marginHorizontal: -16 }}
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
            <Table.ButtonFilterTable
              key="item-filter"
              onPress={handleOpenFilter}
              isFiltered={isFiltered}
            />,
          ]}
          columnWidths={WIDTHS}
          columnTextAlignments={ALIGNS}
          stickyColumn="right"
          rows={tableContent}
        />
      </Collapse>
    );
  },
);

const styles = StyleSheet.create({
  filterBtn: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F80D53",
  },
});
