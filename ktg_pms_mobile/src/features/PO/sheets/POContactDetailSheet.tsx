import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { View } from "react-native";
import { Column, Row } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";
import { POContact } from "~/services/po/po.type";

interface POContactDetailSheetProps {
  contact: POContact;
}

const POContactDetailSheet = ({ contact }: POContactDetailSheetProps) => {
  const { spacing } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="detail" />

      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <Row>
            <ColumnInfo label="Mã NV" value={contact.employeeCode || "---"} />
            <ColumnInfo label="Họ tên" value={contact.employeeName || "---"} />
          </Row>

          <Row>
            <ColumnInfo
              label="Vị trí"
              value={contact.positionName ?? contact.position ?? "---"}
            />
            <ColumnInfo
              label="Cost Center"
              value={contact.costCenter || "---"}
            />
          </Row>

          <ColumnInfo
            label="SĐT"
            value={contact.phone ?? contact.phoneNumber ?? "---"}
            full
            last
          />

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};

export default POContactDetailSheet;
