import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Column, Row, Text } from "~/common";
import { useTheme } from "~/hooks/useTheme";
import { POPartner } from "~/services/po/po.type";
import { POFieldItem } from "../components/POFieldItem";
import { PO_FUNCTION_DISPLAY, PO_PARTNER_TYPE_DISPLAY } from "~/enums/po.enum";

interface POPartnerDetailSheetProps {
  partner: POPartner;
}

const POPartnerDetailSheet = ({ partner }: POPartnerDetailSheetProps) => {
  const { spacing } = useTheme();

  return (
    <BottomSheetScrollView style={{ padding: spacing.md }}>
      <Text size={18} bold style={{ marginBottom: 20 }}>
        Chi tiết đối tác
      </Text>

      <Column gap={12} align="stretch" style={styles.contentContainer}>
        <Row full gap={16}>
          <POFieldItem
            label="Mã chức năng đối tác"
            value={partner.partnerFunctionCode || "---"}
          />
          <POFieldItem
            label="Chức năng đối tác"
            value={
              PO_FUNCTION_DISPLAY[partner.partnerFunctionCode] ??
              partner.partnerFunctionCode
            }
          />
        </Row>

        <Row full gap={16}>
          <POFieldItem
            label="Loại mã đối tác"
            value={
              PO_PARTNER_TYPE_DISPLAY[partner.partnerType] ??
              partner.partnerType
            }
          />
          <POFieldItem
            label="Mã đối tác"
            value={partner.partnerCode || "---"}
          />
        </Row>

        <POFieldItem
          label="Tên đối tác"
          value={partner.partnerName || "---"}
          fullWidth
        />

        {partner.supplier && (
          <>
            <POFieldItem
              label="Mã NCC"
              value={partner.supplier.code || "---"}
              fullWidth
            />
            <POFieldItem
              label="Tên NCC"
              value={partner.supplier.name || "---"}
              fullWidth
            />
          </>
        )}

        <View style={{ height: 40 }} />
      </Column>
    </BottomSheetScrollView>
  );
};

export default POPartnerDetailSheet;

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 20,
  },
});
