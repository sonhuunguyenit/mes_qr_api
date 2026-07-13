import moment from "moment";
import React, { useCallback, useMemo } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Collapse, Column, Row, Spacer, Table, Text } from "~/common";
import globalStyle from "~/styles/global-style";
import { useSheet } from "~/contexts/SheetContext";
import {
  PO_FUNCTION_DISPLAY,
  PO_PARTNER_TYPE_DISPLAY,
  PO_REFERENCE_SOURCE_DISPLAY,
  PO_STATUS,
  PO_TYPE_DISPLAY,
} from "~/enums/po.enum";
import { useTheme } from "~/hooks/useTheme";
import {
  POContact,
  PODetailData,
  POItemData,
  POPartner,
} from "~/services/po/po.type";
import { ColumnInfo } from "~/components/ColumnInfo";
import POContactDetailSheet from "../sheets/POContactDetailSheet";
import POPartnerDetailSheet from "../sheets/POPartnerDetailSheet";

interface PODetailInfoTabProps {
  data: POItemData & Partial<PODetailData>;
  dataUom?: {
    id: string;
    code: string;
    name: string;
  }[];
  onShowItemDetail?: (item: any) => void;
}

const PODetailInfoTab = ({
  data,
  dataUom,
  onShowItemDetail,
}: PODetailInfoTabProps) => {
  const { colors } = useTheme();
  const { openSheet, closeSheet } = useSheet();

  const formatNumberValue = (val: any) => {
    if (!val && val !== 0) return "0";
    return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const totalValue = useMemo(() => {
    return formatNumberValue(data.totalPO || 0);
  }, [data.totalPO]);

  const totalGrossValue = useMemo(() => {
    return formatNumberValue(data.totalPoGrossPrice || 0);
  }, [data.totalPoGrossPrice]);

  const totalQuantityUptoPO = useMemo(() => {
    return (data.lstItemPo || []).reduce((sum, item) => {
      return sum + (Number(item.quantityUptoPO) || 0);
    }, 0);
  }, [data.lstItemPo]);

  const getItemOPUName = (item: any) => {
    return (
      item.opuName ||
      dataUom?.find?.((u: any) => u.id === item.opuId)?.name ||
      "---"
    );
  };

  const onShowPartnerDetail = useCallback(
    (partner: POPartner) => {
      openSheet(<POPartnerDetailSheet partner={partner} />);
    },
    [openSheet],
  );

  const onShowContactDetail = useCallback(
    (contact: POContact) => {
      openSheet(<POContactDetailSheet contact={contact} />);
    },
    [openSheet],
  );

  const handleRowDoublePressPartner = useCallback(
    (index: number) => {
      const partner = data.lstPartner?.[index];
      if (partner) {
        onShowPartnerDetail(partner);
      }
    },
    [data.lstPartner, onShowPartnerDetail],
  );

  const handleRowDoublePressContact = useCallback(
    (index: number) => {
      const contact = data.lstMenber?.[index];
      if (contact) {
        onShowContactDetail(contact);
      }
    },
    [data.lstMenber, onShowContactDetail],
  );

  const handleRowDoublePressItem = useCallback(
    (index: number) => {
      const item = data.lstItemPo?.[index];
      if (item) {
        onShowItemDetail?.(item);
      }
    },
    [data.lstItemPo, onShowItemDetail],
  );

  const referenceSourceName =
    PO_REFERENCE_SOURCE_DISPLAY.find(
      (item) => item.value === data.referenceSourceType,
    )?.label ??
    (data.referenceSourceTypeName === "NONE"
      ? "Không tham chiếu"
      : data.referenceSourceTypeName) ??
    (data.referenceSourceType === "NONE"
      ? "Không tham chiếu"
      : data.referenceSourceType) ??
    "Không tham chiếu";

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={globalStyle.scrollContainerDetail}
    >
      {/* 1. Tham chiếu */}
      <Collapse
        title="I. Tham chiếu"
        collapsible
        containerStyle={globalStyle.collapseContainer}
      >
        <Column gap={12} style={styles.sectionContent}>
          <Row full gap={16}>
            <ColumnInfo label="Nguồn Tham Chiếu" value={referenceSourceName} />
          </Row>
          <ColumnInfo
            label="Chứng từ tham chiếu"
            value={
              data.referenceDocumentCode ||
              data.referenceDocumentTitle ||
              data.referenceDocumentName ||
              (data.referenceSourceName === "NONE"
                ? "---"
                : data.referenceSourceName)
            }
            full
          />
          <ColumnInfo
            label="Tên chứng từ tham chiếu"
            value={
              data.referenceSourceName === "NONE"
                ? "---"
                : data.referenceSourceName
            }
            full
          />
          <Row full gap={16}>
            <ColumnInfo
              label="Số Phụ lục Hợp đồng"
              value={data.contractAnnexNumberDisplay || "---"}
            />
            <ColumnInfo
              label="Ngày tạo PLHĐ"
              value={
                data.contractAnnexNumberDate
                  ? moment(data.contractAnnexNumberDate).format("DD/MM/YYYY")
                  : "---"
              }
            />
          </Row>
        </Column>
      </Collapse>

      <Spacer size={10} />

      {/* 2. Thông Tin Chung */}
      <Collapse
        title="II. Thông tin chung"
        collapsible
        containerStyle={globalStyle.collapseContainer}
      >
        <Column gap={12} style={styles.sectionContent}>
          <Row full gap={16}>
            <ColumnInfo label="Mã PO" value={data.code} />
            <ColumnInfo
              label="Loại PO"
              value={
                (data.typePO ? PO_TYPE_DISPLAY[data.typePO] : null) ??
                data.poTypeName ??
                data.typePO
              }
            />
          </Row>
          <ColumnInfo
            label="Công ty mua hàng"
            value={data.companyName || "---"}
            full
          />
          <ColumnInfo
            label="Plant"
            value={
              data.plantCode && data.plantName
                ? `${data.plantCode} - ${data.plantName}`
                : data.plantName || data.plantCode || "---"
            }
            full
          />
          <Row full gap={16}>
            <ColumnInfo
              label="Nhóm mua hàng"
              value={
                data.purchasingGroupCode && data.purchasingGroupName
                  ? `${data.purchasingGroupCode} - ${data.purchasingGroupName}`
                  : data.purchasingGroupName ||
                    data.purchasingGroupCode ||
                    "---"
              }
            />
            <ColumnInfo
              label="Tổ chức mua hàng"
              value={
                data.purchasingOrgCode && data.purchasingOrgName
                  ? `${data.purchasingOrgCode} - ${data.purchasingOrgName}`
                  : data.purchasingOrgName || data.purchasingOrgCode || "---"
              }
            />
          </Row>
          <Row full gap={16}>
            <ColumnInfo
              label="Ngày tạo đơn hàng"
              value={
                data.createdAt
                  ? moment(data.createdAt).format("DD/MM/YYYY")
                  : "---"
              }
            />
            <ColumnInfo label="File chứng từ" value={data.fileAttachment} />
          </Row>
        </Column>
      </Collapse>

      <Spacer size={10} />

      {/* 3. Thông tin NCC */}
      <Collapse
        title="III. Thông tin NCC"
        collapsible
        containerStyle={globalStyle.collapseContainer}
      >
        <Column gap={12} style={styles.sectionContent}>
          <ColumnInfo label="Nhà cung cấp" value={data.supplierName} full />
          <ColumnInfo
            label="Điều kiện thanh toán"
            value={data.paymentTermName}
            full
          />
          <Row full gap={16}>
            <ColumnInfo label="Đơn vị tiền tệ" value={data.currencyName} />
            <ColumnInfo
              label="GR Based IV"
              value={data.grbInv ? "Có" : "Không"}
            />
          </Row>
          <Row full gap={16}>
            <ColumnInfo
              label="Tỷ giá"
              value={data.excRate ?? data.exchangeRate}
            />
            <ColumnInfo
              label="Schema group"
              value={data.supplierSchemaName ?? data.schemaGroupName}
            />
          </Row>
          <Row full gap={16}>
            <ColumnInfo label="Email nhà cung cấp" value={data.supplierEmail} />
            <ColumnInfo label="SĐT" value={data.supplierPhone} />
          </Row>
          <ColumnInfo label="Fax" value={data.supplierFax} full />
          <ColumnInfo label="Địa chỉ" value={data.supplierAddress} full />

          <Row full gap={16}>
            <ColumnInfo label="Số tài khoản" value={data.supplierBankNumber} />
            <ColumnInfo
              label="Chủ tài khoản"
              value={data.supplierBankUsername}
            />
          </Row>
          <ColumnInfo label="Ngân hàng" value={data.supplierBankName} full />
          <ColumnInfo
            label="Chi nhánh"
            value={data.supplierBankBranchName}
            full
          />
          <Row full gap={16}>
            <ColumnInfo label="Swift Code" value={data.supplierSwiftCode} />
            <ColumnInfo label="IBAN" value={data.supplierIban} />
          </Row>

          <Table
            columns={[
              "Mã chức năng đối tác",
              "Chức năng đối tác",
              "Loại mã đối tác",
              "Mã đối tác",
              "Tên đối tác",
            ]}
            rows={(data.lstPartner || []).map((p: POPartner) => ({
              cells: [
                p.partnerFunctionCode,
                PO_FUNCTION_DISPLAY[p.partnerFunctionCode] ??
                  p.partnerFunctionCode,
                PO_PARTNER_TYPE_DISPLAY[p.partnerType] ?? p.partnerType,
                p.partnerCode,
                p.partnerName,
              ],
            }))}
            columnWidths={[150, 150, 150, 150, 200]}
            onRowDoublePress={handleRowDoublePressPartner}
            horizontalScroll
            containerStyle={{ width: "100%" }}
          />
        </Column>
      </Collapse>

      <Spacer size={10} />

      {/* 4. Thông tin ghi chú */}
      <Collapse
        title="IV. Thông tin ghi chú"
        collapsible
        containerStyle={globalStyle.collapseContainer}
      >
        <Column gap={12} style={styles.sectionContent}>
          <ColumnInfo label="Header text" value={data.headerText} full />
          <ColumnInfo label="Header note" value={data.headerNote} full />
          <Row full gap={16}>
            <ColumnInfo label="Pricing types" value={data.pricingTypes} />
            <ColumnInfo
              label="Ngày hoàn thành"
              value={
                data.completeDate
                  ? moment(data.completeDate).format("DD/MM/YYYY")
                  : "---"
              }
            />
          </Row>
          <Row full gap={16}>
            <ColumnInfo
              label="Ngày thanh toán"
              value={
                data.paymentsDate
                  ? moment(data.paymentsDate).format("DD/MM/YYYY")
                  : "---"
              }
            />
            <ColumnInfo label="Term of delivery" value={data.termDeli} />
          </Row>
          <Row full gap={16}>
            <ColumnInfo label="Mua lẻ" value={data.retail} />
            <ColumnInfo
              label="Số hợp đồng ngoại thương"
              value={data.numberForeignTradeContract ?? data.contractNumber}
            />
          </Row>
          <Row full gap={16}>
            <ColumnInfo label="Guarantees" value={data.guarantees} />
            <ColumnInfo
              label="Contract riders (clauses)"
              value={data.contractRiders}
            />
          </Row>
          <Row full gap={16}>
            <ColumnInfo label="Asset" value={data.asset} />
            <ColumnInfo
              label="Other contractual stipulations"
              value={data.otherContractualStipulations}
            />
          </Row>
          <Row full gap={16}>
            <ColumnInfo label="Inbound Delivery" value={data.inboundDeli} />
            <ColumnInfo label="Vendor memo (general)" value={data.vendorMemo} />
          </Row>
          <Row full gap={16}>
            <ColumnInfo label="CUP" value={data.cup} />
            <ColumnInfo label="CIG" value={data.cig} />
          </Row>
          <Row full gap={16}>
            <ColumnInfo label="MGO" value={data.mgo} />
            <ColumnInfo label="Size/Loại" value={data.size} />
          </Row>
          <Row full gap={16}>
            <ColumnInfo
              label="Orginin/Xuất sứ"
              value={data.orginin ?? data.origin}
            />
            <ColumnInfo
              label="Manufacturer/Nhà sản xuất"
              value={data.manufacturer}
            />
          </Row>
          <Row full gap={16}>
            <ColumnInfo label="Quality" value={data.quality} />
            <ColumnInfo label="Chất lượng" value={data.quality2} />
          </Row>
          <Row full gap={16}>
            <ColumnInfo label="Trade terms" value={data.tradeTerms} />
            <ColumnInfo label="Tiêu chuẩn" value={data.standard} />
          </Row>
          <Row full gap={16}>
            <ColumnInfo label="Packing" value={data.packing} />
            <ColumnInfo label="Đóng gói" value={data.pack} />
          </Row>
          <Row full gap={16}>
            <ColumnInfo label="Marking" value={data.marking} />
            <ColumnInfo label="Kí hiệu" value={data.symbol} />
          </Row>
          <Row full gap={16}>
            <ColumnInfo label="Shipment time" value={data.shipmentTime} />
            <ColumnInfo label="Cảng dở" value={data.badPort} />
          </Row>
          <Row full gap={16}>
            <ColumnInfo
              label="Partical Shipment"
              value={data.particalShipment}
            />
            <ColumnInfo
              label="Transhipment/Chuyển tải"
              value={data.transhipment}
            />
          </Row>
          <Row full gap={16}>
            <ColumnInfo
              label="Notice of Shipment"
              value={data.noticeOfShipment}
            />
            <ColumnInfo label="Payment" value={data.payment} />
          </Row>
          <Row full gap={16}>
            <ColumnInfo
              label="Documents requried"
              value={data.documentsRequried ?? data.documentsRequired}
            />
            <ColumnInfo label="Nơi nhận hàng" value={data.receivingDelivery} />
          </Row>
          <Row full gap={16}>
            <ColumnInfo label="Tel" value={data.tel} />
            <ColumnInfo label="Fax" value={data.fax} />
          </Row>
          <Row full gap={16}>
            <ColumnInfo
              label="Signed Commercial Invoice"
              value={data.signedCommercialInvoice}
            />
            <ColumnInfo
              label="Detail Packing List"
              value={data.detailPackingList}
            />
          </Row>
          <Row full gap={16}>
            <ColumnInfo
              label="Quality + Coil weight"
              value={data.coilWeight || "---"}
            />
            <ColumnInfo
              label="Chất lượng: + Trọng lượng"
              value={data.coilWeight2 || "---"}
            />
          </Row>
          <Row full gap={16}>
            <ColumnInfo label="Standard 2" value={data.standard2 || "---"} />
          </Row>
        </Column>
      </Collapse>

      <Spacer size={10} />

      {/* 5. Thông tin liên lạc */}
      <Collapse
        title="V. Thông tin liên lạc"
        collapsible
        containerStyle={globalStyle.collapseContainer}
      >
        <Table
          columns={[
            "Mã nhân viên",
            "Họ tên nhân viên",
            "Vị trí",
            "Cost center",
            "Số điện thoại",
          ]}
          rows={(data.lstMenber || []).map((c: POContact) => ({
            cells: [
              c.employeeCode,
              c.employeeName,
              c.positionName ?? c.position,
              c.costCenter,
              c.phone ?? c.phoneNumber,
            ],
          }))}
          columnWidths={[150, 200, 150, 150, 150]}
          onRowDoublePress={handleRowDoublePressContact}
          horizontalScroll
        />
      </Collapse>

      <Spacer size={10} />

      {/* 6. Dữ liệu khách hàng */}
      <Collapse
        title="VI. Dữ liệu khách hàng"
        collapsible
        containerStyle={globalStyle.collapseContainer}
      >
        <Column gap={12} style={styles.sectionContent}>
          <Row full gap={16}>
            <ColumnInfo
              label="Số phiếu cân"
              value={data.customerData?.numberVotes ?? data.numberVotes}
            />
            <ColumnInfo
              label="Ngày hoàn thành"
              value={
                (data.customerData?.completeDateCustomer ??
                data.completeDateCustomer)
                  ? moment(
                      data.customerData?.completeDateCustomer ??
                        data.completeDateCustomer,
                    ).format("DD/MM/YYYY")
                  : "---"
              }
            />
          </Row>
          <Row full gap={16}>
            <ColumnInfo
              label="Ngày thanh toán"
              value={
                (data.customerData?.paymentDateCustomer ??
                data.paymentDateCustomer)
                  ? moment(
                      data.customerData?.paymentDateCustomer ??
                        data.paymentDateCustomer,
                    ).format("DD/MM/YYYY")
                  : "---"
              }
            />
            <ColumnInfo
              label="Mua lẻ"
              value={
                (data.customerData?.isRetail ?? data.contractAnnexPaid)
                  ? "Có"
                  : "Không"
              }
            />
          </Row>
          <Row full gap={16}>
            <ColumnInfo
              label="Order"
              value={data.customerData?.order ?? data.order}
            />
            <ColumnInfo
              label="Notification"
              value={data.customerData?.notification ?? data.notification}
            />
          </Row>
          <Row full gap={16}>
            <ColumnInfo
              label="Số hợp đồng ngoại thương"
              value={
                data.customerData?.numberForeignTradeContractCustomer ??
                data.numberForeignTradeContractCustomer
              }
            />
            <ColumnInfo
              label="Ngày NCC giao hàng"
              value={
                (data.customerData?.deliSupplierDate ?? data.deliSupplierDate)
                  ? moment(
                      data.customerData?.deliSupplierDate ??
                        data.deliSupplierDate,
                    ).format("DD/MM/YYYY")
                  : "---"
              }
            />
          </Row>
          <Row full gap={16}>
            <ColumnInfo
              label="Vùng"
              value={data.customerData?.region ?? data.region}
            />
            <ColumnInfo
              label="Số hợp đồng bảo hiểm"
              value={
                data.customerData?.insuranceContractNumber ??
                data.insuranceContractNumber
              }
            />
          </Row>
          <Row full gap={16}>
            <ColumnInfo
              label="Tỷ lệ lẫn"
              value={data.customerData?.mixtureRatio ?? data.mixtureRatio}
            />
            <ColumnInfo
              label="Loại xe"
              value={data.customerData?.vehicleType ?? data.vehicleType}
            />
          </Row>
        </Column>
      </Collapse>

      <Spacer size={10} />

      {/* 7. Thông tin vận chuyển */}
      <Collapse
        title="VII. Thông tin vận chuyển"
        collapsible
        containerStyle={globalStyle.collapseContainer}
      >
        <Column gap={12} style={styles.sectionContent}>
          <Row full gap={16}>
            <ColumnInfo
              label="Điều khoản thương mại"
              value={data.incotermName}
            />
            <ColumnInfo
              label="Phiên bản Incoterm"
              value={data.incotermVersionName}
            />
          </Row>
          <Row full gap={16}>
            <ColumnInfo
              label="Địa điểm áp dụng Incoterm 1"
              value={data.incotermLocation1}
            />
            <ColumnInfo
              label="Địa điểm áp dụng Incoterm 2"
              value={data.incotermLocation2}
            />
          </Row>
        </Column>
      </Collapse>

      <Spacer size={16} />

      {/* 8. Danh sách Items của PO */}
      <Collapse
        title="VIII. Danh sách Items của PO"
        collapsible
        containerStyle={globalStyle.collapseContainer}
      >
        <Column full align="flex-end" margin={[10, 0]}>
          <Text bold>
            Trị giá PO:{" "}
            <Text color={colors.active} bold>
              {totalGrossValue} {data.currencyCode || "VNĐ"}
            </Text>
          </Text>
          <Text bold>
            Trị giá PO có phí:{" "}
            <Text color={colors.active} bold>
              {totalValue} {data.currencyCode || "VNĐ"}
            </Text>
          </Text>
        </Column>

        <Table
          columns={[
            "Close",
            "Delete",
            "Item line",
            "Acc",
            "Category",
            "Mã vật tư",
            "Mat Group",
            "External MatGr",
            "Mã tài sản",
            "Mã dịch vụ",
            "Short text",
            "Số lượng lên PO",
            ...(data.status === PO_STATUS.APPROVED ||
            data.status === PO_STATUS.CLOSED ||
            data.status === PO_STATUS.COMPLETE
              ? ["Số lượng đã nhập kho"]
              : []),
            "OUN (Đơn vị tính)",
            "Thời gian dự kiến hàng về kho",
            "Đơn giá RFQ",
            "Đơn vị tiền tệ RFQ",
            "Hệ số giá RFQ (PER)",
            "Đơn giá PO",
            "Đơn vị tiền tệ PO",
            "Hệ số giá PO (PER)",
            "OPU",
            "Fund center",
            "FP",
            "CI",
            "CIName",
            "Kỳ ngân sách",
            "Ngân sách Item",
            "Ngân sách",
            "Dung sai giao thiếu (%)",
            "Dung sai giao thừa (%)",
            "Vị trí kho hàng",
            "ValType",
            "Rfq",
            "Item Rfq",
            "PR",
            "Item PR",
          ]}
          rows={[
            {
              cells: [
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "Tổng số lượng:",
                formatNumberValue(totalQuantityUptoPO),
                ...(data.status === PO_STATUS.APPROVED ||
                data.status === PO_STATUS.CLOSED ||
                data.status === PO_STATUS.COMPLETE
                  ? [""]
                  : []),
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
              ],
            },
            ...(data.lstItemPo || []).map((item: any) => ({
              cells: [
                item.itemClosed || "---",
                item.itemDeleted || "---",
                item.itemLine || item.itemNo || "---",
                item.acccateName ||
                  item.accountAssignment ||
                  item.acccate ||
                  "---",
                item.itemcateName ||
                  item.itemCategory ||
                  item.category ||
                  "---",
                item.materialCode || item.code || "---",
                item.materialGroupName || item.materialGroupCode || "---",
                item.extMatGrName ||
                  item.externalMaterialGroupName ||
                  item.externalMaterialGroupCode ||
                  "---",
                item.assetCode || "---",
                item.serviceCode || item.orderCode || "---",
                item.shortText || item.materialName || "---",
                formatNumberValue(item.quantityUptoPO),
                ...(data.status === PO_STATUS.APPROVED ||
                data.status === PO_STATUS.CLOSED ||
                data.status === PO_STATUS.COMPLETE
                  ? [formatNumberValue(item.warehouseQuantity)]
                  : []),
                item.uomCode ||
                  item.ounName ||
                  item.unitName ||
                  item.uom ||
                  "---",
                item.deliveryDate || item.expectedDeliveryDate
                  ? moment(
                      item.deliveryDate || item.expectedDeliveryDate,
                    ).format("DD/MM/YYYY")
                  : "---",
                formatNumberValue(
                  item.price || item.grossPrice || item.rfqPrice,
                ),
                item.currencyName || item.rfqCurrency || "---",
                item.per || item.rfqPer || "---",
                formatNumberValue(
                  item.pricePo || item.grossPrice || item.netPrice,
                ),
                item.currencyPoName ||
                  item.currencyName ||
                  item.currencyPoCode ||
                  item.currencyCode ||
                  data.currencyCode ||
                  "---",
                item.perPo || item.per || "---",
                getItemOPUName(item),
                item.fc ||
                  item.fundCenter ||
                  item.fcPr ||
                  item.fundsCenterPr ||
                  "---",
                item.fp || item.fpPr || "---",
                item.ci || item.ciPr || item.commitmentItemCode || "---",
                item.ciname ||
                  item.ciPrName ||
                  item.commitmentItemName ||
                  "---",
                item.budgetPeriod || item.budgetperiod || "---",
                formatNumberValue(
                  item.valueItem || item.budgetItem || item.valueItemOld,
                ),
                formatNumberValue(item.totalBudget || item.totalBudgetOld),
                formatNumberValue(item.lowerTolerance),
                formatNumberValue(item.upperTolerance),
                item.materialStorageLocationName ||
                  item.storageLocation ||
                  item.storeLocationCode ||
                  "---",
                item.validationType ||
                  item.valType ||
                  item.valuationType ||
                  "---",
                item.rfqCode ||
                  item.rfq ||
                  (item.__rfq__ && item.__rfq__.code) ||
                  "---",
                item.rfqItem || item.rfqItemNo || "---",
                item.prCode || item.purchaseRequisition || "---",
                item.prItemCode || item.prItem || item.prItemNo || "---",
              ],
            })),
          ]}
          columnWidths={[
            70, 70, 120, 120, 120, 200, 150, 200, 150, 150, 200, 150, 150, 180,
            200, 180, 150, 200, 180, 150, 140, 180, 180, 180, 180, 140, 180,
            180, 180, 120, 120, 200, 140, 140, 140, 140, 140,
          ]}
          onRowDoublePress={handleRowDoublePressItem}
          horizontalScroll
        />
      </Collapse>
    </ScrollView>
  );
};

export default PODetailInfoTab;

const styles = StyleSheet.create({
  scrollContent: {},
  sectionContent: {
    paddingTop: 12,
    paddingBottom: 24,
    paddingHorizontal: 5,
  },
  subTitle: {
    marginTop: 12,
    marginBottom: 8,
    borderBottomWidth: 1,
    paddingBottom: 4,
  },
  headerFilterBtn: {
    width: 50,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  filterDot: {
    position: "absolute",
    top: 8,
    right: 12,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
