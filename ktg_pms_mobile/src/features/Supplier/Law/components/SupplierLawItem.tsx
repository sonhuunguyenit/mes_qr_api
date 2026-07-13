import React, { memo } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Card, Row, Spacer, Text, Tag } from "~/common";
import { Badge, MainItemInfo } from "~/components";
import { SUPPLIER_LAW_STATUS_CONFIG } from "~/enums/supplier-law.enum";
import { useTheme } from "~/hooks/useTheme";
import { SupplierLawItem as ISupplierLawItem } from "~/services/supplier/supplier-law.type";
import DateHelper from "~/utils/date";
import globalStyle from "~/styles/global-style";

interface SupplierLawItemProps {
  item: ISupplierLawItem;
  onPress: (item: ISupplierLawItem) => void;
  onApprove?: (item: ISupplierLawItem) => void;
  onReject?: (item: ISupplierLawItem) => void;
  isLoading?: boolean;
}

const SupplierLawItem = ({
  item,
  onPress,
  onApprove,
  onReject,
  isLoading,
}: SupplierLawItemProps) => {
  const { colors } = useTheme();

  const handleApprove = () => onApprove?.(item);
  const handleReject = () => onReject?.(item);

  return (
    <Card shadow={false} style={globalStyle.item} onPress={() => onPress(item)}>
      <View style={globalStyle.tagRow}>
        <Badge
          label="Trạng thái"
          value={
            SUPPLIER_LAW_STATUS_CONFIG[item.status]?.label || item.statusName
          }
          color={
            SUPPLIER_LAW_STATUS_CONFIG[item.status]?.color || colors.active
          }
          showDot={true}
        />
      </View>

      <Spacer size={12} />

      <Row align="center" justify="space-between">
        <Row align="center" style={{ flex: 1 }}>
          <MainItemInfo
            title={item.supplierName || item.supplierInfo?.name || "---"}
          />
        </Row>
      </Row>

      <Spacer size={12} />

      <View style={globalStyle.tagRow}>
        <Tag
          icon="hash"
          label="Mã phiếu điều chỉnh"
          value={item.code || "---"}
          fullWidth
        />
        <Tag
          icon="file-text"
          label="Mã số doanh nghiệp"
          value={item.taxCode || item.supplierInfo?.code || "---"}
          fullWidth
        />
        <Tag
          icon="briefcase"
          label="Loại hình"
          value={item.businessTypeName || "---"}
          fullWidth
        />
        <Tag
          icon="calendar"
          label="Ngày yêu cầu"
          value={DateHelper.formatDate(item.createdAt, "DD/MM/YYYY")}
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

export default memo(SupplierLawItem);

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
