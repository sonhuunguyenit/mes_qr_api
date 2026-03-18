import moment from "moment";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Collapse, Column, Row, Text } from "~/common";
import { StatusBadge } from "~/components";
import { PR_STATUS, PR_STATUS_CONFIG } from "~/enums/pr.enum";
import { useTheme } from "~/hooks/useTheme";
import { PRItemData } from "~/services/pr/pr.type";
import { PRFieldItem } from "./PRFieldItem";

interface PRDetailGeneralProps {
  data: PRItemData;
}

export const PRDetailGeneral = React.memo(({ data }: PRDetailGeneralProps) => {
  const { colors } = useTheme();

  return (
    <Collapse title="I. Thông tin chung" collapsible defaultExpanded={true}>
      <Column gap={12} align="stretch" style={styles.sectionContent}>
        <Row full gap={16}>
          <PRFieldItem label="Mã PR PMS" value={data.code} />
          <PRFieldItem label="Số PR SAP" value={data.sapCode} />
        </Row>

        <PRFieldItem
          label="Plant"
          value={data.plantLable || data.plantName || data.plantCode}
          fullWidth
        />

        <Row full gap={16}>
          <PRFieldItem label="Loại chứng từ" value={data.prType} />
          <PRFieldItem
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
                  colors.primary
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
          />
        </Row>

        <PRFieldItem
          label="Mã PR tổng hợp"
          value={data.prParentCode}
          fullWidth
        />

        <Row full gap={16}>
          <PRFieldItem label="Bộ phận yêu cầu" value={data.departmentName} />
          <PRFieldItem label="Người yêu cầu" value={data.requisitionerName} />
        </Row>

        <Row full gap={16}>
          <PRFieldItem label="Người tạo" value={data.createdByName} />
          <PRFieldItem
            label="Ngày tạo"
            value={
              data.createdAt
                ? moment(data.createdAt).format("DD/MM/YYYY")
                : "---"
            }
          />
        </Row>

        <Row full gap={16}>
          <PRFieldItem
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
          <PRFieldItem
            label="Tổng giá trị"
            value={Number(data.totalValue ?? 0).toLocaleString("en-US")}
          />
        </Row>

        {data.lstMediaFile && data.lstMediaFile.length > 0 && (
          <View style={styles.fileSection}>
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
                  style={[styles.fileChip, { borderColor: colors.primary }]}
                >
                  <Text color={colors.primary} size={12} bold>
                    File {index + 1}
                  </Text>
                </TouchableOpacity>
              ))}
            </Row>
          </View>
        )}

        <PRFieldItem label="Header note" value={data.headerNote} />
        <PRFieldItem label="Mục đích sử dụng" value={data.uses} />
      </Column>
    </Collapse>
  );
});

const styles = StyleSheet.create({
  sectionContent: {
    paddingVertical: 12,
  },
  fileSection: {
    marginTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  fileChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: "#F0F7FF",
  },
});
