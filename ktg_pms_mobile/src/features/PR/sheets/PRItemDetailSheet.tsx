import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Column, Row, Text } from "~/common";
import { useTheme } from "~/hooks/useTheme";
import { PRDetailItem } from "~/services/pr/pr.type";
import { PRFieldItem } from "../components/PRFieldItem";
import moment from "moment";

interface PRItemDetailSheetProps {
  item: PRDetailItem;
}

export const PRItemDetailSheet = ({ item }: PRItemDetailSheetProps) => {
  const { spacing } = useTheme();

  const formatNum = (val: any) =>
    val ? Number(val).toLocaleString("en-US") : "0";

  return (
    <BottomSheetScrollView style={{ padding: spacing.md }}>
      <Text size={18} bold style={{ marginBottom: 20 }}>
        Chi tiết vật tư
      </Text>

      <Column gap={12} align="stretch" style={styles.contentContainer}>
        <Row full gap={16}>
          <PRFieldItem label="Item line" value={item.itemNo || "---"} />
          <PRFieldItem label="Material" value={item.materialCode || "---"} />
        </Row>

        <PRFieldItem
          label="Short text"
          value={item.shortText || "---"}
          fullWidth
        />

        <Row full gap={16}>
          <PRFieldItem label="Số lượng" value={formatNum(item.quantity)} />
          <PRFieldItem label="Đơn vị" value={item.unitName || "---"} />
        </Row>

        <Row full gap={16}>
          <PRFieldItem
            label="Valuation Price"
            value={formatNum(item.valuationPrice)}
          />
          <PRFieldItem label="Ngân sách Item" value={formatNum(item.total)} />
        </Row>

        <PRFieldItem
          label="Ngân sách"
          value={formatNum(item.budget)}
          fullWidth
        />

        <PRFieldItem
          label="Material Group"
          value={
            item.materialGroupCode
              ? `${item.materialGroupCode} - ${item.materialGroupName || ""}`
              : "---"
          }
          fullWidth
        />

        <PRFieldItem
          label="External Mat Group"
          value={
            item.externalMaterialGroupCode
              ? `${item.externalMaterialGroupCode} - ${
                  item.externalMaterialGroupName || ""
                }`
              : "---"
          }
          fullWidth
        />

        <Row full gap={16}>
          <PRFieldItem
            label="Cost Center"
            value={item.costCenterCode || "---"}
          />
          <PRFieldItem
            label="Asset"
            value={
              item.assetCode
                ? `${item.assetCode} - ${item.assetDesc || ""}`
                : "---"
            }
          />
        </Row>

        <PRFieldItem
          label="Order"
          value={
            item.orderCode ? `${item.orderCode} - ${item.ioName || ""}` : "---"
          }
          fullWidth
        />

        <Row full gap={16}>
          <PRFieldItem
            label="Delivery Date"
            value={
              item.deliveryDate
                ? moment(item.deliveryDate).format("DD/MM/YYYY")
                : "---"
            }
          />
          <PRFieldItem label="Sloc" value={item.sloc || "---"} />
        </Row>

        <PRFieldItem
          label="Nhóm mua hàng"
          value={
            item.purchasingGroupCode
              ? `${item.purchasingGroupCode} - ${item.purchasingGroupName || ""}`
              : "---"
          }
          fullWidth
        />

        <PRFieldItem
          label="GL Account"
          value={
            item.glAccountCode
              ? `${item.glAccountCode} - ${item.glAccountName || ""}`
              : "---"
          }
          fullWidth
        />

        <Row full gap={16}>
          <PRFieldItem label="Fund" value={item.fund || "---"} />
          <PRFieldItem label="FC" value={item.fc || "---"} />
        </Row>

        <Row full gap={16}>
          <PRFieldItem label="FP" value={item.fp || "---"} />
          <PRFieldItem label="CI" value={item.ci || "---"} />
        </Row>

        <PRFieldItem
          label="Requisitioner"
          value={item.requisitioner || "---"}
          fullWidth
        />

        <View style={{ height: 40 }} />
      </Column>
    </BottomSheetScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 20,
  },
});
