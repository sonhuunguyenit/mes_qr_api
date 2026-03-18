import { Icon } from "@rneui/base";
import moment from "moment";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Badge } from "~/components";
import { Card, Row, Spacer, Tag, Text } from "~/common";
import { useTheme } from "~/hooks/useTheme";
import { POItemData } from "~/services/po/po.type";

interface POItemProps {
  item: POItemData;
  onPress?: () => void;
  isApprove?: boolean;
}

const POItem = ({ item, onPress, isApprove }: POItemProps) => {
  const { colors } = useTheme();

  return (
    <Card shadow={false} style={styles.card} padding={10} onPress={onPress}>
      {/* 1. Status Tag Row */}
      <View style={styles.tagRow}>
        <Badge
          label="Trạng thái PO"
          value={item.statusName}
          color={item.statusColor || "#F3AF2B"}
        />
        {item.budgetStatusName && (
          <Badge
            label="Ngân sách"
            value={item.budgetStatusName}
            color={item.budgetStatusColor || colors.secondary}
          />
        )}
      </View>

      <Spacer size={12} />

      {/* 2. Identifier Section */}
      <Row align="center" justify="space-between">
        <Row align="center" style={{ flex: 1 }}>
          <View
            style={[
              styles.iconBox,
              { backgroundColor: colors.white, marginRight: 10 },
            ]}
          >
            <Icon
              name={isApprove ? "bell" : "file-text"}
              type="feather"
              size={16}
              color={"#F3AF2B"}
            />
          </View>
          <Text bold size={16} color={colors.title}>
            {item.code}
          </Text>
          {item.codeSap && (
            <View style={styles.sapBadge}>
              <Text size={13} bold color={"#F3AF2B"}>
                SAP: {item.codeSap}
              </Text>
            </View>
          )}
        </Row>
      </Row>

      <Spacer size={12} />

      {/* 3. Metadata Tag Cloud */}
      <View style={styles.tagRow}>
        <Tag
          icon="truck"
          label="NCC"
          value={item.supplierName || "(Chưa có)"}
          fullWidth
          limit={120}
        />

        <Tag
          icon="tag"
          label="Nguồn Tham Chiếu"
          value={item.referenceSourceTypeName || "---"}
        />

        <Tag
          icon="file"
          label="Chứng Từ Tham Chiếu"
          value={item.referenceSourceNumbers || "---"}
          fullWidth
        />

        <Tag
          icon="dollar-sign"
          label="Đơn vị tiền tệ"
          value={item.currencyCode || "VND"}
        />

        <Tag
          icon="briefcase"
          label="Công Ty"
          value={item.companyName || "---"}
          fullWidth
        />

        <Tag
          icon="user"
          label="Người tạo"
          value={item.createdByName || "---"}
        />
        <Tag
          icon="clock"
          label="Ngày tạo"
          value={moment(item.createdAt).format("DD/MM/YYYY")}
        />
        <Tag
          icon="check-circle"
          label="Release"
          value={item.approvalProgress || "0/0"}
          color={"#F3AF2B"}
        />
      </View>

      <Spacer size={12} />
      <View style={styles.divider} />
      <Spacer size={12} />

      {/* 4. Total Value */}
      <View>
        <Row justify="space-between" align="center">
          <Text size={11} bold color={colors.label}>
            TRỊ GIÁ PO
          </Text>
          <Row align="baseline">
            <Text bold size={16} color={colors.title}>
              {item.totalPO
                ? Number(item.totalPO).toLocaleString("en-US")
                : "0"}
            </Text>
            <Spacer size={4} horizontal />
            <Text size={12} bold color={colors.label}>
              {item.currencyCode || "VND"}
            </Text>
          </Row>
        </Row>
      </View>
    </Card>
  );
};

export default POItem;

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
    borderColor: "#F1F5F9",
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  sapBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
  },
});
