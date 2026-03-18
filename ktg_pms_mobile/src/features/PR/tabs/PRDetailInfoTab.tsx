import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Spacer } from "~/common";
import { PRDetailGeneral } from "../components/PRDetailGeneral";
import { PRDetailApproval } from "../components/PRDetailApproval";
import { PRDetailItems } from "../components/PRDetailItems";
import { PRApprovalItem, PRApprovalLevel } from "~/services/pr/pr.type";

interface PRDetailInfoTabProps {
  data: any;
  onShowApprovalDetail: (level: PRApprovalLevel, item: PRApprovalItem) => void;
  onShowItemDetail: (item: any) => void;
}

export const PRDetailInfoTab = React.memo(
  ({ data, onShowApprovalDetail, onShowItemDetail }: PRDetailInfoTabProps) => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <PRDetailGeneral data={data} />
        <Spacer size={10} />
        <PRDetailApproval data={data} onShowDetail={onShowApprovalDetail} />
        <Spacer size={10} />
        <PRDetailItems data={data} onShowDetail={onShowItemDetail} />
        <Spacer size={120} />
      </ScrollView>
    );
  },
);

const styles = StyleSheet.create({
  scrollContent: {
    padding: 5,
  },
});
