import moment from "moment";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Row, Spacer, Tag, Text } from "~/common";
import { Badge, MainItemInfo } from "~/components";
import { useTheme } from "~/hooks/useTheme";
import { MaterialItemData } from "~/services/material/material.type";
import { MATERIAL_STATUS_CONFIG, MATERIAL_ACTIVE_STATUS_CONFIG } from "~/enums/material.enum";
import globalStyle from "~/styles/global-style";
import MaterialApprovalItemSkeleton from "./MaterialApprovalItemSkeleton";

interface MaterialApprovalItemProps {
  item: MaterialItemData;
  onPress?: () => void;
  loading?: boolean;
}

const MaterialApprovalItem = ({
  item,
  onPress,
  loading,
}: MaterialApprovalItemProps) => {
  const { colors } = useTheme();

  if (loading) return <MaterialApprovalItemSkeleton />;

  const statusConfig = MATERIAL_STATUS_CONFIG[item.status] || {
    label: item.statusName || item.status,
    color: item.statusColor || colors.brandOrange,
    bgColor: item.statusBgColor || colors.surface,
  };

  const activeConfig = item.isDeleted
    ? MATERIAL_ACTIVE_STATUS_CONFIG.inactive
    : MATERIAL_ACTIVE_STATUS_CONFIG.active;

  const approvalWriteBlockTags = [
    { field: "isWriteGenaral", label: "GEN" },
    { field: "isWriteSales", label: "SALE" },
    { field: "isWritePurchase", label: "PURC" },
    { field: "isWriteMRP", label: "MRP" },
    { field: "isWriteQM", label: "QM" },
    { field: "isWriteAccounting", label: "ACCT" },
    { field: "isWriteCosting", label: "COST" },
    { field: "isWriteCoProduct", label: "CO-PRD" },
    { field: "isWriteWms", label: "WMS" },
  ] as const;

  return (
    <Card shadow style={globalStyle.item} onPress={onPress}>
      {/* 1. Status Badges Row */}
      <View style={globalStyle.tagRow}>
        <Badge
          label="Duyệt"
          value={statusConfig.label}
          color={statusConfig.color}
          backgroundColor={statusConfig.bgColor}
        />
        <Badge
          label="Hoạt động"
          value={activeConfig.label}
          color={activeConfig.color}
          backgroundColor={activeConfig.bgColor}
        />
      </View>

      <Spacer size={10} />

      {/* 2. Item Code & Main Identifier */}
      <Row align="center" justify="space-between">
        <Row align="center" style={{ flex: 1 }}>
          <MainItemInfo title={item.code} />
          {item.plantCode && (
            <View
              style={[
                styles.plantBadge,
                {
                  backgroundColor: colors.statusInfoBg || "#EAF2FF",
                },
              ]}
            >
              <Text size={12} bold color={colors.brandOrange || "#FF9F43"}>
                PLANT: {item.plantCode}
              </Text>
            </View>
          )}
        </Row>
      </Row>

      <Spacer size={8} />

      {/* 3. Name of Material */}
      <Text size={14} weight="700" color={colors.title} style={styles.nameText}>
        {item.name}
      </Text>

      <Spacer size={10} />

      {/* 4. Metadata Details (All fields from web columns) */}
      <View style={globalStyle.tagRow}>
        <Tag
          icon="package"
          label="Nhóm vật tư"
          value={item.matGroup || "---"}
        />
        <Tag
          icon="layers"
          label="Ext.Mat.Group"
          value={item.externalMaterialGroupCode || "---"}
        />
        <Tag
          icon="grid"
          label="Division"
          value={item.divisionTCode || "---"}
        />
        <Tag
          icon="user"
          label="Người yêu cầu"
          value={item.createdByName || "---"}
        />
        <Tag
          icon="clock"
          label="Ngày yêu cầu"
          value={
            item.createdAt
              ? moment(item.createdAt).format("DD/MM/YYYY")
              : "---"
          }
        />
        <Tag
          icon="lock"
          label="Ngày khóa"
          value={
            item.blockAllDate
              ? moment(item.blockAllDate).format("DD/MM/YYYY HH:mm:ss")
              : "---"
          }
        />
      </View>

      <Spacer size={12} />
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />
      <Spacer size={10} />

      {/* 5. Trạng thái nhập liệu (Write block status chips) */}
      <Text size={12} weight="700" color={colors.label} style={{ marginBottom: 6 }}>
        TRẠNG THÁI NHẬP LIỆU:
      </Text>

      <View style={styles.blockContainer}>
        {approvalWriteBlockTags.map((block) => {
          const isLocked = item[block.field] === true;
          return (
            <View
              key={block.field}
              style={[
                styles.blockChip,
                {
                  backgroundColor: isLocked ? "#f6ffed" : "#fafafa",
                  borderColor: isLocked ? "#52c41a" : "#d9d9d9",
                },
              ]}
            >
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: isLocked ? "#52c41a" : "#bfbfbf",
                  },
                ]}
              />
              <Text
                size={10}
                weight="700"
                color={isLocked ? "#52c41a" : "#8c8c8c"}
              >
                {block.label}
              </Text>
            </View>
          );
        })}
      </View>
    </Card>
  );
};

export default MaterialApprovalItem;

const styles = StyleSheet.create({
  plantBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  nameText: {
    lineHeight: 18,
  },
  divider: {
    height: 1,
  },
  blockContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  blockChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
