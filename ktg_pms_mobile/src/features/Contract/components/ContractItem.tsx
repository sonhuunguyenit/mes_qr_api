import React, { memo } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Card, Row, Spacer, Text, Tag } from "~/common";
import { Badge, MainItemInfo } from "~/components";
import { ContractStatus, ContractStatusConfig } from "~/enums/contract.enum";
import { useTheme } from "~/hooks/useTheme";
import { ContractItemDto } from "~/services/contract/contract.type";
import DateHelper from "~/utils/date";
import NumberHelper from "~/utils/number";
import globalStyle from "~/styles/global-style";

interface ContractItemProps {
  item: ContractItemDto;
  onPress: (item: ContractItemDto) => void;
  onApprove?: (item: ContractItemDto) => void;
  onReject?: (item: ContractItemDto) => void;
  isLoading?: boolean;
}

const ContractItem = ({
  item,
  onPress,
  onApprove,
  onReject,
  isLoading,
}: ContractItemProps) => {
  const { colors } = useTheme();

  const handleApprove = () => onApprove?.(item);
  const handleReject = () => onReject?.(item);

  const statusConfig = ContractStatusConfig[item.status as ContractStatus] || {
    name: item.status,
    color: colors.active,
  };

  return (
    <Card shadow={false} style={globalStyle.item} onPress={() => onPress(item)}>
      {/* 1. Status Tag Row */}
      <View style={globalStyle.tagRow}>
        <Badge
          label="Trạng thái"
          value={statusConfig.name}
          color={statusConfig.color}
          showDot={true}
        />
      </View>

      <Spacer size={12} />

      {/* 2. Title Row (Supplier Name) */}
      <Row align="center" justify="space-between">
        <Row align="center" style={{ flex: 1 }}>
          <MainItemInfo title={item.supplierName || "---"} />
        </Row>
      </Row>

      <Spacer size={12} />

      {/* 3. 12 columns requested by user */}
      <View style={globalStyle.tagRow}>
        <Tag
          icon="hash"
          label="Mã PMS"
          value={item.code || item.contractNumber || "---"}
        />
        <Tag icon="hash" label="Mã SAP" value={item.sapCode || "---"} />
        <Tag
          icon="file-text"
          label="Tên hợp đồng"
          value={item.name || "---"}
          fullWidth
        />
        <Tag
          icon="tag"
          label="Loại hợp đồng"
          value={item.contractTypeName || "---"}
          fullWidth
        />
        <Tag
          icon="briefcase"
          label="Công ty mua"
          value={item.companyCode || "---"}
          fullWidth
        />
        <Tag
          icon="shopping-cart"
          label="Đề nghị mua hàng"
          value={item.recommendedPurchaseName || "---"}
          fullWidth
        />
        <Tag
          icon="users"
          label="Nhà cung cấp"
          value={item.supplierName || "---"}
          fullWidth
        />
        <Tag
          icon="dollar-sign"
          label="Giá trị"
          value={
            item.contractValueAfterTax
              ? NumberHelper.formatMoney(item.contractValueAfterTax)
              : "---"
          }
          fullWidth
        />
        <Tag
          icon="calendar"
          label="Hiệu lực"
          value={
            item.effectiveDate || item.expiredDate
              ? `${
                  item.effectiveDate
                    ? DateHelper.formatDate(item.effectiveDate, "DD/MM/YYYY")
                    : "---"
                } - ${
                  item.expiredDate
                    ? DateHelper.formatDate(item.expiredDate, "DD/MM/YYYY")
                    : "---"
                }`
              : "---"
          }
          fullWidth
        />
        <Tag
          icon="user"
          label="Người tạo / Ngày tạo"
          value={`${item.createdByName || "---"} - ${
            item.createdAt
              ? DateHelper.formatDate(item.createdAt, "DD/MM/YYYY")
              : "---"
          }`}
          fullWidth
        />
      </View>

      {(onApprove || onReject) && (
        <>
          <Spacer size={12} />
          <View style={styles.actionRow}>
            {onApprove && (
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.approveButton,
                  {
                    borderColor: colors.statusSuccess as string,
                    backgroundColor: (colors.statusSuccess as string) + "15",
                  },
                ]}
                onPress={handleApprove}
                disabled={isLoading}
              >
                <Text bold color={colors.statusSuccess as string} size={13}>
                  Duyệt
                </Text>
              </TouchableOpacity>
            )}
            {onReject && (
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.rejectButton,
                  {
                    borderColor: colors.statusError as string,
                    backgroundColor: (colors.statusError as string) + "15",
                  },
                ]}
                onPress={handleReject}
                disabled={isLoading}
              >
                <Text bold color={colors.statusError as string} size={13}>
                  Từ chối
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
    </Card>
  );
};

export default memo(ContractItem);

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: "row",
    paddingTop: 10,
    borderTopWidth: 1,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  approveButton: {},
  rejectButton: {},
});
