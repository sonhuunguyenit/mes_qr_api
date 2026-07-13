import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Spacer, Table } from "~/common";
import globalStyle from "~/styles/global-style";
import { useTheme } from "~/hooks/useTheme";
import moment from "moment";
import { useSheet } from "~/contexts/SheetContext";
import { SupplierPotentialBusinessAreaDetailSheet } from "../sheets/SupplierPotentialBusinessAreaDetailSheet";
import { StatusBadge } from "~/components/Status";
import { SUPPLIER_POTENTIAL_UPGRADE_STATUS_CONFIG } from "~/enums/supplier.enum";

interface Props {
  data: any;
}

const SupplierPotentialBusinessAreaTab = ({ data }: Props) => {
  const { colors } = useTheme();
  const { openSheet } = useSheet();
  // Handle nested data and fallback to empty array
  const businessAreas = data?.businessAreas || [];

  const columns = [
    "STT",
    "Mã NCC",
    "Lĩnh vực kinh doanh",
    "Trạng thái",
    "Ngày đăng ký",
  ];

  const rows = businessAreas.map((item: any, index: number) => ({
    cells: [
      (index + 1).toString(),
      item.supplierCode || "---",
      item.serviceName || "---",
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
      />,
      item.createdAt ? moment(item.createdAt).format("DD/MM/YYYY") : "---",
    ],
  }));

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={globalStyle.scrollContainerDetail}
    >
      <Text weight="bold" size={16} style={styles.title}>
        Danh sách lĩnh vực kinh doanh
      </Text>
      <Spacer size={10} />

      <Table
        columns={columns}
        rows={rows}
        columnWidths={[50, 100, 200, 120, 120]}
        horizontalScroll
        onRowDoublePress={(index) => {
          openSheet(() => (
            <SupplierPotentialBusinessAreaDetailSheet
              item={businessAreas[index]}
            />
          ));
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    flex: 1,
  },
  title: {
    marginTop: 10,
  },
});

export default SupplierPotentialBusinessAreaTab;
