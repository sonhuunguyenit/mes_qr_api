import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { Collapse } from "~/common";
import Table from "~/common/Table";
import { StatusBadge } from "~/components";
import { sizes } from "~/constants/sizes";
import { useSheet } from "~/contexts/SheetContext";
import { PR_STATUS, PR_STATUS_CONFIG } from "~/enums";
import {
  PRApprovalItem,
  PRApprovalLevel,
  PRItemData,
} from "~/services/pr/pr.type";
import PRApprovalTableFilterSheet, {
  PRApprovalTableFilters,
} from "../sheets/PRApprovalTableFilterSheet";

interface PRDetailApprovalProps {
  data: PRItemData;
  onShowDetail: (level: PRApprovalLevel, item: PRApprovalItem) => void;
}

const styles = StyleSheet.create({
  filterBtn: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#CBD5E1",
    borderRadius: sizes.sm,
  },
});

export const PRDetailApproval = React.memo(
  ({ data, onShowDetail }: PRDetailApprovalProps) => {
    const { openSheet, closeSheet } = useSheet();
    const [tableFilters, setTableFilters] = useState<PRApprovalTableFilters>({
      level: "",
      tile: "",
      employeeName: "",
      status: "",
      comment: "",
    });

    const isFiltered = !!(
      tableFilters.level ||
      tableFilters.tile ||
      tableFilters.employeeName ||
      tableFilters.status ||
      tableFilters.comment
    );

    const handleOpenFilter = useCallback(() => {
      openSheet(
        <PRApprovalTableFilterSheet
          initialFilters={tableFilters}
          onApply={setTableFilters}
          onClose={closeSheet}
        />,
      );
    }, [openSheet, tableFilters, closeSheet]);

    const tableContent = useMemo(() => {
      const filteredLevels =
        data.lstApprovalProgress
          ?.map((level) => ({
            ...level,
            lstApprove: level.lstApprove?.filter((item) => {
              const statusLabel =
                item.status ||
                (item.approved
                  ? PR_STATUS_CONFIG[PR_STATUS.APPROVED].label
                  : item.reject
                    ? PR_STATUS_CONFIG[PR_STATUS.REJECTED].label
                    : PR_STATUS_CONFIG[PR_STATUS.WAITING_APPROVAL].label);

              const matchLevel =
                !tableFilters.level ||
                level.level
                  ?.toString()
                  .toLowerCase()
                  .includes(tableFilters.level.toLowerCase());
              const matchTile =
                !tableFilters.tile ||
                item.tile
                  ?.toLowerCase()
                  .includes(tableFilters.tile.toLowerCase());
              const matchName =
                !tableFilters.employeeName ||
                item.employeeName
                  ?.toLowerCase()
                  .includes(tableFilters.employeeName.toLowerCase());
              const matchStatus =
                !tableFilters.status || statusLabel === tableFilters.status;
              const matchComment =
                !tableFilters.comment ||
                item.comment
                  ?.toLowerCase()
                  .includes(tableFilters.comment.toLowerCase());

              return (
                matchLevel &&
                matchTile &&
                matchName &&
                matchStatus &&
                matchComment
              );
            }),
          }))
          .filter((level) => level.lstApprove && level.lstApprove.length > 0) ||
        [];

      return (
        filteredLevels.flatMap(
          (level: PRApprovalLevel) =>
            level.lstApprove?.map((item: PRApprovalItem, idx: number) => {
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

              return {
                cells: [
                  idx === 0 ? level.level : "",
                  item.tile || "---",
                  item.employeeName || "---",
                  <StatusBadge
                    key={`status-${idx}`}
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
                            : PR_STATUS_CONFIG[PR_STATUS.WAITING_APPROVAL]
                                .bgColor
                    }
                  />,
                  item.comment || "---",
                  <Table.EyeDetailRow
                    key={`view-${idx}`}
                    onPress={() => {
                      onShowDetail(level, item);
                    }}
                  />,
                ],
              };
            }) || [],
        ) || []
      );
    }, [data.lstApprovalProgress, onShowDetail, tableFilters]);

    return (
      <Collapse title="Release PR" collapsible defaultExpanded={true}>
        <Table
          horizontalScroll
          containerStyle={{ marginHorizontal: -16 }}
          columns={[
            "Cấp duyệt",
            "Vị trí / nhân viên duyệt",
            "Người duyệt",
            "Trạng thái",
            "Ghi chú",
            <Table.ButtonFilterTable
              key="item-filter"
              onPress={handleOpenFilter}
              isFiltered={isFiltered}
            />,
          ]}
          stickyColumn="right"
          columnWidths={[100, 200, 150, 120, 150, 60]}
          rows={tableContent}
        />
      </Collapse>
    );
  },
);
