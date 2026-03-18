import moment from "moment";
import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Collapse, Column, Row, Spacer, Table, Text } from "~/common";
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
import { POFieldItem } from "../components/POFieldItem";
import POContactDetailSheet from "../sheets/POContactDetailSheet";
import POContactTableFilterSheet from "../sheets/POContactTableFilterSheet";
import POItemTableFilterSheet, {
  POItemTableFilters,
} from "../sheets/POItemTableFilterSheet";
import POPartnerDetailSheet from "../sheets/POPartnerDetailSheet";
import POPartnerTableFilterSheet from "../sheets/POPartnerTableFilterSheet";

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

  const [partnerFilters, setPartnerFilters] = useState({
    functionCode: "",
    functionName: "",
    partnerType: "",
    partnerCode: "",
    partnerName: "",
  });

  const [contactFilters, setContactFilters] = useState({
    code: "",
    name: "",
    position: "",
    costCenter: "",
    phone: "",
  });

  const [itemFilters, setItemFilters] = useState<POItemTableFilters>({
    itemClosed: "",
    itemDeleted: "",
    itemNo: "",
    acccate: "",
    category: "",
    materialCode: "",
    matGroup: "",
    extMatGr: "",
    assetCode: "",
    serviceCode: "",
    shortText: "",
    quantityUptoPO: "",
    uom: "",
    deliveryDate: undefined,
    grossPrice: "",
    currencyRfq: "",
    perRfq: "",
    pricePo: "",
    currencyPo: "",
    perPo: "",
    opu: "",
    fc: "",
    fp: "",
    ci: "",
    ciName: "",
    budgetPeriod: "",
    valueItem: "",
    totalBudget: "",
    storageLocation: "",
    valType: "",
    rfqCode: "",
    rfqItem: "",
    prCode: "",
    prItem: "",
  });

  const formatNumberValue = (val: any) => {
    if (!val && val !== 0) return "0";
    return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const totalValue = useMemo(() => {
    let rawValue = 0;
    if (data.totalPO) {
      rawValue = Number(data.totalPO);
    } else {
      rawValue = (data.lstItemPo || []).reduce((sum: number, item: any) => {
        return (
          sum +
          (item.totalPrice ||
            item.netValue ||
            (item.quantityUptoPO || item.quantity || 0) *
              (item.grossPrice || item.netPrice || 0))
        );
      }, 0);
    }
    return formatNumberValue(rawValue);
  }, [data.totalPO, data.lstItemPo]);

  const getItemOPUName = (item: any) => {
    return (
      item.opuName ||
      dataUom?.find?.((u: any) => u.id === item.opuId)?.name ||
      "---"
    );
  };

  const handleOpenPartnerFilter = useCallback(() => {
    openSheet(
      <POPartnerTableFilterSheet
        initialFilters={partnerFilters}
        onApply={setPartnerFilters}
        onClose={closeSheet}
      />,
    );
  }, [openSheet, partnerFilters, closeSheet]);

  const handleOpenContactFilter = useCallback(() => {
    openSheet(
      <POContactTableFilterSheet
        initialFilters={contactFilters}
        onApply={setContactFilters}
        onClose={closeSheet}
      />,
    );
  }, [openSheet, contactFilters, closeSheet]);

  const handleOpenItemFilter = useCallback(() => {
    openSheet(
      <POItemTableFilterSheet
        initialFilters={itemFilters}
        onApply={setItemFilters}
        onClose={closeSheet}
      />,
    );
  }, [openSheet, itemFilters, closeSheet]);

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
      contentContainerStyle={styles.scrollContent}
    >
      {/* 1. Tham chiếu */}
      <Collapse title="I. THAM CHIẾU" collapsible defaultExpanded={true}>
        <Column gap={12} style={styles.sectionContent}>
          <Row full gap={16}>
            <POFieldItem label="Nguồn Tham Chiếu" value={referenceSourceName} />
          </Row>
          <POFieldItem
            label="Chứng từ tham chiếu"
            value={
              data.referenceSourceName === "NONE"
                ? "---"
                : data.referenceSourceName
            }
            fullWidth
          />
        </Column>
      </Collapse>

      <Spacer size={12} />

      {/* 2. Thông Tin Chung */}
      <Collapse title="II. THÔNG TIN CHUNG" collapsible defaultExpanded={false}>
        <Column gap={12} style={styles.sectionContent}>
          <Row full gap={16}>
            <POFieldItem label="Mã PO" value={data.code} />
            <POFieldItem
              label="Loại PO"
              value={
                (data.typePO ? PO_TYPE_DISPLAY[data.typePO] : null) ??
                data.poTypeName ??
                data.typePO
              }
            />
          </Row>
          <POFieldItem
            label="Công ty mua hàng"
            value={data.companyName || "---"}
            fullWidth
          />
          <POFieldItem
            label="Plant"
            value={
              data.plantCode && data.plantName
                ? `${data.plantCode} - ${data.plantName}`
                : data.plantName || data.plantCode || "---"
            }
            fullWidth
          />
          <Row full gap={16}>
            <POFieldItem
              label="Nhóm mua hàng"
              value={
                data.purchasingGroupCode && data.purchasingGroupName
                  ? `${data.purchasingGroupCode} - ${data.purchasingGroupName}`
                  : data.purchasingGroupName ||
                    data.purchasingGroupCode ||
                    "---"
              }
            />
            <POFieldItem
              label="Tổ chức mua hàng"
              value={
                data.purchasingOrgCode && data.purchasingOrgName
                  ? `${data.purchasingOrgCode} - ${data.purchasingOrgName}`
                  : data.purchasingOrgName || data.purchasingOrgCode || "---"
              }
            />
          </Row>
          <Row full gap={16}>
            <POFieldItem
              label="Ngày tạo đơn hàng"
              value={
                data.createdAt
                  ? moment(data.createdAt).format("DD/MM/YYYY")
                  : "---"
              }
            />
            <POFieldItem label="File chứng từ" value={data.fileAttachment} />
          </Row>
        </Column>
      </Collapse>

      <Spacer size={12} />

      {/* 3. Thông tin NCC */}
      <Collapse title="III. THÔNG TIN NCC" collapsible defaultExpanded={false}>
        <Column gap={12} style={styles.sectionContent}>
          <POFieldItem
            label="Nhà cung cấp"
            value={data.supplierName}
            fullWidth
          />
          <POFieldItem
            label="Điều kiện thanh toán"
            value={data.paymentTermName}
            fullWidth
          />
          <Row full gap={16}>
            <POFieldItem label="Đơn vị tiền tệ" value={data.currencyName} />
            <POFieldItem
              label="GR Based IV"
              value={data.grbInv ? "Có" : "Không"}
            />
          </Row>
          <Row full gap={16}>
            <POFieldItem
              label="Tỷ giá"
              value={data.excRate ?? data.exchangeRate}
            />
            <POFieldItem
              label="Schema group"
              value={data.supplierSchemaName ?? data.schemaGroupName}
            />
          </Row>
          <Row full gap={16}>
            <POFieldItem
              label="Email nhà cung cấp"
              value={data.supplierEmail}
            />
            <POFieldItem label="SĐT" value={data.supplierPhone} />
          </Row>
          <POFieldItem label="Fax" value={data.supplierFax} fullWidth />
          <POFieldItem label="Địa chỉ" value={data.supplierAddress} fullWidth />

          <Row full gap={16}>
            <POFieldItem label="Số tài khoản" value={data.supplierBankNumber} />
            <POFieldItem
              label="Chủ tài khoản"
              value={data.supplierBankUsername}
            />
          </Row>
          <POFieldItem
            label="Ngân hàng"
            value={data.supplierBankName}
            fullWidth
          />
          <POFieldItem
            label="Chi nhánh"
            value={data.supplierBankBranchName}
            fullWidth
          />
          <Row full gap={16}>
            <POFieldItem label="Swift Code" value={data.supplierSwiftCode} />
            <POFieldItem label="IBAN" value={data.supplierIban} />
          </Row>

          <Table
            columns={[
              "Mã chức năng đối tác",
              "Chức năng đối tác",
              "Loại mã đối tác",
              "Mã đối tác",
              "Tên đối tác",
              <Table.ButtonFilterTable
                key="partner-filter"
                onPress={handleOpenPartnerFilter}
              />,
            ]}
            rows={(data.lstPartner || [])
              .filter((p) => {
                if (!p.partnerCode && !p.partnerName) return false;
                const matchFunc =
                  !partnerFilters.functionCode ||
                  p.partnerFunctionCode
                    ?.toLowerCase()
                    .includes(partnerFilters.functionCode.toLowerCase());
                const matchFuncName =
                  !partnerFilters.functionName ||
                  (
                    PO_FUNCTION_DISPLAY[p.partnerFunctionCode] ??
                    p.partnerFunctionCode
                  )
                    ?.toLowerCase()
                    .includes(partnerFilters.functionName.toLowerCase());
                const matchType =
                  !partnerFilters.partnerType ||
                  p.partnerType
                    ?.toLowerCase()
                    .includes(partnerFilters.partnerType.toLowerCase());
                const matchCode =
                  !partnerFilters.partnerCode ||
                  p.partnerCode
                    ?.toLowerCase()
                    .includes(partnerFilters.partnerCode.toLowerCase());
                const matchName =
                  !partnerFilters.partnerName ||
                  p.partnerName
                    ?.toLowerCase()
                    .includes(partnerFilters.partnerName.toLowerCase());
                return (
                  matchFunc &&
                  matchFuncName &&
                  matchType &&
                  matchCode &&
                  matchName
                );
              })
              .map((p: POPartner, idx: number) => ({
                cells: [
                  p.partnerFunctionCode,
                  PO_FUNCTION_DISPLAY[p.partnerFunctionCode] ??
                    p.partnerFunctionCode,
                  PO_PARTNER_TYPE_DISPLAY[p.partnerType] ?? p.partnerType,
                  p.partnerCode,
                  p.partnerName,
                  <Table.EyeDetailRow
                    key={`view-${idx}`}
                    onPress={() => onShowPartnerDetail(p)}
                  />,
                ],
              }))}
            columnWidths={[150, 150, 150, 150, 200, 60]}
            stickyColumn="right"
            horizontalScroll
            containerStyle={{ marginHorizontal: 16 }}
          />
        </Column>
      </Collapse>

      <Spacer size={12} />

      {/* 4. Thông tin ghi chú */}
      <Collapse
        title="IV. THÔNG TIN GHI CHÚ"
        collapsible
        defaultExpanded={false}
      >
        <Column gap={12} style={styles.sectionContent}>
          <POFieldItem label="Header text" value={data.headerText} fullWidth />
          <POFieldItem label="Header note" value={data.headerNote} fullWidth />
          <Row full gap={16}>
            <POFieldItem label="Pricing types" value={data.pricingTypes} />
            <POFieldItem
              label="Ngày hoàn thành"
              value={
                data.completeDate
                  ? moment(data.completeDate).format("DD/MM/YYYY")
                  : "---"
              }
            />
          </Row>
          <Row full gap={16}>
            <POFieldItem
              label="Ngày thanh toán"
              value={
                data.paymentsDate
                  ? moment(data.paymentsDate).format("DD/MM/YYYY")
                  : "---"
              }
            />
            <POFieldItem label="Term of delivery" value={data.termDeli} />
          </Row>
          <Row full gap={16}>
            <POFieldItem label="Mua lẻ" value={data.retail} />
            <POFieldItem
              label="Số hợp đồng ngoại thương"
              value={data.numberForeignTradeContract ?? data.contractNumber}
            />
          </Row>
          <Row full gap={16}>
            <POFieldItem label="Guarantees" value={data.guarantees} />
            <POFieldItem
              label="Contract riders (clauses)"
              value={data.contractRiders}
            />
          </Row>
          <Row full gap={16}>
            <POFieldItem label="Asset" value={data.asset} />
            <POFieldItem
              label="Other contractual stipulations"
              value={data.otherContractualStipulations}
            />
          </Row>
          <Row full gap={16}>
            <POFieldItem label="Inbound Delivery" value={data.inboundDeli} />
            <POFieldItem
              label="Vendor memo (general)"
              value={data.vendorMemo}
            />
          </Row>
          <Row full gap={16}>
            <POFieldItem label="CUP" value={data.cup} />
            <POFieldItem label="CIG" value={data.cig} />
          </Row>
          <Row full gap={16}>
            <POFieldItem label="MGO" value={data.mgo} />
            <POFieldItem label="Size/Loại" value={data.size} />
          </Row>
          <Row full gap={16}>
            <POFieldItem
              label="Orginin/Xuất sứ"
              value={data.orginin ?? data.origin}
            />
            <POFieldItem
              label="Manufacturer/Nhà sản xuất"
              value={data.manufacturer}
            />
          </Row>
          <Row full gap={16}>
            <POFieldItem label="Quality" value={data.quality} />
            <POFieldItem label="Chất lượng" value={data.quality2} />
          </Row>
          <Row full gap={16}>
            <POFieldItem label="Trade terms" value={data.tradeTerms} />
            <POFieldItem label="Tiêu chuẩn" value={data.standard} />
          </Row>
          <Row full gap={16}>
            <POFieldItem label="Packing" value={data.packing} />
            <POFieldItem label="Đóng gói" value={data.pack} />
          </Row>
          <Row full gap={16}>
            <POFieldItem label="Marking" value={data.marking} />
            <POFieldItem label="Kí hiệu" value={data.symbol} />
          </Row>
          <Row full gap={16}>
            <POFieldItem label="Shipment time" value={data.shipmentTime} />
            <POFieldItem label="Cảng dở" value={data.badPort} />
          </Row>
          <Row full gap={16}>
            <POFieldItem
              label="Partical Shipment"
              value={data.particalShipment}
            />
            <POFieldItem
              label="Transhipment/Chuyển tải"
              value={data.transhipment}
            />
          </Row>
          <Row full gap={16}>
            <POFieldItem
              label="Notice of Shipment"
              value={data.noticeOfShipment}
            />
            <POFieldItem label="Payment" value={data.payment} />
          </Row>
          <Row full gap={16}>
            <POFieldItem
              label="Documents requried"
              value={data.documentsRequried ?? data.documentsRequired}
            />
            <POFieldItem label="Nơi nhận hàng" value={data.receivingDelivery} />
          </Row>
          <Row full gap={16}>
            <POFieldItem label="Tel" value={data.tel} />
            <POFieldItem label="Fax" value={data.fax} />
          </Row>
          <Row full gap={16}>
            <POFieldItem
              label="Signed Commercial Invoice"
              value={data.signedCommercialInvoice}
            />
            <POFieldItem
              label="Detail Packing List"
              value={data.detailPackingList}
            />
          </Row>
        </Column>
      </Collapse>

      <Spacer size={12} />

      {/* 5. Thông tin liên lạc */}
      <Collapse
        title="V. THÔNG TIN LIÊN LẠC"
        collapsible
        defaultExpanded={false}
      >
        <Table
          columns={[
            "Mã nhân viên",
            "Họ tên nhân viên",
            "Vị trí",
            "Cost center",
            "Số điện thoại",
            <Table.ButtonFilterTable
              key="contact-filter"
              onPress={handleOpenContactFilter}
            />,
          ]}
          rows={(data.lstMenber || [])
            .filter((c) => {
              if (!c.employeeCode && !c.employeeName) return false;
              const matchCode =
                !contactFilters.code ||
                c.employeeCode
                  ?.toLowerCase()
                  .includes(contactFilters.code.toLowerCase());
              const matchName =
                !contactFilters.name ||
                c.employeeName
                  ?.toLowerCase()
                  .includes(contactFilters.name.toLowerCase());
              const matchPos =
                !contactFilters.position ||
                (c.positionName ?? c.position)
                  ?.toLowerCase()
                  .includes(contactFilters.position.toLowerCase());
              const matchCost =
                !contactFilters.costCenter ||
                c.costCenter
                  ?.toLowerCase()
                  .includes(contactFilters.costCenter.toLowerCase());
              const matchPhone =
                !contactFilters.phone ||
                (c.phone ?? c.phoneNumber)
                  ?.toLowerCase()
                  .includes(contactFilters.phone.toLowerCase());
              return (
                matchCode && matchName && matchPos && matchCost && matchPhone
              );
            })
            .map((c: POContact, idx: number) => ({
              cells: [
                c.employeeCode,
                c.employeeName,
                c.positionName ?? c.position,
                c.costCenter,
                c.phone ?? c.phoneNumber,
                <Table.EyeDetailRow
                  key={`view-${idx}`}
                  onPress={() => onShowContactDetail(c)}
                />,
              ],
            }))}
          columnWidths={[150, 200, 150, 150, 150, 60]}
          stickyColumn="right"
          horizontalScroll
        />
      </Collapse>

      <Spacer size={12} />

      {/* 6. Dữ liệu khách hàng */}
      <Collapse
        title="VI. DỮ LIỆU KHÁCH HÀNG"
        collapsible
        defaultExpanded={false}
      >
        <Column gap={12} style={styles.sectionContent}>
          <Row full gap={16}>
            <POFieldItem
              label="Số phiếu cân"
              value={data.customerData?.numberVotes ?? data.numberVotes}
            />
            <POFieldItem
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
            <POFieldItem
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
            <POFieldItem
              label="Mua lẻ"
              value={
                (data.customerData?.isRetail ?? data.contractAnnexPaid)
                  ? "Có"
                  : "Không"
              }
            />
          </Row>
          <Row full gap={16}>
            <POFieldItem
              label="Order"
              value={data.customerData?.order ?? data.order}
            />
            <POFieldItem
              label="Notification"
              value={data.customerData?.notification ?? data.notification}
            />
          </Row>
          <Row full gap={16}>
            <POFieldItem
              label="Số hợp đồng ngoại thương"
              value={
                data.customerData?.numberForeignTradeContractCustomer ??
                data.numberForeignTradeContractCustomer
              }
            />
            <POFieldItem
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
            <POFieldItem
              label="Vùng"
              value={data.customerData?.region ?? data.region}
            />
            <POFieldItem
              label="Số hợp đồng bảo hiểm"
              value={
                data.customerData?.insuranceContractNumber ??
                data.insuranceContractNumber
              }
            />
          </Row>
          <Row full gap={16}>
            <POFieldItem
              label="Tỷ lệ lẫn"
              value={data.customerData?.mixtureRatio ?? data.mixtureRatio}
            />
            <POFieldItem
              label="Loại xe"
              value={data.customerData?.vehicleType ?? data.vehicleType}
            />
          </Row>
        </Column>
      </Collapse>

      <Spacer size={12} />

      {/* 7. Thông tin vận chuyển */}
      <Collapse
        title="VII. THÔNG TIN VẬN CHUYỂN"
        collapsible
        defaultExpanded={false}
      >
        <Column gap={12} style={styles.sectionContent}>
          <Row full gap={16}>
            <POFieldItem
              label="Điều khoản thương mại"
              value={data.incotermName}
            />
            <POFieldItem
              label="Phiên bản Incoterm"
              value={data.incotermVersionName}
            />
          </Row>
          <Row full gap={16}>
            <POFieldItem
              label="Địa điểm áp dụng Incoterm 1"
              value={data.incotermLocation1}
            />
            <POFieldItem
              label="Địa điểm áp dụng Incoterm 2"
              value={data.incotermLocation2}
            />
          </Row>
        </Column>
      </Collapse>

      <Spacer size={12} />

      {/* 8. Danh sách Items của PO */}
      <Collapse
        title="VIII. DANH SÁCH ITEMS CỦA PO"
        collapsible
        defaultExpanded={false}
      >
        <Row full justify="flex-end" margin={[10, 0]}>
          <Text bold>
            Trị giá PO:{" "}
            <Text color={colors.primary} bold>
              {totalValue}VNĐ
            </Text>
          </Text>
        </Row>

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
            "Vị trí kho hàng",
            "ValType",
            "Rfq",
            "Item Rfq",
            "PR",
            "Item PR",
            <Table.ButtonFilterTable
              key="item-filter"
              onPress={handleOpenItemFilter}
            />,
          ]}
          rows={(data.lstItemPo || [])
            .filter((item: any) => {
              const matchClosed =
                !itemFilters.itemClosed ||
                (item.itemClosed || "")
                  .toLowerCase()
                  .includes(itemFilters.itemClosed.toLowerCase());
              const matchDeleted =
                !itemFilters.itemDeleted ||
                (item.itemDeleted || "")
                  .toLowerCase()
                  .includes(itemFilters.itemDeleted.toLowerCase());
              const matchItemNo =
                !itemFilters.itemNo ||
                (item.itemLine || item.itemNo || "")
                  .toLowerCase()
                  .includes(itemFilters.itemNo.toLowerCase());
              const matchAccCate =
                !itemFilters.acccate ||
                (
                  item.acccateName ||
                  item.accountAssignment ||
                  item.acccate ||
                  ""
                )
                  .toLowerCase()
                  .includes(itemFilters.acccate.toLowerCase());
              const matchCategory =
                !itemFilters.category ||
                (item.itemcateName || item.itemCategory || "")
                  .toLowerCase()
                  .includes(itemFilters.category.toLowerCase());
              const matchMaterial =
                !itemFilters.materialCode ||
                (item.materialCode || "")
                  .toLowerCase()
                  .includes(itemFilters.materialCode.toLowerCase());
              const matchMatGroup =
                !itemFilters.matGroup ||
                (item.materialGroupName || item.materialGroupCode || "")
                  .toLowerCase()
                  .includes(itemFilters.matGroup.toLowerCase());
              const matchExtMatGr =
                !itemFilters.extMatGr ||
                (
                  item.extMatGrName ||
                  item.externalMaterialGroupName ||
                  item.externalMaterialGroupCode ||
                  ""
                )
                  .toLowerCase()
                  .includes(itemFilters.extMatGr.toLowerCase());
              const matchAsset =
                !itemFilters.assetCode ||
                (item.assetCode || "")
                  .toLowerCase()
                  .includes(itemFilters.assetCode.toLowerCase());
              const matchService =
                !itemFilters.serviceCode ||
                (item.serviceCode || "")
                  .toLowerCase()
                  .includes(itemFilters.serviceCode.toLowerCase());
              const matchShortText =
                !itemFilters.shortText ||
                (item.shortText || item.materialName || "")
                  .toLowerCase()
                  .includes(itemFilters.shortText.toLowerCase());
              const matchQuantity =
                !itemFilters.quantityUptoPO ||
                String(item.quantityUptoPO || "")
                  .toLowerCase()
                  .includes(itemFilters.quantityUptoPO.toLowerCase());
              const matchUom =
                !itemFilters.uom ||
                (
                  item.uomCode ||
                  item.ounName ||
                  item.unitName ||
                  item.uom ||
                  ""
                )
                  .toLowerCase()
                  .includes(itemFilters.uom.toLowerCase());
              const matchDeliveryDate =
                !itemFilters.deliveryDate ||
                (item.deliveryDate || item.expectedDeliveryDate
                  ? moment(
                      item.deliveryDate || item.expectedDeliveryDate,
                    ).isSame(moment(itemFilters.deliveryDate), "day")
                  : false);
              const matchGrossPrice =
                !itemFilters.grossPrice ||
                String(item.grossPrice || item.rfqPrice || "")
                  .toLowerCase()
                  .includes(itemFilters.grossPrice.toLowerCase());
              const matchCurrencyRfq =
                !itemFilters.currencyRfq ||
                (item.currencyName || item.rfqCurrency || "")
                  .toLowerCase()
                  .includes(itemFilters.currencyRfq.toLowerCase());
              const matchPerRfq =
                !itemFilters.perRfq ||
                String(item.per || item.rfqPer || "")
                  .toLowerCase()
                  .includes(itemFilters.perRfq.toLowerCase());
              const matchPricePo =
                !itemFilters.pricePo ||
                String(item.pricePo || item.grossPrice || item.netPrice || "")
                  .toLowerCase()
                  .includes(itemFilters.pricePo.toLowerCase());
              const matchCurrencyPo =
                !itemFilters.currencyPo ||
                (
                  item.currencyPoName ||
                  item.currencyName ||
                  item.currencyPoCode ||
                  item.currencyCode ||
                  data.currencyCode ||
                  ""
                )
                  .toLowerCase()
                  .includes(itemFilters.currencyPo.toLowerCase());
              const matchPerPo =
                !itemFilters.perPo ||
                String(item.perPo || item.per || "")
                  .toLowerCase()
                  .includes(itemFilters.perPo.toLowerCase());
              const matchOpu =
                !itemFilters.opu ||
                getItemOPUName(item)
                  .toLowerCase()
                  .includes(itemFilters.opu.toLowerCase());
              const matchFc =
                !itemFilters.fc ||
                (item.fcPr || item.fundsCenterPr || item.fc || "")
                  .toLowerCase()
                  .includes(itemFilters.fc.toLowerCase());
              const matchFp =
                !itemFilters.fp ||
                (item.fpPr || item.fp || "")
                  .toLowerCase()
                  .includes(itemFilters.fp.toLowerCase());
              const matchCi =
                !itemFilters.ci ||
                (item.ciPr || item.commitmentItemCode || item.ci || "")
                  .toLowerCase()
                  .includes(itemFilters.ci.toLowerCase());
              const matchCiName =
                !itemFilters.ciName ||
                (item.ciPrName || item.ciname || item.commitmentItemName || "")
                  .toLowerCase()
                  .includes(itemFilters.ciName.toLowerCase());
              const matchBudgetPeriod =
                !itemFilters.budgetPeriod ||
                (item.budgetPeriod || "")
                  .toLowerCase()
                  .includes(itemFilters.budgetPeriod.toLowerCase());
              const matchValueItem =
                !itemFilters.valueItem ||
                String(
                  item.valueItem || item.budgetItem || item.valueItemOld || "",
                )
                  .toLowerCase()
                  .includes(itemFilters.valueItem.toLowerCase());
              const matchTotalBudget =
                !itemFilters.totalBudget ||
                String(item.totalBudget || item.totalBudgetOld || "")
                  .toLowerCase()
                  .includes(itemFilters.totalBudget.toLowerCase());
              const matchSloc =
                !itemFilters.storageLocation ||
                (item.storageLocation || item.storeLocationCode || "")
                  .toLowerCase()
                  .includes(itemFilters.storageLocation.toLowerCase());
              const matchValType =
                !itemFilters.valType ||
                (item.valType || item.valuationType || "")
                  .toLowerCase()
                  .includes(itemFilters.valType.toLowerCase());
              const matchRfqCode =
                !itemFilters.rfqCode ||
                (
                  item.rfqCode ||
                  item.rfq ||
                  (item.__rfq__ && item.__rfq__.code) ||
                  ""
                )
                  .toLowerCase()
                  .includes(itemFilters.rfqCode.toLowerCase());
              const matchRfqItem =
                !itemFilters.rfqItem ||
                String(item.rfqItem || item.rfqItemNo || "")
                  .toLowerCase()
                  .includes(itemFilters.rfqItem.toLowerCase());
              const matchPrCode =
                !itemFilters.prCode ||
                (item.prCode || item.purchaseRequisition || "")
                  .toLowerCase()
                  .includes(itemFilters.prCode.toLowerCase());
              const matchPrItem =
                !itemFilters.prItem ||
                (item.prItemCode || item.prItem || item.prItemNo || "")
                  .toLowerCase()
                  .includes(itemFilters.prItem.toLowerCase());

              return (
                matchClosed &&
                matchDeleted &&
                matchItemNo &&
                matchAccCate &&
                matchCategory &&
                matchMaterial &&
                matchMatGroup &&
                matchExtMatGr &&
                matchAsset &&
                matchService &&
                matchShortText &&
                matchQuantity &&
                matchUom &&
                matchDeliveryDate &&
                matchGrossPrice &&
                matchCurrencyRfq &&
                matchPerRfq &&
                matchPricePo &&
                matchCurrencyPo &&
                matchPerPo &&
                matchOpu &&
                matchFc &&
                matchFp &&
                matchCi &&
                matchCiName &&
                matchBudgetPeriod &&
                matchValueItem &&
                matchTotalBudget &&
                matchSloc &&
                matchValType &&
                matchRfqCode &&
                matchRfqItem &&
                matchPrCode &&
                matchPrItem
              );
            })
            .map((item: any, idx: number) => ({
              cells: [
                item.itemClosed || "---",
                item.itemDeleted || "---",
                item.itemLine ||
                  item.itemNo ||
                  String(idx + 1).padStart(5, "0"),
                item.acccateName ||
                  item.accountAssignment ||
                  item.acccate ||
                  "---",
                item.itemcateName || item.itemCategory || "---",
                item.materialCode || "---",
                item.materialGroupName || item.materialGroupCode || "---",
                item.extMatGrName ||
                  item.externalMaterialGroupName ||
                  item.externalMaterialGroupCode ||
                  "---",
                item.assetCode || "---",
                item.serviceCode || "---",
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
                formatNumberValue(item.grossPrice || item.rfqPrice),
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
                item.fcPr || item.fundsCenterPr || item.fc || "---",
                item.fpPr || item.fp || "---",
                item.ciPr || item.commitmentItemCode || item.ci || "---",
                item.ciPrName ||
                  item.ciname ||
                  item.commitmentItemName ||
                  "---",
                item.budgetPeriod || "---",
                formatNumberValue(
                  item.valueItem || item.budgetItem || item.valueItemOld,
                ),
                formatNumberValue(item.totalBudget || item.totalBudgetOld),
                item.storageLocation || item.storeLocationCode || "---",
                item.valType || item.valuationType || "---",
                item.rfqCode ||
                  item.rfq ||
                  (item.__rfq__ && item.__rfq__.code) ||
                  "---",
                item.rfqItem || item.rfqItemNo || "---",
                item.prCode || item.purchaseRequisition || "---",
                item.prItemCode || item.prItem || item.prItemNo || "---",
                <Table.EyeDetailRow
                  key={`view-item-${idx}`}
                  onPress={() => onShowItemDetail?.(item)}
                />,
              ],
            }))}
          columnWidths={[
            70, 70, 120, 120, 120, 200, 150, 200, 150, 150, 150, 150, 150, 180,
            200, 180, 150, 200, 180, 150, 140, 180, 180, 180, 180, 140, 180,
            180, 180, 180, 140, 140, 140, 140, 50,
          ]}
          stickyColumn="right"
          horizontalScroll
        />
      </Collapse>

      <Spacer size={120} />
    </ScrollView>
  );
};

export default PODetailInfoTab;

const styles = StyleSheet.create({
  scrollContent: {
    padding: 5,
  },
  sectionContent: {
    paddingTop: 12,
    paddingBottom: 24,
    paddingHorizontal: 0,
  },
  subTitle: {
    marginTop: 12,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
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
    backgroundColor: "#F80D53",
  },
});
