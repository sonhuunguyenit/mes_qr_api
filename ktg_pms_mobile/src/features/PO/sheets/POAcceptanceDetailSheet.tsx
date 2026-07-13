import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import moment from "moment";
import React from "react";
import { View } from "react-native";
import { Column, Row } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";
import { AcceptanceItem } from "~/services/acceptance/acceptance.type";

interface POAcceptanceDetailSheetProps {
  data: AcceptanceItem;
  onClose: () => void;
}

const POAcceptanceDetailSheet = ({ data }: POAcceptanceDetailSheetProps) => {
  const { spacing } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="detail" />

      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <ColumnInfo
            label="Số biên bản nghiệm thu"
            value={data.acceptanceNumber}
            full
          />

          <ColumnInfo
            label="Đối tượng nghiệm thu"
            value={data.acceptanceObject}
            full
          />

          <Row>
            <ColumnInfo
              label="Ngày nghiệm thu"
              value={
                data.handoverTime
                  ? moment(data.handoverTime).format("DD/MM/YYYY")
                  : "---"
              }
            />
            <ColumnInfo label="Người nghiệm thu" value={data.employeeName} />
          </Row>

          <ColumnInfo
            label="Kết quả nghiệm thu"
            value={data.acceptanceResults}
            full
          />

          <ColumnInfo
            label="Trạng thái"
            value={data.statusName || "---"}
            full
            last
          />

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};

export default POAcceptanceDetailSheet;
