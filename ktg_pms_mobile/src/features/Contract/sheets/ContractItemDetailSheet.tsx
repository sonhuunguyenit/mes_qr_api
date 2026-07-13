import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { View } from "react-native";
import { Column, Row } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";
import { ContractItem } from "~/services/contract/contract.type";
import DateHelper from "~/utils/date";
import NumberHelper from "~/utils/number";

interface ContractItemDetailSheetProps {
  item: ContractItem;
  isNT: boolean;
}

export const ContractItemDetailSheet = ({
  item,
  isNT,
}: ContractItemDetailSheetProps) => {
  const { spacing } = useTheme();

  const formatNum = (val: any) => {
    if (val === undefined || val === null || val === "") return "---";
    const num = Number(val);
    return isNaN(num) ? val.toString() : NumberHelper.formatMoney(num);
  };

  const formatDate = (val: any) => {
    if (!val) return "---";
    return DateHelper.formatDate(val, "DD/MM/YYYY");
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="detail" />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          {isNT ? (
            <>
              <Row>
                <ColumnInfo label="STT" value={item.itemNo || "---"} />
                <ColumnInfo label="Đơn vị tính" value={item.uomText || "---"} />
              </Row>

              <ColumnInfo
                label="Tên sản phẩm"
                value={item.externalMaterialGroupName || "---"}
                full
              />

              <ColumnInfo
                label="Quy cách - Chủng loại"
                value={item.specificationType || "---"}
                full
              />

              <Row>
                <ColumnInfo
                  label="Số lượng dự kiến /tháng"
                  value={formatNum(item.estimatedMonthlyQuantity)}
                />
                <View style={{ flex: 1 }} />
              </Row>

              <ColumnInfo
                label="Ghi chú"
                value={item.note || "---"}
                full
                last
              />
            </>
          ) : (
            <>
              <Row>
                <ColumnInfo label="Item line" value={item.itemNo || "---"} />
                <ColumnInfo
                  label="Account assignment"
                  value={item.acccateName || "---"}
                />
              </Row>

              <Row>
                <ColumnInfo label="Material" value={item.code || "---"} />
                <ColumnInfo
                  label="Vị trí kho hàng"
                  value={item.plantName || "---"}
                />
              </Row>

              <ColumnInfo
                label="Thông số kỹ thuật"
                value={item.technicalSpec || "---"}
                full
              />

              <ColumnInfo
                label="Material Group"
                value={item.materialGroupName || "---"}
                full
              />

              <Row>
                <ColumnInfo
                  label="Asset"
                  value={
                    item.assetCode
                      ? item.assetDesc
                        ? `${item.assetCode} - ${item.assetDesc}`
                        : item.assetCode
                      : "---"
                  }
                />
                <ColumnInfo
                  label="Order"
                  value={
                    item.orderCode
                      ? item.ioName
                        ? `${item.orderCode} - ${item.ioName}`
                        : item.orderCode
                      : "---"
                  }
                />
              </Row>

              <ColumnInfo
                label="Short text"
                value={item.shortText || "---"}
                full
              />

              <Row>
                <ColumnInfo
                  label="Số lượng mua"
                  value={formatNum(item.quantity)}
                />
                <ColumnInfo label="Đơn vị tính" value={item.ounName || "---"} />
              </Row>

              <Row>
                <ColumnInfo label="Đơn giá" value={formatNum(item.price)} />
                <ColumnInfo
                  label="Đơn vị Base Unit"
                  value={item.unitName || "---"}
                />
              </Row>

              <Row>
                <ColumnInfo
                  label="Thành tiền"
                  value={formatNum(item.totalPrice)}
                />
                <ColumnInfo
                  label="Thành tiền (VNĐ)"
                  value={formatNum(item.totalPriceVND)}
                />
              </Row>

              <Row>
                <ColumnInfo label="Mã thuế" value={item.taxCodeName || "---"} />
                <ColumnInfo
                  label="Thuế"
                  value={
                    item.taxRate !== undefined && item.taxRate !== null
                      ? `${item.taxRate}%`
                      : "---"
                  }
                />
              </Row>

              <ColumnInfo
                label="Thành tiền sau thuế"
                value={formatNum(item.totalPriceAfterTax)}
                full
              />

              <Row>
                <ColumnInfo label="Xuất xứ" value={item.origin || "---"} />
                <ColumnInfo
                  label="Nhà máy SX"
                  value={item.factorySupplierName || "---"}
                />
              </Row>

              <ColumnInfo
                label="Thời gian giao hàng trễ nhất"
                value={formatDate(item.latestDeliveryDate)}
                full
              />

              <Row>
                <ColumnInfo
                  label="Dung sai giao hàng thiếu"
                  value={
                    item.underDeliveryTolerance !== undefined &&
                    item.underDeliveryTolerance !== null
                      ? `${item.underDeliveryTolerance}%`
                      : "---"
                  }
                />
                <ColumnInfo
                  label="Dung sai giao hàng thừa"
                  value={
                    item.overDeliveryTolerance !== undefined &&
                    item.overDeliveryTolerance !== null
                      ? `${item.overDeliveryTolerance}%`
                      : "---"
                  }
                />
              </Row>

              <Row>
                <ColumnInfo
                  label="Loại tồn kho"
                  value={item.stockType || "---"}
                />
                <ColumnInfo
                  label="Loại giá trị"
                  value={item.valuationType || "---"}
                />
              </Row>
            </>
          )}

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};
