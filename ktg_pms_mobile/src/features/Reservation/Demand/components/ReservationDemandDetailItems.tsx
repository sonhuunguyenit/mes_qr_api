import React, { useMemo } from "react";
import moment from "moment";
import { Collapse } from "~/common";
import Table, { ColumnTable, RowTable, EyeDetailRow } from "~/common/Table";
import {
  ReservationDetailData,
  ReservationDetailItem,
} from "~/services/reservation/reservation.type";
import globalStyle from "~/styles/global-style";

interface Props {
  data: ReservationDetailData;
  onShowDetail: (item: ReservationDetailItem) => void;
}

const WIDTHS = [80, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250];

export const ReservationDemandDetailItems = ({ data, onShowDetail }: Props) => {
  const items = data.lstDetail || [];

  const tableContent = useMemo(() => {
    return items.map((item) => ({
      cells: [
        item.itemNo || "",
        item.materialCode || "---",
        item.shortText || item.materialName || "---",
        item.quantity?.toString() || "0",
        item.uomCode || "---",
        item.quantityAlternative !== undefined &&
        item.quantityAlternative !== null
          ? item.quantityAlternative.toString()
          : "0",
        item.uomAlternativeCode || "---",
        item.batch || "---",
        item.warehouseIssueSlocCode || "---",
        item.expiryDate || item.requirementDate || item.requestDate
          ? moment(
              item.expiryDate || item.requirementDate || item.requestDate,
            ).format("DD/MM/YYYY")
          : "---",
        item.norm !== undefined && item.norm !== null
          ? item.norm.toString()
          : item.quota || "---",
        item.description || item.remark || "---",
      ] as ColumnTable[],
    }));
  }, [items]);

  const handleRowDoublePress = (index: number) => {
    const item = items[index];
    if (item) {
      onShowDetail(item);
    }
  };

  return (
    <Collapse
      title="III. Danh sách Item"
      collapsible
      containerStyle={globalStyle.collapseContainer}
    >
      <Table
        horizontalScroll
        columns={[
          "Item No.",
          "Mã sản phẩm (Material Number)",
          "Tên sản phẩm (Material Description)",
          "Số lượng (Quantity)",
          "Đơn vị tính (Unit)",
          "Số lượng quy đổi (Quantity Alternative)",
          "Đơn vị tính quy đổi (Alternative Unit )",
          "Số lô (Batch)",
          "Kho xuất",
          "Ngày yêu cầu",
          "Định mức",
          "Ghi chú (Remark)",
        ]}
        columnWidths={WIDTHS}
        rows={tableContent}
        onRowDoublePress={handleRowDoublePress}
        pagination={{ enabled: false }}
      />
    </Collapse>
  );
};
