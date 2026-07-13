import moment from "moment";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Row, Spacer, Tag } from "~/common";
import { Badge, MainItemInfo } from "~/components";
import { RESERVATION_STATUS } from "~/enums/reservation.enum";
import { useTheme } from "~/hooks/useTheme";
import { ReservationItemData } from "~/services/reservation/reservation.type";
import globalStyle from "~/styles/global-style";

interface Props {
  item: ReservationItemData;
  onPress: () => void;
  isApprove?: boolean;
}

const ReservationDemandItem = ({ item, onPress }: Props) => {
  const { colors } = useTheme();

  return (
    <Card shadow style={globalStyle.item} onPress={onPress}>
      <Spacer size={8} />

      <Row align="center" justify="space-between">
        <MainItemInfo
          title={`${item.reservationNo} ${
            item.sapCode ? `- ${item.sapCode}` : ""
          }`}
        />
        {/* sync from reservation.component.html:252-270 — nz-tag uses statusColor, statusBgColor, statusBorderColor from server */}
        <Badge
          label="Trạng thái"
          value={item.statusName || "---"}
          color={item.statusColor}
        />
      </Row>

      <Spacer size={12} />

      {/* 3. Metadata Tag Cloud - Matching reservation.component.html strictly */}
      <View style={globalStyle.tagRow}>
        <Tag
          icon="file-text"
          label="Số phiếu"
          value={item.reservationNo || "---"}
        />
        <Tag icon="hash" label="Mã SAP" value={item.sapCode || "---"} />
        <Tag icon="tag" label="Loại" value={item.sourceTypeName || "---"} />
        <Tag
          icon="calendar"
          label="Ngày tạo"
          value={
            item.createdAt ? moment(item.createdAt).format("DD/MM/YYYY") : "---"
          }
        />
        <Tag icon="map-pin" label="Nhà máy" value={item.plantName || "---"} />
        <Tag
          icon="briefcase"
          label="Công ty"
          value={item.companyCode || "---"}
        />
        <Tag
          icon="user"
          label="Người yêu cầu"
          value={item.requisitionerName || "---"}
        />
        <Tag
          icon="users"
          label="Phòng ban"
          value={item.departmentName || "---"}
        />
        {/* sync from reservation.component.html:564 → *ngIf="data.status !== enumDataStatus.A.code" */}
        {item.status !== RESERVATION_STATUS.APPROVED && (
          <Tag
            icon="check-circle"
            label="Release"
            value={item.approvalProgress || "-"}
            color={colors.brandOrange as string}
          />
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({});

export default ReservationDemandItem;
