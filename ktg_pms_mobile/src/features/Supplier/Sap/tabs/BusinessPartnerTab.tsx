import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Column, Row, Spacer, Text, Collapse } from "~/common";
import { useTheme } from "~/hooks/useTheme";
import { ColumnInfo } from "~/components/ColumnInfo";
import globalStyle from "~/styles/global-style";
import SupplierCommonInfo from "../../components/SupplierCommonInfo";

interface BusinessPartnerTabProps {
  data: any; // dataObject
  supplier: any; // dataSupplier
}

const BusinessPartnerTab = ({ data, supplier }: BusinessPartnerTabProps) => {
  const { colors, spacing } = useTheme();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={globalStyle.scrollContainerDetail}
      showsVerticalScrollIndicator={false}
    >
      {/* VAI TRÒ BUSINESS PARTNER */}
      <Collapse
        title="Vai trò Business Partner"
        collapsible={true}
        style={{
          ...styles.subCollapse,
          borderColor: colors.border as string,
        }}
        headerStyle={{
          ...styles.subCollapseHeader,
          backgroundColor: colors.slate100 as string,
        }}
      >
        <Column style={{ gap: spacing.xs }} align="stretch">
          <Row full gap={spacing.md}>
            <ColumnInfo
              label="Supplier Number"
              value={
                supplier?.sapCode || data?.bpNumber || data?.bpnumber || ""
              }
            />
            <ColumnInfo
              label="Nhóm đối tác"
              value={
                data?.businessPartnerGroupName ||
                data?.businessPartnerGroup?.name ||
                ""
              }
            />
          </Row>

          <Row full gap={spacing.md}>
            <ColumnInfo
              label="Cá nhân/Tổ chức"
              value={data?.titleName || data?.title_name || ""}
            />
            {/* titleCode !== '0003' is Person (FirstName/LastName), 0003 is Organization (ShortName) - logical from Admin */}
            {data?.titleCode !== "0003" ? (
              <ColumnInfo label="First Name" value={data?.fristName || ""} />
            ) : (
              <ColumnInfo label="Tên ngắn gọn" value={data?.shortName || ""} />
            )}
          </Row>

          {/* titleCode !== '0003' is Person (LastName/SearchTerm), 0003 is Organization (SearchTerm/Empty) - logical from Admin */}
          {data?.titleCode !== "0003" ? (
            <Row full gap={spacing.md}>
              <ColumnInfo label="Last Name" value={data?.lastName || ""} />
              <ColumnInfo label="Tên tìm kiếm" value={data?.searchTerm || ""} />
            </Row>
          ) : (
            <Row full gap={spacing.md}>
              <ColumnInfo label="Tên tìm kiếm" value={data?.searchTerm || ""} />
              <View style={{ flex: 1 }} />
            </Row>
          )}

          <Row full gap={spacing.md}>
            <ColumnInfo
              label="Phân nhóm cổ đông"
              value={data?.stakeholderCategoryName || ""}
              last
            />
            <ColumnInfo label="Mã cũ NCC" value={data?.pre_acct || ""} last />
          </Row>
        </Column>
      </Collapse>

      <Spacer size={10} />

      <SupplierCommonInfo supplier={supplier} />
    </ScrollView>
  );
};

export default BusinessPartnerTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  content: {
    padding: 5,
    paddingBottom: 40,
    width: "100%",
    alignItems: "stretch",
    flexGrow: 1,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  subCollapse: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  subCollapseHeader: {
    paddingVertical: 10,
  },
  listCard: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
});
