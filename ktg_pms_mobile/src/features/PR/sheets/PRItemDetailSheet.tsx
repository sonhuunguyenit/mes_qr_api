import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import moment from "moment";
import React from "react";
import { View } from "react-native";
import { Column, Row } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";
import { PRDetailItem } from "~/services/pr/pr.type";

interface PRItemDetailSheetProps {
  item: PRDetailItem;
}

export const PRItemDetailSheet = ({ item }: PRItemDetailSheetProps) => {
  const { spacing } = useTheme();

  const formatNum = (val: any) =>
    val ? Number(val).toLocaleString("en-US") : "0";

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="detail" />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <Row>
            <ColumnInfo label="Item line" value={item.itemNo || "---"} />
            <ColumnInfo label="Material" value={item.materialCode || "---"} />
          </Row>

          <ColumnInfo label="Short text" value={item.shortText || "---"} full />

          <Row>
            <ColumnInfo label="Số lượng" value={formatNum(item.quantity)} />
            <ColumnInfo label="Đơn vị" value={item.unitName || "---"} />
          </Row>

          <Row>
            <ColumnInfo
              label="Valuation Price"
              value={formatNum(item.valuationPrice)}
            />
            <ColumnInfo label="Ngân sách Item" value={formatNum(item.total)} />
          </Row>

          <ColumnInfo label="Ngân sách" value={formatNum(item.budget)} full />

          <ColumnInfo
            label="Material Group"
            value={
              item.materialGroupCode
                ? `${item.materialGroupCode} - ${item.materialGroupName || ""}`
                : "---"
            }
            full
          />

          <ColumnInfo
            label="External Mat Group"
            value={
              item.externalMaterialGroupCode
                ? `${item.externalMaterialGroupCode} - ${
                    item.externalMaterialGroupName || ""
                  }`
                : "---"
            }
            full
          />

          <Row>
            <ColumnInfo
              label="Cost Center"
              value={item.costCenterCode || "---"}
            />
            <ColumnInfo
              label="Asset"
              value={
                item.assetCode
                  ? `${item.assetCode} - ${item.assetDesc || ""}`
                  : "---"
              }
            />
          </Row>

          <ColumnInfo
            label="Order"
            value={
              item.orderCode
                ? `${item.orderCode} - ${item.ioName || ""}`
                : "---"
            }
            full
          />

          <Row>
            <ColumnInfo
              label="Delivery Date"
              value={
                item.deliveryDate
                  ? moment(item.deliveryDate).format("DD/MM/YYYY")
                  : "---"
              }
            />
            <ColumnInfo label="Sloc" value={item.sloc || "---"} />
          </Row>

          <ColumnInfo
            label="Nhóm mua hàng"
            value={
              item.purchasingGroupCode
                ? `${item.purchasingGroupCode} - ${item.purchasingGroupName || ""}`
                : "---"
            }
            full
          />

          <ColumnInfo
            label="GL Account"
            value={
              item.glAccountCode
                ? `${item.glAccountCode} - ${item.glAccountName || ""}`
                : "---"
            }
            full
          />

          <Row>
            <ColumnInfo label="Fund" value={item.fund || "---"} />
            <ColumnInfo label="FC" value={item.fc || "---"} />
          </Row>

          <Row>
            <ColumnInfo label="FP" value={item.fp || "---"} />
            <ColumnInfo label="CI" value={item.ci || "---"} />
          </Row>

          <ColumnInfo
            label="Requisitioner"
            value={item.requisitioner || "---"}
            full
            last
          />

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};
