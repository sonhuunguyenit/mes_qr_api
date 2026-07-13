import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { View } from "react-native";
import { Column, Row } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";

interface SupplierCapacityFacilityDetailSheetProps {
  item: any;
}

export const SupplierCapacityFacilityDetailSheet = ({
  item,
}: SupplierCapacityFacilityDetailSheetProps) => {
  const { spacing } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet title="Chi tiết Nhà xưởng/Thiết bị" type="detail" />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <ColumnInfo label="Tên" value={item?.name || "---"} full />
          
          <Row>
            <ColumnInfo label="Tổng diện tích (m2)" value={item?.totalAreaM2 || "---"} />
            <ColumnInfo label="Số giờ làm việc TB" value={item?.avgWorkHour || "---"} />
          </Row>

          <Row>
            <ColumnInfo label="DT Văn phòng (m2)" value={item?.officeAreaM2 || "---"} />
            <ColumnInfo label="DT Sản xuất (m2)" value={item?.productionAreaM2 || "---"} />
          </Row>

          <Row>
            <ColumnInfo label="DT Kho NVL (m2)" value={item?.rawMaterialAreaM2 || "---"} />
            <ColumnInfo label="DT Kho thành phẩm (m2)" value={item?.finishedGoodsAreaM2 || "---"} />
          </Row>

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};
