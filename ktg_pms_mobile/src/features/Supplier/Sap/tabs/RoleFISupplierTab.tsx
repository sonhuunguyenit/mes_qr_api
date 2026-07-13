import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Column, Spacer, Text, Card, Divider, Table } from "~/common";
import globalStyle from "~/styles/global-style";
import { useTheme } from "~/hooks/useTheme";
import { useSheet } from "~/contexts/SheetContext";
import { SupplierSapRoleFISheet } from "../sheets/SupplierSapRoleFISheet";

interface RoleFISupplierTabProps {
  data: any; // dataObject
}

const RoleFISupplierTab = ({ data }: RoleFISupplierTabProps) => {
  const { colors, spacing } = useTheme();
  const { openSheet } = useSheet();

  const formatCodeName = (code?: string, name?: string) => {
    if (!code && !name) return "";
    if (!code) return name || "";
    if (!name) return code || "";
    return `${code} - ${name}`;
  };

  const list = data?.lstRoleFISupplier || [];

  if (list.length === 0) {
    return (
      <View style={styles.empty}>
        <Text color={colors.label}>Không có dữ liệu Role FI Supplier</Text>
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
          "Tài khoản hoạch toán",
          "Thời hạn thanh toán",
          "Phương thức thanh toán",
          "Phân nhóm dòng tiền",
        ]}
        columnWidths={[50, 150, 150, 200, 150]}
        horizontalScroll
        rows={list.map((item: any, index: number) => ({
          cells: [
            index + 1,
            formatCodeName(item.glAccountCode, item.glAccountName),
            formatCodeName(item.paymentTermCode, item.paymentTermName),
            formatCodeName(item.paymentMethodCode, item.paymentMethodName),
            formatCodeName(item.planningGroupCode, item.planningGroupName),
          ],
          rowStyle: item.isDeleted
            ? { opacity: 0.6, backgroundColor: colors.slate100 as string }
            : undefined,
        }))}
        onRowDoublePress={(index) => {
          const item = list[index];
          if (!item) return;
          openSheet(() => <SupplierSapRoleFISheet item={item} />);
        }}
      />
    </ScrollView>
  );
};

export default RoleFISupplierTab;

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
});
