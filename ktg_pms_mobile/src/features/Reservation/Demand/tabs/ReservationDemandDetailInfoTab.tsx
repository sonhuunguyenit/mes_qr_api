import React from "react";
import { ScrollView } from "react-native";
import { Spacer } from "~/common";
import {
  ReservationApprovalItem,
  ReservationApprovalLevel,
  ReservationDetailData,
  ReservationDetailItem,
} from "~/services/reservation/reservation.type";
import globalStyle from "~/styles/global-style";
import { ReservationDemandDetailGeneral } from "../components/ReservationDemandDetailGeneral";
import { ReservationDemandDetailItems } from "../components/ReservationDemandDetailItems";
import { ReservationDemandDetailRelease } from "../components/ReservationDemandDetailRelease";

interface Props {
  data: ReservationDetailData;
  onShowReleaseDetail: (
    level: ReservationApprovalLevel,
    item: ReservationApprovalItem,
  ) => void;
  onShowItemDetail: (item: ReservationDetailItem) => void;
}

export const ReservationDemandDetailInfoTab = ({
  data,
  onShowReleaseDetail,
  onShowItemDetail,
}: Props) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={globalStyle.scrollContainerDetail}
    >
      <ReservationDemandDetailGeneral data={data} />
      <Spacer size={10} />

      <ReservationDemandDetailRelease
        data={data}
        onShowDetail={onShowReleaseDetail}
      />
      <Spacer size={10} />

      {/* Maintenance (DichVu) doesn't have a line items table in the same way Usage Demand (HangHoa) does */}
      {data.sourceType !== "DichVu" && (
        <ReservationDemandDetailItems
          data={data}
          onShowDetail={onShowItemDetail}
        />
      )}
    </ScrollView>
  );
};
