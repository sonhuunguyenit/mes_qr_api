import React, { useCallback, useMemo } from "react";
import { View } from "react-native";
import { Collapse } from "~/common";
import Table from "~/common/Table";
import { StatusBadge } from "~/components";
import { PR_STATUS, PR_STATUS_CONFIG } from "~/enums";
import {
  PRItemData,
  PRReleaseItem,
  PRReleaseLevel,
} from "~/services/pr/pr.type";
import Helper from "~/utils/helper";

interface PRDetailRealeseProps {
  data: PRItemData;
  onShowDetail: (level: PRReleaseLevel, item: PRReleaseItem) => void;
}

export const PRDetailRealese = React.memo(
  ({ data, onShowDetail }: PRDetailRealeseProps) => {
    const flattenedData = useMemo(() => {
      const result: { level: PRReleaseLevel; item: PRReleaseItem }[] = [];

      data.lstApprovalProgress?.forEach((level) => {
        level.lstApprove?.forEach((item) => {
          result.push({ level, item });
        });
      });

      return result;
    }, [data.lstApprovalProgress]);

    const tableContent = useMemo(() => {
      const levelFirstOccurrence = new Map<number | string, boolean>();

      return flattenedData.map(({ level, item }) => {
        const statusLabel =
          item.status ||
          (item.approved
            ? PR_STATUS_CONFIG[PR_STATUS.APPROVED].label
            : item.reject
              ? PR_STATUS_CONFIG[PR_STATUS.REJECTED].label
              : PR_STATUS_CONFIG[PR_STATUS.WAITING_APPROVAL].label);

        const isApproved =
          statusLabel === PR_STATUS_CONFIG[PR_STATUS.APPROVED].label;
        const isRejected =
          statusLabel === PR_STATUS_CONFIG[PR_STATUS.REJECTED].label;
        const isCheckAgain =
          statusLabel === PR_STATUS_CONFIG[PR_STATUS.CHECK_AGAIN].label;

        const statusConfig = Helper.match(
          [
            [isApproved, PR_STATUS_CONFIG[PR_STATUS.APPROVED]],
            [isRejected, PR_STATUS_CONFIG[PR_STATUS.REJECTED]],
            [isCheckAgain, PR_STATUS_CONFIG[PR_STATUS.CHECK_AGAIN]],
          ],
          PR_STATUS_CONFIG[PR_STATUS.WAITING_APPROVAL],
        );

        const levelKey = level.level ?? "";
        const isFirst = !levelFirstOccurrence.has(levelKey);
        if (isFirst) levelFirstOccurrence.set(levelKey, true);

        return {
          cells: [
            isFirst ? level.level : "",
            item.title || "---",
            item.employeeName || "---",
            <View style={{ alignSelf: "center" }}>
              <StatusBadge
                key={`status-${item.id || Math.random()}`}
                value={statusLabel}
                color={statusConfig.color}
                bgColor={statusConfig.bgColor}
              />
            </View>,
            item.comment || "---",
          ],
        };
      });
    }, [flattenedData]);

    const handleRowDoublePress = useCallback(
      (index: number) => {
        const row = flattenedData[index];
        if (row) {
          onShowDetail(row.level, row.item);
        }
      },
      [flattenedData, onShowDetail],
    );

    return (
      <Collapse title="II. Release PR" collapsible>
        <Table
          horizontalScroll
          columns={[
            "Cấp duyệt",
            "Vị trí / nhân viên duyệt",
            "Người duyệt",
            "Trạng thái",
            "Ghi chú",
          ]}
          columnWidths={[75, 200, 200, 100, 200]}
          rows={tableContent}
          onRowDoublePress={handleRowDoublePress}
          pagination={{ enabled: false }}
        />
      </Collapse>
    );
  },
);
