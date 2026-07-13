import moment from "moment";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Row, Spacer, Tag, Text } from "~/common";
import { Badge, MainItemInfo } from "~/components";
import { useTheme } from "~/hooks/useTheme";
import { PRItemData } from "~/services/pr/pr.type";
import globalStyle from "~/styles/global-style";
import PRItemSkeleton from "./PRItemSkeleton";

interface PRItemProps {
  item: PRItemData;
  onPress?: () => void;
  loading?: boolean;
  isApprove?: boolean;
}

const PRItem = ({ item, onPress, loading }: PRItemProps) => {
  const { colors } = useTheme();

  if (loading) return <PRItemSkeleton />;

  // Budget Status mapping
  const getBudgetDisplay = () => {
    if (item.budgetStatusName) {
      return {
        label: item.budgetStatusName,
        color: item.budgetStatusColor || colors.label,
        bgColor: item.budgetStatusBgColor || colors.surface,
      };
    }
    return null;
  };

  const getExternalMatGroupDisplay = (data: PRItemData): string => {
    if (!data) return "";

    // Admin logic: Handle Array first
    const arr = data.lstExternalMaterialGroup;
    if (Array.isArray(arr) && arr.length > 0) {
      const parts = arr
        .map((it) => {
          if (it?.code != null)
            return it.name ? `${it.code} - ${it.name}` : String(it.code);
          return it?.name != null ? String(it.name) : "";
        })
        .filter(Boolean);
      if (parts.length > 0) return parts.join(", ");
    }

    // Singular fields fallback (Admin logic)
    if (data.externalMatGroupCode) {
      return data.externalMatGroupName
        ? `${data.externalMatGroupCode} - ${data.externalMatGroupName}`
        : String(data.externalMatGroupCode);
    }
    if (data.externalMatGroupName) return String(data.externalMatGroupName);

    // Backward compatibility with previous mobile logic
    if (data.externalMaterialGroupName) return data.externalMaterialGroupName;

    return "";
  };

  const budgetInfo = getBudgetDisplay();
  const extMatGroup = getExternalMatGroupDisplay(item);

  const getSourceName = () => {
    if (item.sourceType === "PMS") return "Tạo từ PMS";
    if (item.sourceType === "SAP") return "Đồng bộ từ SAP";
    return item.sourceTypeName || "PMS";
  };

  return (
    <Card shadow style={globalStyle.item} onPress={onPress}>
      {/* 1. Status Tag Row (Col 2 & 3 with Inline Labels) */}
      <View style={globalStyle.tagRow}>
        <Badge
          label="Trạng thái"
          value={item.statusName}
          color={item.status === "W_A" ? colors.active : item.statusColor}
        />

        {budgetInfo && (
          <Badge
            label="Ngân sách"
            value={budgetInfo.label}
            color={budgetInfo.color}
          />
        )}
      </View>

      <Spacer size={12} />

      {/* 2. Identifier Section (Col 5, 6) */}
      <Row align="center" justify="space-between">
        <Row align="center" style={{ flex: 1 }}>
          <MainItemInfo title={item.code} />

          {item.sapCode && (
            <View
              style={[
                styles.sapBadge,
                { backgroundColor: colors.statusInfoBg },
              ]}
            >
              <Text size={13} bold color={colors.brandOrange}>
                SAP: {item.sapCode}
              </Text>
            </View>
          )}
        </Row>
      </Row>

      <Spacer size={12} />

      {/* 3. Metadata Tag Cloud (Consolidated Tags + Uses) */}
      <View style={globalStyle.tagRow}>
        {/* Col 8: Uses as a Tag (ALWAYS SHOW) */}
        <Tag
          icon="file-text"
          label="Mục đích"
          value={item.uses || "(Chưa có)"}
          fullWidth
          limit={120}
        />

        {/* Col 7: External Mat Group (ALWAYS SHOW) */}
        <Tag
          icon="package"
          label="External Mat Group"
          value={extMatGroup || "(Chưa có)"}
          fullWidth
          limit={100}
        />

        {/* Col 4, 9, 10, 11, 12, 13, 16 */}
        <Tag icon="map-pin" label="Plant" value={item.plantCode || "---"} />
        <Tag
          icon="users"
          label="Nhóm mua"
          value={item.purchasingGroupCode || "---"}
        />
        <Tag icon="tag" label="Chứng từ" value={item.prType || ""} />
        <Tag
          icon="user"
          label="Người tạo"
          value={`${item.createdByCode}${
            item.createdByName ? ` - ${item.createdByName}` : ""
          }`}
        />
        <Tag
          icon="clock"
          label="Ngày tạo"
          value={`${moment(item.createdAt).format("DD/MM/YYYY")} ${
            item.createdTimeAt ? moment(item.createdTimeAt).format("HH:mm") : ""
          }`}
        />
        <Tag icon="database" label="Nguồn" value={getSourceName()} />
        <Tag
          icon="check-circle"
          label="Release"
          value={item.approvalProgress || "0/0"}
          color={colors.brandOrange as string}
        />
      </View>

      <Spacer size={10} />
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />
      <Spacer size={10} />

      <View style={{ gap: 5 }}>
        <Row justify="space-between" align="center">
          <Text size={12} weight={"700"} color={colors.label}>
            TỔNG GIÁ TRỊ
          </Text>
          <Row align="baseline">
            <Text bold size={15} color={colors.title}>
              {item.totalValue
                ? Number(item.totalValue).toLocaleString("en-US")
                : "0"}
            </Text>
          </Row>
        </Row>

        <Row justify="space-between" align="center">
          <Text size={12} weight={"700"} color={colors.label}>
            NGÂN SÁCH THIẾU
          </Text>
          <Row align="baseline">
            <Text bold size={15} color={colors.title}>
              {item.budgetMissing
                ? Number(item.budgetMissing).toLocaleString("en-US")
                : "0"}
            </Text>
          </Row>
        </Row>
      </View>
    </Card>
  );
};

export default PRItem;

const styles = StyleSheet.create({
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  sapBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  divider: {
    height: 1,
  },
});
