import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { View } from "react-native";
import { Column, Row } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { PO_FUNCTION_DISPLAY, PO_PARTNER_TYPE_DISPLAY } from "~/enums/po.enum";
import { useTheme } from "~/hooks/useTheme";
import { POPartner } from "~/services/po/po.type";

interface POPartnerDetailSheetProps {
  partner: POPartner;
}

const POPartnerDetailSheet = ({ partner }: POPartnerDetailSheetProps) => {
  const { spacing } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="detail" />

      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <Row>
            <ColumnInfo
              label="Mã chức năng đối tác"
              value={partner.partnerFunctionCode || "---"}
            />
            <ColumnInfo
              label="Chức năng đối tác"
              value={
                PO_FUNCTION_DISPLAY[partner.partnerFunctionCode] ??
                partner.partnerFunctionCode
              }
            />
          </Row>

          <Row>
            <ColumnInfo
              label="Loại mã đối tác"
              value={
                PO_PARTNER_TYPE_DISPLAY[partner.partnerType] ??
                partner.partnerType
              }
            />
            <ColumnInfo
              label="Mã đối tác"
              value={partner.partnerCode || "---"}
            />
          </Row>

          <ColumnInfo
            label="Tên đối tác"
            value={partner.partnerName || "---"}
            full
            last={!partner.supplier}
          />

          {partner.supplier && (
            <>
              <ColumnInfo
                label="Mã NCC"
                value={partner.supplier.code || "---"}
                full
              />
              <ColumnInfo
                label="Tên NCC"
                value={partner.supplier.name || "---"}
                full
                last
              />
            </>
          )}

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};

export default POPartnerDetailSheet;
