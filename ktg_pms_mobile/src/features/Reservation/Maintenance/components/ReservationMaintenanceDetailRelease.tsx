import React, { useCallback, useMemo } from "react";
import { View } from "react-native";
import { Collapse } from "~/common";
import Table, { RowTable } from "~/common/Table";
import { StatusBadge } from "~/components";
import {
  RESERVATION_STATUS,
  RESERVATION_STATUS_CONFIG,
} from "~/enums/reservation.enum";
import { useTheme } from "~/hooks/useTheme";
import {
  ReservationApprovalItem,
  ReservationApprovalLevel,
  ReservationDetailData,
} from "~/services/reservation/reservation.type";
import globalStyle from "~/styles/global-style";
import { useSheet } from "~/contexts/SheetContext";
import { ReservationMaintenanceReleaseDetailSheet } from "../sheets/ReservationMaintenanceReleaseDetailSheet";

interface Props {
  data: ReservationDetailData;
}

export const ReservationMaintenanceDetailRelease = ({
  data,
}: Props) => {
  const { colors } = useTheme();
  const { openSheet } = useSheet();

  const filteredData = useMemo(() => {
    const result: {
      level: ReservationApprovalLevel;
      item: ReservationApprovalItem;
    }[] = [];

    const approvalData = data.lstApprovalProgress || (data as any).lstRelease;

    approvalData?.forEach((level: any) => {
      level.lstApprove?.forEach((item: any) => {
        result.push({ level, item });
      });
    });

    return result;
  }, [data.lstApprovalProgress, (data as any).lstRelease]);

  const tableContent = useMemo(() => {
    const result: RowTable[] = [];
    const levelGroups = new Map<number | string, ReservationApprovalItem[]>();

    const approvalData = data.lstApprovalProgress || (data as any).lstRelease;

    approvalData?.forEach((level: any) => {
      const levelKey = level.level ?? "";
      if (!levelGroups.has(levelKey)) {
        levelGroups.set(levelKey, []);
      }
      level.lstApprove?.forEach((item: any) => {
        levelGroups.get(levelKey)?.push(item);
      });
    });

    levelGroups.forEach((items, level) => {
      result.push({
        rowStyle: { backgroundColor: colors.lgrayBg },
        cells: [
          { text: `Cấp duyệt: ${level}`, style: { fontWeight: "bold" } },
          "",
          "",
          "",
          "",
        ],
      });

      items.forEach((item) => {
        const statusLabel =
          item.status ||
          (item.approved
            ? RESERVATION_STATUS_CONFIG[RESERVATION_STATUS.APPROVED].label
            : item.reject
              ? RESERVATION_STATUS_CONFIG[RESERVATION_STATUS.REJECTED].label
              : RESERVATION_STATUS_CONFIG[RESERVATION_STATUS.WAITING_APPROVAL]
                  .label);

        const isApproved =
          item.approved ||
          statusLabel ===
            RESERVATION_STATUS_CONFIG[RESERVATION_STATUS.APPROVED].label;
        const isRejected =
          item.reject ||
          statusLabel ===
            RESERVATION_STATUS_CONFIG[RESERVATION_STATUS.REJECTED].label;

        result.push({
          cells: [
            "",
            item.tile || "---",
            item.employeeName || "---",
            <View style={{ alignSelf: "center" }}>
              <StatusBadge
                value={statusLabel}
                color={
                  isApproved
                    ? RESERVATION_STATUS_CONFIG[RESERVATION_STATUS.APPROVED]
                        .color
                    : isRejected
                      ? RESERVATION_STATUS_CONFIG[RESERVATION_STATUS.REJECTED]
                          .color
                      : RESERVATION_STATUS_CONFIG[
                          RESERVATION_STATUS.WAITING_APPROVAL
                        ].color
                }
                bgColor={
                  isApproved
                    ? RESERVATION_STATUS_CONFIG[RESERVATION_STATUS.APPROVED]
                        .bgColor
                    : isRejected
                      ? RESERVATION_STATUS_CONFIG[RESERVATION_STATUS.REJECTED]
                          .bgColor
                      : RESERVATION_STATUS_CONFIG[
                          RESERVATION_STATUS.WAITING_APPROVAL
                        ].bgColor
                }
              />
            </View>,
            item.comment || "---",
          ],
        });
      });
    });

    return result;
  }, [data.lstApprovalProgress, (data as any).lstRelease, colors.lgrayBg]);

  const handleRowDoublePress = useCallback(
    (index: number) => {
      const row = filteredData[index];
      if (row) {
        openSheet(<ReservationMaintenanceReleaseDetailSheet level={row.level} item={row.item} />);
      }
    },
    [filteredData, openSheet],
  );

  return (
    <Collapse
      title="Cấp duyệt"
      collapsible
      containerStyle={globalStyle.collapseContainer}
    >
      <Table
        horizontalScroll
        columns={[
          "Cấp duyệt",
          "Vị trí/Nhân viên duyệt",
          "Người duyệt",
          "Trạng thái duyệt",
          "Ghi chú người duyệt",
        ]}
        columnWidths={[80, 200, 200, 150, 250]}
        rows={tableContent}
        onRowDoublePress={handleRowDoublePress}
        pagination={{ enabled: false }}
      />
    </Collapse>
  );
};
