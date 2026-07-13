import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import moment from "moment";
import React from "react";
import { View } from "react-native";
import { Column, Row } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { StatusBadge } from "~/components/Status";
import { SUPPLIER_POTENTIAL_UPGRADE_STATUS_CONFIG } from "~/enums/supplier.enum";
import { useTheme } from "~/hooks/useTheme";

interface SupplierPotentialBusinessAreaDetailSheetProps {
  item: any;
}

export const SupplierPotentialBusinessAreaDetailSheet = ({
  item,
}: SupplierPotentialBusinessAreaDetailSheetProps) => {
  const { spacing } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="detail" />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <ColumnInfo label="Mã nhà cung cấp" value={item.supplierCode || "---"} full />
          
          <ColumnInfo
            label="Lĩnh vực kinh doanh"
            value={item.serviceName || "---"}
            full
          />

          <ColumnInfo
            label="Trạng thái"
            value={
              <StatusBadge
                value={
                  SUPPLIER_POTENTIAL_UPGRADE_STATUS_CONFIG[item.status]?.label ||
                  item.statusName ||
                  "---"
                }
                color={SUPPLIER_POTENTIAL_UPGRADE_STATUS_CONFIG[item.status]?.color}
                bgColor={SUPPLIER_POTENTIAL_UPGRADE_STATUS_CONFIG[item.status]?.bgColor}
                borderColor={
                  SUPPLIER_POTENTIAL_UPGRADE_STATUS_CONFIG[item.status]?.borderColor
                }
              />
            }
            full
          />

          <ColumnInfo
            label="Ngày đăng ký"
            value={item.createdAt ? moment(item.createdAt).format("DD/MM/YYYY") : "---"}
            full
          />

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};
