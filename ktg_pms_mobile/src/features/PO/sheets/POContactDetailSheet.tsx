import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Column, Row, Text } from "~/common";
import { useTheme } from "~/hooks/useTheme";
import { POContact } from "~/services/po/po.type";
import { POFieldItem } from "../components/POFieldItem";

interface POContactDetailSheetProps {
  contact: POContact;
}

const POContactDetailSheet = ({ contact }: POContactDetailSheetProps) => {
  const { spacing } = useTheme();

  return (
    <BottomSheetScrollView style={{ padding: spacing.md }}>
      <Text size={18} bold style={{ marginBottom: 20 }}>
        Chi tiết liên lạc
      </Text>

      <Column gap={12} align="stretch" style={styles.contentContainer}>
        <Row full gap={16}>
          <POFieldItem label="Mã NV" value={contact.employeeCode || "---"} />
          <POFieldItem label="Họ tên" value={contact.employeeName || "---"} />
        </Row>

        <Row full gap={16}>
          <POFieldItem
            label="Vị trí"
            value={contact.positionName ?? contact.position ?? "---"}
          />
          <POFieldItem
            label="Cost Center"
            value={contact.costCenter || "---"}
          />
        </Row>

        <POFieldItem
          label="SĐT"
          value={contact.phone ?? contact.phoneNumber ?? "---"}
          fullWidth
        />

        <View style={{ height: 40 }} />
      </Column>
    </BottomSheetScrollView>
  );
};

export default POContactDetailSheet;

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 20,
  },
});
