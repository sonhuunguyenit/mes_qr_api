import React from "react";
import { ScrollView } from "react-native";
import { Spacer } from "~/common";
import globalStyle from "~/styles/global-style";
import { BidDetailConditions } from "../components/BidDetailConditions";

interface BidDetailConditionTabProps {
  data: any;
}

export const BidDetailConditionTab = React.memo(({ data }: BidDetailConditionTabProps) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={globalStyle.scrollContainerDetail}
    >
      <Spacer size={10} />
      <BidDetailConditions data={data} />
    </ScrollView>
  );
});
