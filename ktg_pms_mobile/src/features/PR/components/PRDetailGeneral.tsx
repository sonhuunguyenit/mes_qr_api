import moment from "moment";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Collapse, Column, Row, Text } from "~/common";
import { StatusBadge } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { PR_STATUS, PR_STATUS_CONFIG } from "~/enums/pr.enum";
import { useTheme } from "~/hooks/useTheme";
import { PRItemData } from "~/services/pr/pr.type";

interface PRDetailGeneralProps {
  data: PRItemData;
}

export const PRDetailGeneral = React.memo(({ data }: PRDetailGeneralProps) => {
  const { colors } = useTheme();

  return (
    <Collapse title="I. Thông tin chung" collapsible>
      <Column gap={12} align="stretch">
        <Row full gap={16}>
          <ColumnInfo label="Mã PR PMS" value={data.code} />
          <ColumnInfo label="Số PR SAP" value={data.sapCode} />
        </Row>

        <ColumnInfo
          label="Plant"
          value={data.plantLable || data.plantName || data.plantCode}
          full
        />

        <Row full gap={16}>
          <ColumnInfo label="Loại chứng từ" value={data.prType} />
          <ColumnInfo
            label="Trạng thái"
            value={
              <StatusBadge
                value={
                  data.statusName ||
                  PR_STATUS_CONFIG[data.status as PR_STATUS]?.label
                }
                color={
                  data.statusColor ||
                  PR_STATUS_CONFIG[data.status as PR_STATUS]?.color ||
                  (colors.primary as any)
                }
                bgColor={
                  data.statusBgColor ||
                  PR_STATUS_CONFIG[data.status as PR_STATUS]?.bgColor
                }
                borderColor={
                  data.statusColor ||
                  PR_STATUS_CONFIG[data.status as PR_STATUS]?.borderColor
                }
              />
            }
            last
          />
        </Row>

        <ColumnInfo label="Mã PR tổng hợp" value={data.prParentCode} full />

        <ColumnInfo label="Bộ phận yêu cầu" value={data.departmentName} />

        <ColumnInfo label="Người yêu cầu" value={data.requisitionerName} />

        <Row full gap={16}>
          <ColumnInfo label="Người tạo" value={data.createdByName} />
          <ColumnInfo
            label="Ngày tạo"
            value={
              data.createdAt
                ? moment(data.createdAt).format("DD/MM/YYYY")
                : "---"
            }
          />
        </Row>

        <Row full gap={16}>
          <ColumnInfo
            label="Giờ tạo"
            value={
              data.createdTimeAt
                ? moment(data.createdTimeAt, [
                    "YYYY-MM-DDTHH:mm:ss.SSSZ",
                    "HH:mm",
                  ]).format("HH:mm")
                : "---"
            }
          />
          <ColumnInfo
            label="Tổng giá trị"
            value={Number(data.totalValue ?? 0).toLocaleString("en-US")}
          />
        </Row>

        {data.lstMediaFile && data.lstMediaFile.length > 0 && (
          <View style={[styles.fileSection, { borderBottomColor: colors.divider }]}>
            <Text
              bold
              color={colors.label}
              size={12}
              style={{ marginBottom: 8 }}
            >
              File đính kèm
            </Text>
            <Row wrap gap={8}>
              {data.lstMediaFile.map((file, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.fileChip, { borderColor: colors.primary, backgroundColor: colors.statusInfoBg }]}
                >
                  {/* sync from pr-detail.component.html:70 */}
                  <Text color={colors.primary} size={12} bold numberOfLines={1}>
                    {file.fileName || `File ${index + 1}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </Row>
          </View>
        )}

        <ColumnInfo label="Header note" value={data.headerNote} />
        <ColumnInfo label="Mục đích sử dụng" value={data.uses} last />
      </Column>
    </Collapse>
  );
});

const styles = StyleSheet.create({
  fileSection: {
    marginTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  fileChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
});
