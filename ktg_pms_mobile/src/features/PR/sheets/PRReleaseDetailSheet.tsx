import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { View } from "react-native";
import { Column, Row } from "~/common";
import { HeaderSheet, StatusBadge } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { PR_STATUS, PR_STATUS_CONFIG } from "~/enums";
import { useTheme } from "~/hooks/useTheme";
import { PRReleaseItem, PRReleaseLevel } from "~/services/pr/pr.type";

interface PRReleaseDetailSheetProps {
  level: PRReleaseLevel;
  item: PRReleaseItem;
}

export const PRReleaseDetailSheet = ({
  level,
  item,
}: PRReleaseDetailSheetProps) => {
  const { spacing, colors } = useTheme();

  const statusLabel =
    item.status ||
    (item.approved
      ? PR_STATUS_CONFIG[PR_STATUS.APPROVED].label
      : item.reject
        ? PR_STATUS_CONFIG[PR_STATUS.REJECTED].label
        : PR_STATUS_CONFIG[PR_STATUS.WAITING_APPROVAL].label);

  const isApproved = statusLabel === PR_STATUS_CONFIG[PR_STATUS.APPROVED].label;
  const isRejected = statusLabel === PR_STATUS_CONFIG[PR_STATUS.REJECTED].label;
  const isCheckAgain =
    statusLabel === PR_STATUS_CONFIG[PR_STATUS.CHECK_AGAIN].label;

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
                      ? PR_STATUS_CONFIG[PR_STATUS.APPROVED].color
                      : isRejected
                        ? PR_STATUS_CONFIG[PR_STATUS.REJECTED].color
                        : isCheckAgain
                          ? PR_STATUS_CONFIG[PR_STATUS.CHECK_AGAIN].color
                          : PR_STATUS_CONFIG[PR_STATUS.WAITING_APPROVAL].color
                  }
                  bgColor={
                    isApproved
                      ? PR_STATUS_CONFIG[PR_STATUS.APPROVED].bgColor
                      : isRejected
                        ? PR_STATUS_CONFIG[PR_STATUS.REJECTED].bgColor
                        : isCheckAgain
                          ? PR_STATUS_CONFIG[PR_STATUS.CHECK_AGAIN].bgColor
                          : PR_STATUS_CONFIG[PR_STATUS.WAITING_APPROVAL].bgColor
                  }
                />
              }
              last
            />
          </Row>

          <ColumnInfo label="Vị trí / nhân viên duyệt" value={item.title} />

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
