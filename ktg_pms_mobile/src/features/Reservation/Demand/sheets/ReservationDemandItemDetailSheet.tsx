import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import moment from "moment";
import React from "react";
import { View } from "react-native";
import { Column, Row } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";
import { ReservationDetailItem } from "~/services/reservation/reservation.type";

interface Props {
  item: ReservationDetailItem;
  onClose: () => void;
}

const ReservationDemandItemDetailSheet = ({ item, onClose }: Props) => {
  const { spacing } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="detail" onClose={onClose} />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <Row>
            <ColumnInfo label="Item No." value={item.itemNo || "---"} />
            <ColumnInfo
              label="Mã sản phẩm"
              value={item.materialCode || "---"}
            />
          </Row>

          <ColumnInfo
            label="Tên sản phẩm"
            value={item.shortText || item.materialName || "---"}
            full
          />

          <Row>
            <ColumnInfo
              label="Số lượng"
              value={item.quantity?.toString() || "0"}
            />
            <ColumnInfo label="Đơn vị tính" value={item.uomCode || "---"} />
          </Row>

          <Row>
            <ColumnInfo
              label="Số lượng quy đổi"
              value={item.quantityAlternative?.toString() || "0"}
            />
            <ColumnInfo
              label="Đơn vị tính quy đổi"
              value={item.uomAlternativeCode || "---"}
            />
          </Row>

          <Row>
            <ColumnInfo label="Số lô (Batch)" value={item.batch || "---"} />
            <ColumnInfo
              label="Kho xuất"
              value={
                item.warehouseIssueSlocCode ||
                item.warehouseIssueSlocName ||
                item.warehouseIssueSloc ||
                "---"
              }
            />
          </Row>

          <Row>
            <ColumnInfo
              label="Ngày yêu cầu"
              value={
                item.expiryDate || item.requirementDate || item.requestDate
                  ? moment(
                      item.expiryDate ||
                        item.requirementDate ||
                        item.requestDate,
                    ).format("DD/MM/YYYY")
                  : "---"
              }
            />
            <ColumnInfo
              label="Định mức"
              value={
                item.norm !== undefined && item.norm !== null
                  ? item.norm.toString()
                  : item.quota || "---"
              }
            />
          </Row>

          <ColumnInfo
            label="Ghi chú (Remark)"
            value={item.description || item.remark || "---"}
            full
            last
          />

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};

export default React.memo(ReservationDemandItemDetailSheet);
