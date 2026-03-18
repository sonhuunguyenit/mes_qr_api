import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { View, StyleSheet } from "react-native";
import { StatusBadge } from "~/components";
import { Column, Row, Text } from "~/common";
import { PR_STATUS, PR_STATUS_CONFIG } from "~/enums";
import { PRApprovalItem, PRApprovalLevel } from "~/services/pr/pr.type";
import { PRFieldItem } from "../components/PRFieldItem";
import { useTheme } from "~/hooks/useTheme";

interface PRApprovalDetailSheetProps {
  level: PRApprovalLevel;
  item: PRApprovalItem;
}

export const PRApprovalDetailSheet = ({
  level,
  item,
}: PRApprovalDetailSheetProps) => {
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
    <BottomSheetScrollView style={{ padding: spacing.md }}>
      <Text size={18} bold style={{ marginBottom: 20 }}>
        Chi tiết phê duyệt
      </Text>

      <Column gap={12} align="stretch" style={styles.contentContainer}>
        <Row full gap={16}>
          <PRFieldItem label="Cấp duyệt" value={level.level} />
          <PRFieldItem
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
          />
        </Row>

        <PRFieldItem
          label="Vị trí / nhân viên duyệt"
          value={item.tile}
          fullWidth
        />

        <PRFieldItem
          label="Người duyệt (Nếu có)"
          value={item.employeeName || "---"}
          fullWidth
        />

        <PRFieldItem
          label="Ghi chú người duyệt"
          value={item.comment || "---"}
          fullWidth
        />

        <View style={{ height: 40 }} />
      </Column>
    </BottomSheetScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 20,
  },
});
