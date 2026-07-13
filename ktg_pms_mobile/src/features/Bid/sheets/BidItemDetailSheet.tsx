import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import moment from "moment";
import React from "react";
import { View } from "react-native";
import { Column, Row } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";

interface BidItemDetailSheetProps {
  item: any;
}

export const BidItemDetailSheet = ({ item }: BidItemDetailSheetProps) => {
  const { spacing } = useTheme();

  const formatNum = (val: any) =>
    val && !isNaN(val) ? Number(val).toLocaleString("en-US") : val || "0";

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="detail" />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <Row>
            <ColumnInfo label="Item Line" value={item.itemNo || "---"} />
            <ColumnInfo label="Account assignment" value={item.acccateName || "---"} />
          </Row>

          <Row>
            <ColumnInfo label="Mã vật tư" value={item.materialCode || "---"} />
            <ColumnInfo label="Mat Group" value={item.materialGroupName || "---"} />
          </Row>

          <ColumnInfo
            label="External MatGroup"
            value={item.externalMaterialGroupTitle || "---"}
            full
          />

          <Row>
            <ColumnInfo label="Mã tài sản" value={item.assetCode || "---"} />
            <ColumnInfo label="SubNoAsset" value={item.subNoAset || "---"} />
          </Row>

          <Row>
            <ColumnInfo label="Mã dịch vụ" value={item.orderCode || "---"} />
            <ColumnInfo label="GL Account" value={item.glAccountCode || "---"} />
          </Row>

          <ColumnInfo label="Short text" value={item.shortText || "---"} full />

          <Row>
            <ColumnInfo label="Cost Center" value={item.costCenterCode || "---"} />
            <ColumnInfo label="Số lượng mua" value={formatNum(item.quantity)} />
          </Row>

          <Row>
            <ColumnInfo label="Đơn vị tính" value={item.unitCode || "---"} />
            <ColumnInfo
              label="Thời gian cần hàng"
              value={item.deliveryDate ? moment(item.deliveryDate).format("DD/MM/YYYY") : "---"}
            />
          </Row>

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};
