import React from "react";
import { ScrollView } from "react-native";
import { Spacer } from "~/common";
import globalStyle from "~/styles/global-style";
import { BidDetailConditions } from "../components/BidDetailConditions";
import { BidDetailGeneral } from "../components/BidDetailGeneral";
import { BidDetailItems } from "../components/BidDetailItems";
import { BidDetailPriceTable } from "../components/BidDetailPriceTable";
import { BidDetailSuppliers } from "../components/BidDetailSuppliers";

interface BidDetailInfoTabProps {
  data: any;
}

export const BidDetailInfoTab = React.memo(
  ({ data }: BidDetailInfoTabProps) => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={globalStyle.scrollContainerDetail}
      >
        <BidDetailGeneral data={data} />
        <Spacer size={10} />
        <BidDetailItems data={data} />
        <Spacer size={10} />
        <BidDetailSuppliers data={data} />
        <Spacer size={10} />
        <BidDetailConditions data={data} />
        <Spacer size={10} />
        <BidDetailPriceTable data={data} />
      </ScrollView>
    );
  },
);
