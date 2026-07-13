import React from "react";
import { View } from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Column, Row } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";
import { MaterialSalesItem } from "~/services/material/material.type";

interface MaterialSalesDetailSheetProps {
  item: MaterialSalesItem;
  index: number;
}

export const MaterialSalesDetailSheet = ({ item, index }: MaterialSalesDetailSheetProps) => {
  const { spacing } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="detail" />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <Row>
            <ColumnInfo label="STT" value={(index + 1).toString()} />
            <ColumnInfo label="Sales Organization" value={item.salesOrganizationCode || "---"} />
          </Row>

          <Row>
            <ColumnInfo label="Distribution Channel" value={item.distributionChannelCode || "---"} />
            <ColumnInfo label="Sale unit" value={item.saleUnitCode || "---"} />
          </Row>

          <Row>
            <ColumnInfo label="Account Assignment Group" value={item.accountAssignmentGroupCode || "---"} />
            <ColumnInfo label="Thuế bán hàng" value={item.saleTaxCode || "---"} />
          </Row>

          <Row>
            <ColumnInfo label="Material Price Grp" value={item.exportTaxCode || "---"} />
            <ColumnInfo label="Material Statistics Group" value={item.materialStatisticsGroup || "---"} />
          </Row>

          <Row>
            <ColumnInfo label="Item Category Group" value={item.itemCategoryGroupCode || "---"} />
            <ColumnInfo label="Availble check (PP)" value={item.availbleCheckPP || "---"} />
          </Row>

          <Row>
            <ColumnInfo label="Transportation Group" value={item.transportationGroup || "---"} />
            <ColumnInfo label="Loading Group" value={item.loadingGroup || "---"} />
          </Row>

          <Row>
            <ColumnInfo label="Material Group 1" value={item.matGroup1Code || "---"} />
            <ColumnInfo label="Material Group 2" value={item.matGroup2Code || "---"} />
          </Row>

          <Row>
            <ColumnInfo label="Material Group 3" value={item.matGroup3Code || "---"} />
            <ColumnInfo label="Material Group 4" value={item.matGroup4Code || "---"} />
          </Row>

          <Row>
            <ColumnInfo label="Material Group 5" value={item.matGroup5Code || "---"} />
            <ColumnInfo
              label="Flag for detete at Distribution channel"
              value={item.flagDeteteDistributionChannel ? "Có" : "Không"}
              last
            />
          </Row>

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};

export default MaterialSalesDetailSheet;
