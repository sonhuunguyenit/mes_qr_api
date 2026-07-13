import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { Card, Row, Spacer, Tag, Text } from "~/common";
import { Badge, MainItemInfo } from "~/components";
import { SUPPLIER_LAW_STATUS_CONFIG } from "~/enums/supplier-law.enum";
import { useTheme } from "~/hooks/useTheme";
import { SupplierCapacityItem as ISupplierCapacityItem } from "~/services/supplier/supplier-capacity.type";
import DateHelper from "~/utils/date";
import globalStyle from "~/styles/global-style";

interface SupplierCapacityItemProps {
  item: ISupplierCapacityItem;
  onPress: (item: ISupplierCapacityItem) => void;
  isLoading?: boolean;
}

const SupplierCapacityItem = ({
  item,
  onPress,
  isLoading,
}: SupplierCapacityItemProps) => {
  const { colors } = useTheme();

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
          icon="file-text"
          label="Mã doanh nghiệp"
          value={item.supplierInfo?.code || item.taxCode || "---"}
          fullWidth
        />
        <Tag
          icon="briefcase"
          label="Lĩnh vực"
          value={item.serviceName || "---"}
          fullWidth
        />
        <Tag
          icon="layers"
          label="Loại hình"
          value={item.businessTypeName || "---"}
        />
        <Tag
          icon="calendar"
          label="Ngày yêu cầu"
          value={DateHelper.formatDate(item.createdAt, "DD/MM/YYYY")}
        />
      </View>
    </Card>
  );
};

export default memo(SupplierCapacityItem);

const styles = StyleSheet.create({});
