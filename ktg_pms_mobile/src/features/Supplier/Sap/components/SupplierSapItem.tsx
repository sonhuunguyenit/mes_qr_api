import moment from "moment";

import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Card, Row, Skeleton, Spacer, Tag, Text } from "~/common";
import { Badge, MainItemInfo } from "~/components";
import { SupplierNumberAprovalStatus } from "~/enums/supplier.enum";
import { useTheme } from "~/hooks/useTheme";
import { SupplierSapItem as SupplierSapItemType } from "~/services/supplier/supplier.type";
import globalStyle from "~/styles/global-style";
import { ThemeType } from "~/styles/themes";

interface SupplierSapItemProps {
  item: SupplierSapItemType;
  onPress?: () => void;
}

const getStatusDisplay = (
  status: SupplierNumberAprovalStatus | string | undefined | null,
  themeColors: ThemeType["colors"]
) => {
  if (!status) {
    return {
      label: "---",
      color: themeColors.gray400,
      bgColor: themeColors.disabledBg,
      borderColor: themeColors.border,
    };
  }

  switch (status) {
    case SupplierNumberAprovalStatus.NEW:
      return {
        label: "Mới tạo",
        color: themeColors.statusInfoTitle,
        bgColor: themeColors.statusInfoBg,
        borderColor: themeColors.statusInfoBorder,
      };
    case SupplierNumberAprovalStatus.IMPORTING:
      return {
        label: "Đang nhập liệu",
        color: themeColors.blue1,
        bgColor: themeColors.lblueBg,
        borderColor: themeColors.lblueIcon,
      };
    case SupplierNumberAprovalStatus.PENDING:
      return {
        label: "Chờ duyệt",
        color: themeColors.statusWarningTitle,
        bgColor: themeColors.statusWarningBg,
        borderColor: themeColors.statusWarningBorder,
      };
    case SupplierNumberAprovalStatus.APPROVED:
      return {
        label: "Đã duyệt",
        color: themeColors.statusSuccessTitle,
        bgColor: themeColors.statusSuccessBg,
        borderColor: themeColors.statusSuccessBorder,
      };
    case SupplierNumberAprovalStatus.RECHECK:
      return {
        label: "Kiểm tra lại",
        color: themeColors.statusErrorTitle,
        bgColor: themeColors.statusErrorBg,
        borderColor: themeColors.statusErrorBorder,
      };
    case SupplierNumberAprovalStatus.ERROR:
      return {
        label: "Lỗi đồng bộ",
        color: themeColors.statusErrorDark,
        bgColor: themeColors.statusErrorBg,
        borderColor: themeColors.statusErrorBorder,
      };
    default:
      return {
        label: String(status),
        color: themeColors.gray400,
        bgColor: themeColors.disabledBg,
        borderColor: themeColors.border,
      };
  }
};

const SupplierSapItem = ({ item, onPress }: SupplierSapItemProps) => {
  const { colors: themeColors } = useTheme();

  const statusDisplay = useMemo(() => {
    const display = getStatusDisplay(item.approvalStatus, themeColors);
    return {
      ...display,
      label: display.label || "---",
    };
  }, [item.approvalStatus, themeColors]);

  return (
    <Card shadow={false} style={globalStyle.item} onPress={onPress}>
      <View style={globalStyle.tagRow}>
        <Badge
          label="Trạng thái nhập liệu"
          value={statusDisplay.label}
          color={statusDisplay.color as string}
          showDot={true}
        />
      </View>

      <Spacer size={12} />

      <Row align="center" justify="space-between">
        <Row align="center" style={{ flex: 1 }}>
          <MainItemInfo title={item.supplierName} numberOfLines={2} />
        </Row>
      </Row>

      <Spacer size={12} />

      <View style={globalStyle.tagRow}>
        <Tag
          icon="hash"
          label="Mã số doanh nghiệp"
          value={item.supplierCode}
          color={themeColors.active as string}
        />
        {item.bpnumber && (
          <Tag
            icon="database"
            label="Mã BP Number"
            value={item.bpnumber}
            color={themeColors.info as string}
          />
        )}
        <Tag
          icon="briefcase"
          label="Công ty"
          value={item.companyName || "---"}
          fullWidth
        />
        {item.businessTypeName && (
          <Tag
            icon="info"
            label="Loại hình doanh nghiệp"
            value={item.businessTypeName}
            fullWidth
          />
        )}
        <Tag
          icon="clock"
          label="Ngày tạo"
          value={moment(item.createdAt).format("DD/MM/YYYY")}
        />
        <Tag
          icon="user"
          label="Người tạo"
          value={item.createdByName || item.createdBy}
        />
      </View>
    </Card>
  );
};

export default SupplierSapItem;
import SupplierSapItemSkeleton from "./SupplierSapItemSkeleton";

export { SupplierSapItemSkeleton };

const styles = StyleSheet.create({});
