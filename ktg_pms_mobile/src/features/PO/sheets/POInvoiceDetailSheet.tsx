import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { Linking, TouchableOpacity, View } from "react-native";
import { Column, Row, Text } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";
import { InvoiceItem } from "~/services/invoice/invoice.type";

interface POInvoiceDetailSheetProps {
  data: InvoiceItem;
  onClose: () => void;
}

const POInvoiceDetailSheet = ({ data }: POInvoiceDetailSheetProps) => {
  const { colors, spacing } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="detail" />

      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <Row>
            <ColumnInfo label="Số hóa đơn" value={data.code} />
            <ColumnInfo
              label="File hóa đơn"
              value={
                data.fileXml ? (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(String(data.fileXml))}
                  >
                    <Text
                      bold
                      color={colors.primary}
                      style={{ textDecorationLine: "underline" }}
                    >
                      Xem file
                    </Text>
                  </TouchableOpacity>
                ) : (
                  "---"
                )
              }
            />
          </Row>

          <Row>
            <ColumnInfo label="Đơn vị tiền tệ" value={data.currencyName} />
            <ColumnInfo label="Trị giá" value={data.invoiceValue} />
          </Row>

          <Row>
            <ColumnInfo label="Thuế VAT" value={data.vat} />
            <ColumnInfo label="Tổng trị giá" value={data.totalInvoiceValue} />
          </Row>

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

export default POInvoiceDetailSheet;
