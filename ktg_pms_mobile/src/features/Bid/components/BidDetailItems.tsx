import React, { useMemo } from "react";
import { Collapse, Column, Row, Spacer, Table } from "~/common";
import { ColumnInfo } from "~/components/ColumnInfo";
import globalStyle from "~/styles/global-style";
import DateHelper from "~/utils/date";
import { useSheet } from "~/contexts/SheetContext";
import { BidItemDetailSheet } from "../sheets/BidItemDetailSheet";

interface BidDetailItemsProps {
  data: any;
}

export const BidDetailItems = React.memo(({ data }: BidDetailItemsProps) => {
  const { openSheet, closeSheet } = useSheet();

  const itemRows = useMemo(() => {
    return (data?.lstDetail || []).map((item: any) => ({
      cells: [
        item.itemNo,
        item.acccateName,
        item.materialCode,
        item.materialGroupName,
        item.externalMaterialGroupTitle,
        item.assetCode,
        item.subNoAset,
        item.orderCode,
        item.shortText,
        item.glAccountCode,
        item.costCenterCode,
        item.quantity,
        item.unitCode,
        DateHelper.formatDate(item.deliveryDate),
      ],
    }));
  }, [data?.lstDetail]);

  const handleRowDoublePress = (index: number) => {
    const item = data?.lstDetail?.[index];
    if (item) {
      openSheet(<BidItemDetailSheet item={item} />);
    }
  };

  return (
    <Collapse
      title="II. Thiết lập item gói thầu"
      collapsible
      containerStyle={globalStyle.collapseContainer}
    >
      <Column gap={12} align="stretch" style={{ paddingBottom: 12 }}>
        <ColumnInfo label="Nguồn tham chiếu" value={data?.referenceName} />
        {data?.reference === "PR" && (
          <ColumnInfo label="PR" value={data?.prCode} />
        )}
        {data?.reference === "PR_TOTAL" && (
          <ColumnInfo label="PR tổng hợp" value={data?.prCode} />
        )}
        {data?.reference === "NCSD" && (
          <ColumnInfo label="Nhu cầu sử dụng" value={data?.reservationCode} />
        )}
        {data?.reference === "NCSD_TOTAL" && (
          <ColumnInfo
            label="Nhu cầu sử dụng tổng hợp"
            value={data?.reservationCode}
          />
        )}
        {data?.reference === "PAVC" && (
          <ColumnInfo label="Chọn Shipment/PAVC" value={data?.prCode} />
        )}
        {data?.reference === "NO_ITEM" && (
          <ColumnInfo
            label="Lĩnh vực đấu thầu"
            value={data?.externalMaterialGroupT}
          />
        )}
      </Column>

      <Spacer size={10} />

      {data?.reference !== "NO_ITEM" && (
        <Table
          columns={[
            "Item Line",
            "Account assignment",
            "Mã vật tư",
            "Mat Group",
            "External MatGroup",
            "Mã tài sản",
            "SubNoAsset",
            "Mã dịch vụ",
            "Short text",
            "GL Account",
            "Cost Center",
            "Số lượng mua",
            "Đơn vị tính",
            "Thời gian cần hàng",
          ]}
          columnWidths={[
            100, 150, 120, 200, 200, 100, 100, 100, 200, 200, 200, 100, 100,
            130,
          ]}
          horizontalScroll
          rows={itemRows}
          onRowDoublePress={handleRowDoublePress}
        />
      )}
    </Collapse>
  );
});
