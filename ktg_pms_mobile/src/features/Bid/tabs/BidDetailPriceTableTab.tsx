import React from "react";
import { ScrollView } from "react-native";
import { Spacer } from "~/common";
import globalStyle from "~/styles/global-style";
import { BidDetailPriceTable } from "../components/BidDetailPriceTable";

interface BidDetailPriceTableTabProps {
  data: any;
}

export const BidDetailPriceTableTab = React.memo(({ data }: BidDetailPriceTableTabProps) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={globalStyle.scrollContainerDetail}
    >
      <Spacer size={10} />
      <BidDetailPriceTable data={data} />
    </ScrollView>
  );
});
