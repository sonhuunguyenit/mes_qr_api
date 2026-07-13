import React, { useCallback, useMemo } from "react";
import { ScrollView } from "react-native";
import { Collapse, Column, Spacer } from "~/common";
import Table, { ColumnTable } from "~/common/Table";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useSheet } from "~/contexts/SheetContext";
import {
  MaterialItemData,
  MaterialSalesItem,
} from "~/services/material/material.type";
import globalStyle from "~/styles/global-style";
import { MaterialSalesDetailSheet } from "../sheets/MaterialSalesDetailSheet";

interface MaterialApprovalDetailSalesTabProps {
  data: MaterialItemData;
}

const SALES_WIDTHS = [
  50, 130, 140, 100, 180, 110, 130, 160, 140, 130, 140, 110, 120, 120, 120, 120,
  120, 250,
];

const SALES_ALIGNS: ("left" | "center" | "right")[] = [
  "center", // STT
  "center", // Sales Organization
  "center", // Distribution Channel
  "center", // Sale unit
  "left", // Account Assignment Group
  "center", // Thuế bán hàng
  "center", // Material Price Grp
  "center", // Material Statistics Group
  "center", // Item Category Group
  "center", // Availble check (PP)
  "center", // Transportation Group
  "center", // Loading Group
  "left", // Material Group 1
  "left", // Material Group 2
  "left", // Material Group 3
  "left", // Material Group 4
  "left", // Material Group 5
  "center", // Flag detete distribution channel
];

export const MaterialApprovalDetailSalesTab = React.memo(
  ({ data }: MaterialApprovalDetailSalesTabProps) => {
    const { openSheet } = useSheet();

    const handleRowDoublePress = useCallback(
      (index: number) => {
        const items = data?.lstMaterialSell || [];
        const item = items[index];
        if (item) {
          openSheet(<MaterialSalesDetailSheet item={item} index={index} />);
        }
      },
      [data?.lstMaterialSell, openSheet],
    );

    const salesTableContent = useMemo(() => {
      const items = data?.lstMaterialSell || [];
      return items.map((item: MaterialSalesItem, idx: number) => ({
        cells: [
          (idx + 1).toString(),
          item.salesOrganizationCode || "---",
          item.distributionChannelCode || "---",
          item.saleUnitCode || "---",
          item.accountAssignmentGroupCode || "---",
          item.saleTaxCode || "---",
          item.exportTaxCode || "---",
          item.materialStatisticsGroup || "---",
          item.itemCategoryGroupCode || "---",
          item.availbleCheckPP || "---",
          item.transportationGroup || "---",
          item.loadingGroup || "---",
          item.matGroup1Code || "---",
          item.matGroup2Code || "---",
          item.matGroup3Code || "---",
          item.matGroup4Code || "---",
          item.matGroup5Code || "---",
          item.flagDeteteDistributionChannel ? "Có" : "Không",
        ] as ColumnTable[],
      }));
    }, [data?.lstMaterialSell]);

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={globalStyle.scrollContainerDetail}
      >
        {/* I. THÔNG TIN CHUNG */}
        <Collapse title="I. Thông tin chung" collapsible defaultExpanded>
          <Column gap={12} align="stretch">
            <ColumnInfo label="Mã vật tư" value={data?.code} full last />
          </Column>
        </Collapse>

        <Spacer size={10} />

        {/* II. DANH SÁCH THÔNG TIN BÁN HÀNG */}
        <Collapse
          title="II. Danh sách thông tin bán hàng"
          collapsible
          defaultExpanded
          containerStyle={globalStyle.collapseContainer}
        >
          <Table
            horizontalScroll
            columns={[
              "STT",
              "Sales Organization",
              "Distribution Channel",
              "Sale unit",
              "Account Assignment Group",
              "Thuế bán hàng",
              "Material Price Grp",
              "Material Statistics Group",
              "Item Category Group",
              "Availble check (PP)",
              "Transportation Group",
              "Loading Group",
              "Material Group 1",
              "Material Group 2",
              "Material Group 3",
              "Material Group 4",
              "Material Group 5",
              "Flag for detete at Distribution channel",
            ]}
            columnWidths={SALES_WIDTHS}
            columnTextAlignments={SALES_ALIGNS}
            rows={salesTableContent}
            onRowDoublePress={handleRowDoublePress}
            pagination={{ enabled: false }}
          />
        </Collapse>
      </ScrollView>
    );
  },
);

export default MaterialApprovalDetailSalesTab;
