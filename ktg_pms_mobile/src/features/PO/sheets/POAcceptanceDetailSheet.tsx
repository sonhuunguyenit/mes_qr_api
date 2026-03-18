import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Icon } from "@rneui/themed";
import moment from "moment";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Column, Row, Spacer, Text } from "~/common";
import { useTheme } from "~/hooks/useTheme";
import { AcceptanceItem } from "~/services/acceptance/acceptance.type";

interface POAcceptanceDetailSheetProps {
  data: AcceptanceItem;
  onClose: () => void;
}

const POAcceptanceDetailSheet = ({
  data,
  onClose,
}: POAcceptanceDetailSheetProps) => {
  const { colors } = useTheme();

  const DetailItem = ({
    label,
    value,
  }: {
    label: string;
    value?: string | number;
  }) => (
    <View style={styles.detailItem}>
      <Text size={12} color={colors.label} style={styles.label}>
        {label}
      </Text>
      <Text bold size={14} color={colors.title}>
        {value || "---"}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Icon name="info" type="feather" size={22} color={colors.primary} />
        <Text bold size={16} color={colors.title}>
          Chi tiết nghiệm thu
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
          <DetailItem
            label="Số biên bản nghiệm thu"
            value={data.acceptanceNumber}
          />

          <DetailItem
            label="Đối tượng nghiệm thu"
            value={data.acceptanceObject}
          />

          <Row full gap={12}>
            <View style={{ flex: 1 }}>
              <DetailItem
                label="Ngày nghiệm thu"
                value={
                  data.handoverTime
                    ? moment(data.handoverTime).format("DD/MM/YYYY")
                    : "---"
                }
              />
            </View>
            <View style={{ flex: 1 }}>
              <DetailItem label="Người nghiệm thu" value={data.employeeName} />
            </View>
          </Row>

          <DetailItem
            label="Kết quả nghiệm thu"
            value={data.acceptanceResults}
          />

          {data.statusName && (
            <DetailItem label="Trạng thái" value={data.statusName} />
          )}
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

export default POAcceptanceDetailSheet;
