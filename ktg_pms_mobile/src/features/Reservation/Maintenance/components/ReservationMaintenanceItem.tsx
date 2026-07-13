import moment from "moment";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Row, Spacer, Tag } from "~/common";
import { Badge, MainItemInfo } from "~/components";
import { useTheme } from "~/hooks/useTheme";

import { ReservationItemData } from "../../../../services/reservation/reservation.type";
import globalStyle from "../../../../styles/global-style";

interface Props {
  item: ReservationItemData;
  onPress: () => void;
}

const ReservationMaintenanceItem = ({ item, onPress }: Props) => {
  const { colors } = useTheme();

  return (
    <Card shadow style={globalStyle.item} onPress={onPress}>
      <Spacer size={8} />

      <Row align="center" justify="space-between">
        <MainItemInfo title={item.code} />
        <Badge
          label="Trạng thái"
          value={item.statusName || "---"}
          color={item.statusColor || colors.active}
        />
      </Row>

      <Spacer size={12} />

      {/* Metadata Tag Cloud - Matching Web Admin columns for Maintenance strictly */}
      <View style={globalStyle.tagRow}>
        <Tag
          icon="file-text"
          label="Mô tả đơn hàng"
          value={item.order_des || "---"}
        />
        <Tag icon="hash" label="Mã PM" value={item.order_id || "---"} />
        <Tag icon="tag" label="Loại" value={item.orderType || "---"} />
        <Tag icon="tool" label="Thiết bị" value={item.equipment || "---"} />
        <Tag
          icon="user"
          label="Người yêu cầu"
          value={item.createdByName || "---"}
        />
        <Tag
          icon="users"
          label="Phòng ban"
          value={item.departmentName || "---"}
        />
        <Tag
          icon="calendar"
          label="Ngày lập"
          value={
            item.notiDate ? moment(item.notiDate).format("DD/MM/YYYY") : "---"
          }
        />
        <Tag
          icon="user-check"
          label="Người duyệt HT"
          value={item.currentApprover || "-"}
        />
        <Tag
          icon="check-circle"
          label="Release"
          value={item.approvalProgress || "-"}
          color={colors.brandOrange as string}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({});

export default ReservationMaintenanceItem;
