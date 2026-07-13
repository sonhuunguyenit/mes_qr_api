import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { View, Linking, TouchableOpacity } from "react-native";
import { Column, Row, Text } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";

interface SupplierBankDetailSheetProps {
  item: any;
}

export const SupplierBankDetailSheet = ({
  item,
}: SupplierBankDetailSheetProps) => {
  const { spacing, colors } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="detail" />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <Row>
            <ColumnInfo label="Quốc gia" value={item.countryName || "---"} />
            <ColumnInfo label="Tỉnh thành" value={item.regionName || "---"} />
          </Row>

          <ColumnInfo label="Ngân hàng" value={item.bankName || "---"} full />
          <ColumnInfo label="Chi nhánh" value={item.bankBranchName || "---"} full />

          <Row>
            <ColumnInfo label="STK ngân hàng" value={item.bankNumber || "---"} />
            <ColumnInfo label="STK bổ sung" value={item.accountNumber || "---"} />
          </Row>

          <ColumnInfo label="Chủ thẻ" value={item.bankUsername || "---"} full />

          <Row>
            <ColumnInfo label="Swift Code" value={item.swiftCode || "---"} />
            <ColumnInfo label="IBAN" value={item.iban || "---"} />
          </Row>

          <ColumnInfo
            label="File thông báo"
            value={
              item.fileAccount ? (
                <TouchableOpacity onPress={() => Linking.openURL(item.fileAccount)}>
                  <Text color={colors.active} bold>Xem file</Text>
                </TouchableOpacity>
              ) : (
                "---"
              )
            }
            full
          />

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};
