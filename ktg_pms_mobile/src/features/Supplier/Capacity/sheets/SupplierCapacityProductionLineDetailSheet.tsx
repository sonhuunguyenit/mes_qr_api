import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import moment from "moment";
import React from "react";
import { View } from "react-native";
import { Column, Row } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";

interface SupplierCapacityProductionLineDetailSheetProps {
  item: any;
}

export const SupplierCapacityProductionLineDetailSheet = ({
  item,
}: SupplierCapacityProductionLineDetailSheetProps) => {
  const { spacing } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet title="Chi tiết thiết bị dây chuyền" type="detail" />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <ColumnInfo label="Bước quy trình SX" value={item?.step || "---"} full />
          <ColumnInfo label="Tên thiết bị" value={item?.equipmentName || "---"} full />
          
          <Row>
            <ColumnInfo label="Số lượng VH" value={item?.quantity || "---"} />
            <ColumnInfo
              label="Năm sử dụng"
              value={item?.commissioningYear ? moment(item.commissioningYear).format("YYYY") : "---"}
            />
          </Row>

          <Row>
            <ColumnInfo label="Công suất thiết kế" value={item?.designCapacity || "---"} />
            <ColumnInfo label="Công suất thực tế" value={item?.actualCapacity || "---"} />
          </Row>

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};
