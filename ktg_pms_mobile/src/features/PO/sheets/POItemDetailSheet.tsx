import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import moment from "moment";
import React from "react";
import { View } from "react-native";
import { Column, Row } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";

interface POItemDetailSheetProps {
  item: any;
  dataUom?: any[];
  onClose: () => void;
}

const POItemDetailSheet = ({ item, dataUom }: POItemDetailSheetProps) => {
  const { spacing } = useTheme();

  const formatNumberValue = (val: any) => {
    if (!val && val !== 0) return "0";
    return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getOPUName = () => {
    return (
      item.opuName ||
      dataUom?.find?.((u: any) => u.id === item.opuId)?.name ||
      item.opu ||
      "---"
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="detail" />

      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <Row>
            <ColumnInfo label="Close" value={item.itemClosed} />
            <ColumnInfo label="Delete" value={item.itemDeleted} />
          </Row>

          <Row>
            <ColumnInfo
              label="Item line"
              value={item.itemLine || item.itemNo || "---"}
            />
            <ColumnInfo
              label="Acc assignment"
              value={item.acccateName || item.accountAssignment || item.acccate}
            />
          </Row>

          <Row>
            <ColumnInfo
              label="Category"
              value={item.itemcateName || item.itemCategory}
            />
            <ColumnInfo label="Mã vật tư" value={item.materialCode} />
          </Row>

          <Row>
            <ColumnInfo
              label="Mat Group"
              value={item.materialGroupName || item.materialGroupCode}
            />
            <ColumnInfo
              label="External MatGr"
              value={
                item.extMatGrName ||
                item.externalMaterialGroupName ||
                item.externalMaterialGroupCode
              }
            />
          </Row>

          <Row>
            <ColumnInfo label="Mã tài sản" value={item.assetCode} />
            <ColumnInfo label="Mã dịch vụ" value={item.serviceCode} />
          </Row>

          <ColumnInfo
            label="Short text"
            value={item.shortText || item.materialName}
            full
          />

          <Row>
            <ColumnInfo
              label="Số lượng lên PO"
              value={formatNumberValue(item.quantityUptoPO)}
            />
            <ColumnInfo
              label="Số lượng đã nhập kho"
              value={formatNumberValue(item.warehouseQuantity)}
            />
          </Row>

          <ColumnInfo
            label="OUN (Đơn vị tính)"
            value={item.uomCode || item.ounName || item.unitName || item.uom}
            full
          />

          <ColumnInfo
            label="Thời gian dự kiến hàng về kho"
            value={
              item.deliveryDate || item.expectedDeliveryDate
                ? moment(item.deliveryDate || item.expectedDeliveryDate).format(
                    "DD/MM/YYYY",
                  )
                : "---"
            }
            full
          />

          <Row>
            <ColumnInfo
              label="Đơn giá RFQ"
              value={formatNumberValue(item.grossPrice || item.rfqPrice)}
            />
            <ColumnInfo
              label="Đơn vị tiền tệ RFQ"
              value={item.currencyName || item.rfqCurrency}
            />
          </Row>

          <Row>
            <ColumnInfo
              label="Hệ số giá RFQ (PER)"
              value={item.per || item.rfqPer}
            />
            <ColumnInfo
              label="Đơn giá PO"
              value={formatNumberValue(
                item.pricePo || item.grossPrice || item.netPrice,
              )}
            />
          </Row>

          <Row>
            <ColumnInfo
              label="Đơn vị tiền tệ PO"
              value={
                item.currencyPoName ||
                item.currencyName ||
                item.currencyPoCode ||
                item.currencyCode
              }
            />
            <ColumnInfo
              label="Hệ số giá PO (PER)"
              value={item.perPo || item.per}
            />
          </Row>

          <Row>
            <ColumnInfo label="OPU" value={getOPUName()} />
            <ColumnInfo
              label="Fund center"
              value={item.fcPr || item.fundsCenterPr || item.fc}
            />
          </Row>

          <Row>
            <ColumnInfo label="FP" value={item.fpPr || item.fp} />
            <ColumnInfo
              label="CI"
              value={item.ciPr || item.commitmentItemCode || item.ci}
            />
          </Row>

          <ColumnInfo
            label="CIName"
            value={item.ciPrName || item.ciname || item.commitmentItemName}
            full
          />

          <Row>
            <ColumnInfo label="Kỳ ngân sách" value={item.budgetPeriod} />
            <ColumnInfo
              label="Ngân sách Item"
              value={formatNumberValue(
                item.valueItem || item.budgetItem || item.valueItemOld,
              )}
            />
          </Row>

          <Row>
            <ColumnInfo
              label="Dung sai giao thiếu (%)"
              value={formatNumberValue(item.lowerTolerance)}
            />
            <ColumnInfo
              label="Dung sai giao thừa (%)"
              value={formatNumberValue(item.upperTolerance)}
            />
          </Row>

          <ColumnInfo
            label="Ngân sách"
            value={formatNumberValue(item.totalBudget || item.totalBudgetOld)}
            full
          />

          <Row>
            <ColumnInfo
              label="Vị trí kho hàng"
              value={item.storageLocation || item.storeLocationCode}
            />
            <ColumnInfo
              label="ValType"
              value={item.valType || item.valuationType}
            />
          </Row>

          <Row>
            <ColumnInfo
              label="Rfq"
              value={
                item.rfqCode || item.rfq || (item.__rfq__ && item.__rfq__.code)
              }
            />
            <ColumnInfo
              label="Item Rfq"
              value={item.rfqItem || item.rfqItemNo}
            />
          </Row>

          <Row>
            <ColumnInfo
              label="PR"
              value={item.prCode || item.purchaseRequisition}
            />
            <ColumnInfo
              label="Item PR"
              value={item.prItemCode || item.prItem || item.prItemNo}
            />
          </Row>

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};

export default POItemDetailSheet;
