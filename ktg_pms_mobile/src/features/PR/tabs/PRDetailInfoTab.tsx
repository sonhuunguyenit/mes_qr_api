import React from "react";
import { ScrollView } from "react-native";
import { Spacer } from "~/common";
import { PRReleaseItem, PRReleaseLevel } from "~/services/pr/pr.type";
import globalStyle from "~/styles/global-style";
import { PRDetailGeneral } from "../components/PRDetailGeneral";
import { PRDetailItems } from "../components/PRDetailItems";
import { PRDetailRealese } from "../components/PRDetailRealese";

interface PRDetailInfoTabProps {
  data: any;
  onShowReleaseDetail: (level: PRReleaseLevel, item: PRReleaseItem) => void;
  onShowItemDetail: (item: any) => void;
}

export const PRDetailInfoTab = React.memo(
  ({ data, onShowReleaseDetail, onShowItemDetail }: PRDetailInfoTabProps) => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={globalStyle.scrollContainerDetail}
      >
        <PRDetailGeneral data={data} />
        <Spacer size={10} />

        <PRDetailRealese data={data} onShowDetail={onShowReleaseDetail} />
        <Spacer size={10} />

        <PRDetailItems data={data} onShowDetail={onShowItemDetail} />
      </ScrollView>
    );
  },
);
