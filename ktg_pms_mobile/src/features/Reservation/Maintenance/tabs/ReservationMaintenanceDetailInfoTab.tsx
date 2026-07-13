import React from "react";
import { ScrollView } from "react-native";
import { Collapse, Spacer } from "~/common";
import { ReservationDetailData } from "~/services/reservation/reservation.type";
import globalStyle from "~/styles/global-style";
import { ReservationMaintenanceDetailGeneral } from "../components/ReservationMaintenanceDetailGeneral";

interface Props {
  data: ReservationDetailData;
}

export const ReservationMaintenanceDetailInfoTab = ({ data }: Props) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={globalStyle.scrollContainerDetail}
    >
      <Collapse
        title="Chi tiết nhu cầu sửa chữa"
        collapsible
        defaultExpanded={true}
      >
        <ReservationMaintenanceDetailGeneral data={data} />
        <Spacer size={10} />
      </Collapse>
    </ScrollView>
  );
};
