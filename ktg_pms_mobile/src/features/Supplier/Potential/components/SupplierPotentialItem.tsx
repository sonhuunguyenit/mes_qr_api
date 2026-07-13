import moment from "moment";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Row, Spacer, Text, Tag } from "~/common";
import { Badge, MainItemInfo } from "~/components";
import { SupplierPotentialItem as SupplierPotentialItemType } from "~/services/supplier/supplier.type";
import { useTheme } from "~/hooks/useTheme";
import globalStyle from "~/styles/global-style";
import {
  SupplierNumberAprovalStatus,
  SUPPLIER_NUMBER_APPROVAL_STATUS_CONFIG,
  SUPPLIER_POTENTIAL_UPGRADE_STATUS_CONFIG,
} from "~/enums/supplier.enum";

interface Props {
  item: SupplierPotentialItemType;
  onPress?: () => void;
}

const SupplierPotentialItem = ({ item, onPress }: Props) => {
  const { colors } = useTheme();

  const getSapStatusInfo = () => {
    const status = item.sapStatus as SupplierNumberAprovalStatus;
    const config = SUPPLIER_NUMBER_APPROVAL_STATUS_CONFIG[status];

    if (config) {
      return { label: config.label, color: config.color };
    }

    return { label: "Chưa được nhập liệu", color: colors.space };
  };

  const sapInfo = getSapStatusInfo();

  return (
    <Card shadow={false} style={globalStyle.item} onPress={onPress}>
      {/* 1. Nhóm Badge Trạng thái & SAP Code */}
      <View style={globalStyle.tagRow}>
        <Row gap={8} align="center">
          <Badge
            label="Trạng thái"
            value={
              SUPPLIER_POTENTIAL_UPGRADE_STATUS_CONFIG[item.status]?.label ||
              item.statusName ||
              "---"
            }
            color={
              SUPPLIER_POTENTIAL_UPGRADE_STATUS_CONFIG[item.status]?.color ||
              colors.active
            }
          />
          {item.sapCode && (
            <Badge label="Mã SAP" value={item.sapCode} color={colors.info} />
          )}
        </Row>
        <Badge
          label="Trạng thái SAP"
          value={sapInfo.label}
          color={sapInfo.color}
        />
      </View>

      <Spacer size={12} />


      <Row align="center" justify="space-between">
        <Row align="center" style={{ flex: 1 }}>
          <MainItemInfo title={item.supplierName || item.name} />
        </Row>
      </Row>

      <Spacer size={12} />


      {/* 3. Đám mây dữ liệu (Tags - 100% Label Parity) */}
      <View style={globalStyle.tagRow}>
        <Tag
          icon="hash"
          label="Mã số doanh nghiệp"
          value={item.code || item.supplierCode || "---"}
        />
        {item.companyCode && (
          <Tag icon="layers" label="Company Code" value={item.companyCode} />
        )}
        {item.purchasingGroupName && (
          <Tag
            icon="shopping-bag"
            label="Purchasing Group"
            value={item.purchasingGroupName}
          />
        )}
        {item.businessTypeName && (
          <Tag
            icon="briefcase"
            label="Loại hình doanh nghiệp"
            value={item.businessTypeName}
          />
        )}
        <Tag
          icon="award"
          label="Xếp loại NCC"
          value={item.supplierGrade || "Nhà cung cấp tiềm năng"}
        />
        <Tag
          icon="user-plus"
          label="Người tạo"
          value={item.createdByName || item.createdBy || "---"}
        />
        {item.handlerName && (
          <Tag
            icon="user-check"
            label="Người đang thực hiện"
            value={item.handlerName}
          />
        )}
        <Tag
          icon="calendar"
          label="Ngày đăng ký"
          value={moment(item.createdAt).format("DD/MM/YYYY")}
        />
      </View>

      <Spacer size={10} />
      <View style={styles.divider} />
      <Spacer size={10} />

      {/* 4. Chỉ số chân trang (Web Labels) */}
      <Row justify="space-between" align="center">
        <Row align="center" style={{ flex: 1 }}>
          <Row align="center">
            <Text bold size={12} color={colors.label}>
              ĐIỂM ĐÁNH GIÁ:
            </Text>
            <Spacer size={4} horizontal />
            <Text bold size={12} color={colors.active}>
              {item.score ?? "---"}
            </Text>
          </Row>
          <Spacer size={8} horizontal />
          <Row align="center">
            <Text bold size={12} color={colors.label}>
              SỐ LVKD:
            </Text>
            <Spacer size={4} horizontal />
            <Text bold size={12} color={colors.title}>
              {item.totalSupplierService ?? 0}
            </Text>
          </Row>
          <Spacer size={8} horizontal />
          <Row align="center">
            <Text bold size={12} color={colors.label}>
              RELEASE:
            </Text>
            <Spacer size={4} horizontal />
            <Text bold size={12} color={colors.error}>
              {item.releaseStatus || "0/1"}
            </Text>
          </Row>
        </Row>
      </Row>
    </Card>
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
  },
});

export default SupplierPotentialItem;
