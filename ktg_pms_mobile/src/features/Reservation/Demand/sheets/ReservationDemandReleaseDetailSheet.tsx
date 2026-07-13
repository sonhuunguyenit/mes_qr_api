import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { View } from "react-native";
import { Column, Row } from "~/common";
import { HeaderSheet, StatusBadge } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { RESERVATION_STATUS, RESERVATION_STATUS_CONFIG } from "~/enums";
import { useTheme } from "~/hooks/useTheme";
import { ReservationApprovalItem, ReservationApprovalLevel } from "~/services/reservation/reservation.type";

interface Props {
  level: ReservationApprovalLevel;
  item: ReservationApprovalItem;
}

export const ReservationDemandReleaseDetailSheet = ({
  level,
  item,
}: Props) => {
  const { spacing } = useTheme();

  const statusLabel =
    item.status ||
    (item.approved
      ? RESERVATION_STATUS_CONFIG[RESERVATION_STATUS.APPROVED].label
      : item.reject
        ? RESERVATION_STATUS_CONFIG[RESERVATION_STATUS.REJECTED].label
        : RESERVATION_STATUS_CONFIG[RESERVATION_STATUS.WAITING_APPROVAL].label);

  const isApproved = item.approved || statusLabel === RESERVATION_STATUS_CONFIG[RESERVATION_STATUS.APPROVED].label;
  const isRejected = item.reject || statusLabel === RESERVATION_STATUS_CONFIG[RESERVATION_STATUS.REJECTED].label;

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="detail" />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <Row>
            <ColumnInfo label="Cấp duyệt" value={level.level} />
            <ColumnInfo
              label="Trạng thái duyệt"
              value={
                <StatusBadge
                  value={statusLabel}
                  color={
                    isApproved
                      ? RESERVATION_STATUS_CONFIG[RESERVATION_STATUS.APPROVED].color
                      : isRejected
                        ? RESERVATION_STATUS_CONFIG[RESERVATION_STATUS.REJECTED].color
                        : RESERVATION_STATUS_CONFIG[RESERVATION_STATUS.WAITING_APPROVAL].color
                  }
                  bgColor={
                    isApproved
                      ? RESERVATION_STATUS_CONFIG[RESERVATION_STATUS.APPROVED].bgColor
                      : isRejected
                        ? RESERVATION_STATUS_CONFIG[RESERVATION_STATUS.REJECTED].bgColor
                        : RESERVATION_STATUS_CONFIG[RESERVATION_STATUS.WAITING_APPROVAL].bgColor
                  }
                />
              }
              last
            />
          </Row>

          <ColumnInfo label="Vị trí/Nhân viên duyệt" value={item.tile} />

          <ColumnInfo
            label="Người duyệt (Nếu có)"
            value={item.employeeName || "---"}
          />

          <ColumnInfo
            label="Ghi chú người duyệt"
            value={item.comment || "---"}
            full
            last
          />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};
