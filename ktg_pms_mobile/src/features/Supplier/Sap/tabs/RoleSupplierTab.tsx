import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Column, Spacer, Text, Card, Divider, Checkbox, Table } from "~/common";
import globalStyle from "~/styles/global-style";
import { useTheme } from "~/hooks/useTheme";
import { useSheet } from "~/contexts/SheetContext";
import { SupplierSapRoleSheet } from "../sheets/SupplierSapRoleSheet";

interface RoleSupplierTabProps {
  data: any; // dataObject
}

const RoleSupplierTab = ({ data }: RoleSupplierTabProps) => {
  const { colors, spacing } = useTheme();
  const { openSheet } = useSheet();

  const formatCodeName = (code?: string, name?: string) => {
    if (!code && !name) return "";
    if (!code) return name || "";
    if (!name) return code || "";
    return `${code} - ${name}`;
  };

  const list = data?.lstRoleSupplier || [];

  if (list.length === 0) {
    return (
      <View style={styles.empty}>
        <Text color={colors.label}>Không có dữ liệu Role Supplier</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={globalStyle.scrollContainerDetail}
    >
      <Table
        columns={[
          "#",
          "Tổ chức mua hàng",
          "Công ty mua hàng",
          "Nhóm mua hàng",
          "Đơn vị tiền tệ",
          "Điều kiện vận chuyển",
          "Thời hạn thanh toán",
          "Nhóm điều kiện giá",
          "Xác nhận nhập hàng",
          "Cấp hàng miễn phí",
        ]}
        columnWidths={[50, 250, 250, 250, 200, 150, 200, 150, 150, 150]}
        horizontalScroll
        rows={list.map((item: any, index: number) => ({
          cells: [
            index + 1,
            formatCodeName(item.purchasingOrgCode, item.purchasingOrgName),
            formatCodeName(item.companyCode, item.companyName),
            formatCodeName(item.purchasingGroupCode, item.purchasingGroupName),
            formatCodeName(item.currencyCode, item.currencyName),
            item.shipCnt || "",
            formatCodeName(item.paymentTermCode, item.paymentTermName),
            item.schemaGrp || "",
            item.grbInv ? "Có" : "Không",
            item.grfg ? "Có" : "Không",
          ],
          rowStyle: item.isDeleted
            ? { opacity: 0.6, backgroundColor: colors.slate100 as string }
            : undefined,
        }))}
        onRowDoublePress={(index) => {
          const item = list[index];
          if (!item) return;
          openSheet(() => <SupplierSapRoleSheet item={item} />);
        }}
      />
    </ScrollView>
  );
};

export default RoleSupplierTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  content: {
    padding: 5,
    gap: 10,
    width: "100%",
    alignItems: "stretch",
    flexGrow: 1,
  },
  card: {
    padding: 12,
  },
  deletedCard: {
    opacity: 0.6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  checkboxRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  checkboxItem: {
    minWidth: "45%",
  },
});
