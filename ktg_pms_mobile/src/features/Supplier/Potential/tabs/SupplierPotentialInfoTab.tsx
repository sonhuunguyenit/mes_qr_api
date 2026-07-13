import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Spacer } from "~/common";
import globalStyle from "~/styles/global-style";
import SupplierCommonInfo from "../../components/SupplierCommonInfo";

interface Props {
  data: any;
}

const SupplierPotentialInfoTab = ({ data }: Props) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={globalStyle.scrollContainerDetail}
    >
      <SupplierCommonInfo supplier={data} />
    </ScrollView>
  );
};

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
});

export default SupplierPotentialInfoTab;
