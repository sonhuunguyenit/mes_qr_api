import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Icon } from "@rneui/themed";
import React from "react";
import { StyleSheet, TouchableOpacity, View, Linking } from "react-native";
import { Column, Row, Spacer, Text } from "~/common";
import { useTheme } from "~/hooks/useTheme";
import { InvoiceItem } from "~/services/invoice/invoice.type";

interface POInvoiceDetailSheetProps {
  data: InvoiceItem;
  onClose: () => void;
}

const POInvoiceDetailSheet = ({ data, onClose }: POInvoiceDetailSheetProps) => {
  const { colors } = useTheme();

  const DetailItem = ({
    label,
    value,
    isLink,
  }: {
    label: string;
    value?: string | number;
    isLink?: boolean;
  }) => (
    <View style={styles.detailItem}>
      <Text size={12} color={colors.label} style={styles.label}>
        {label}
      </Text>
      {isLink && value ? (
        <TouchableOpacity onPress={() => Linking.openURL(String(value))}>
          <Text
            bold
            size={14}
            color={colors.primary}
            style={{ textDecorationLine: "underline" }}
          >
            Xem file
          </Text>
        </TouchableOpacity>
      ) : (
        <Text bold size={14} color={colors.title}>
          {value?.toLocaleString() || "---"}
        </Text>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Icon name="info" type="feather" size={22} color={colors.primary} />
        <Text bold size={16} color={colors.title}>
          Chi tiết hóa đơn
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Icon name="x" type="feather" size={24} color={colors.label} />
        </TouchableOpacity>
      </View>

      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Column gap={16}>
          <Row full gap={12}>
            <View style={{ flex: 1 }}>
              <DetailItem label="Số hóa đơn" value={data.code} />
            </View>
            <View style={{ flex: 1 }}>
              <DetailItem label="File hóa đơn" value={data.fileXml} isLink />
            </View>
          </Row>

          <Row full gap={12}>
            <View style={{ flex: 1 }}>
              <DetailItem label="Đơn vị tiền tệ" value={data.currencyName} />
            </View>
            <View style={{ flex: 1 }}>
              <DetailItem label="Trị giá" value={data.invoiceValue} />
            </View>
          </Row>

          <Row full gap={12}>
            <View style={{ flex: 1 }}>
              <DetailItem label="Thuế VAT" value={data.vat} />
            </View>
            <View style={{ flex: 1 }}>
              <DetailItem label="Tổng trị giá" value={data.totalInvoiceValue} />
            </View>
          </Row>

          <Row full gap={12}>
            <View style={{ flex: 1 }}>
              <DetailItem label="Trạng thái" value={data.statusName} />
            </View>
          </Row>
        </Column>
        <Spacer size={30} />
      </BottomSheetScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
  },
  detailItem: {
    marginBottom: 8,
  },
  label: {
    marginBottom: 4,
  },
});

export default POInvoiceDetailSheet;
