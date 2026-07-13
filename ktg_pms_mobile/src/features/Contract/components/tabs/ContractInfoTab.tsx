import React, { useCallback, useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Collapse, Row, Spacer, Table, Text } from "~/common";
import { useTheme } from "~/hooks/useTheme";
import DateHelper from "~/utils/date";
import NumberHelper from "~/utils/number";
import { isNTContractType } from "~/utils/contract";
import {
  ContractDetail,
  ContractItem,
  ContractPaymentProgress,
} from "~/services/contract/contract.type";
import globalStyle from "~/styles/global-style";

interface ContractInfoTabProps {
  detail: ContractDetail;
  onShowItemDetail?: (item: ContractItem) => void;
  onShowPaymentDetail?: (item: ContractPaymentProgress) => void;
  onShowLotDetail?: (rowIndex: number) => void;
}

export const ContractInfoTab = ({
  detail,
  onShowItemDetail,
  onShowPaymentDetail,
  onShowLotDetail,
}: ContractInfoTabProps) => {
  const { colors } = useTheme();

  const isNTType = useMemo(
    () => isNTContractType(detail?.contractType),
    [detail?.contractType],
  );

  const handleItemRowDoublePress = useCallback(
    (index: number) => {
      const selectedItem = detail?.lstItem?.[index];
      if (selectedItem) {
        onShowItemDetail?.(selectedItem);
      }
    },
    [detail?.lstItem, onShowItemDetail],
  );

  const handlePaymentRowDoublePress = useCallback(
    (index: number) => {
      const selectedPayment = detail?.lstPaymentProgress?.[index];
      if (selectedPayment) {
        onShowPaymentDetail?.(selectedPayment);
      }
    },
    [detail?.lstPaymentProgress, onShowPaymentDetail],
  );

  const handleLotRowDoublePress = useCallback(
    (index: number) => {
      const firstLotItems = detail?.lstLot?.[0]?.lstLotItem || [];
      if (index >= 0 && index < firstLotItems.length) {
        onShowLotDetail?.(index);
      }
    },
    [detail?.lstLot, onShowLotDetail],
  );

  const incotermCode = useMemo(() => {
    return detail?.incotermName?.split(" ")[0]?.toUpperCase() || "";
  }, [detail?.incotermName]);

  const isFOB = useMemo(() => incotermCode === "FOB", [incotermCode]);
  const isC = useMemo(() => incotermCode.startsWith("C"), [incotermCode]);

  // Helper to format currency
  const formatNum = (val: any) => {
    if (val === undefined || val === null || val === "") return "---";
    const num = Number(val);
    return isNaN(num) ? val.toString() : NumberHelper.formatMoney(num);
  };

  // Helper to format key-value grid details
  const renderDetailRow = (
    label: string,
    value: string | number | undefined | null,
    fullWidth = false,
  ) => (
    <View style={[styles.detailRow, fullWidth && { width: "100%" }]}>
      <Text size={13} color="#64748B" bold style={{ marginBottom: 4 }}>
        {label}
      </Text>
      <Text size={14} color={colors.title} bold>
        {value === undefined || value === null || value === "" ? "---" : value}
      </Text>
    </View>
  );

  // --- SECTION V: DANH SÁCH HÀNG HÓA ---
  const itemColumns = useMemo(() => {
    if (isNTType) {
      return [
        "STT",
        "Tên sản phẩm",
        "Đơn vị tính",
        "Quy cách - Chủng loại",
        "Số lượng dự kiến /tháng",
        "Ghi chú",
      ];
    }
    return [
      "Item line",
      "Account assignment",
      "Material",
      "Thông số kỹ thuật",
      "Material Group",
      "Asset",
      "Order",
      "Short text",
      "Vị trí kho hàng",
      "Số lượng mua",
      "Đơn vị tính",
      "Đơn giá",
      "Đơn vị Base Unit",
      "Thành tiền",
      "Thành tiền (VNĐ)",
      "Mã thuế",
      "Thuế",
      "Thành tiền sau thuế",
      "Xuất xứ",
      "Nhà máy SX",
      "Thời gian giao hàng trễ nhất",
      "Dung sai giao hàng thiếu",
      "Dung sai giao hàng thừa",
      "Loại tồn kho",
      "Loại giá trị",
    ];
  }, [isNTType]);

  const itemWidths = useMemo(() => {
    if (isNTType) {
      return [60, 250, 100, 200, 180, 200];
    }
    return [
      60, 150, 120, 150, 180, 180, 150, 180, 150, 100, 100, 120, 100, 120, 120,
      100, 80, 120, 100, 180, 120, 100, 100, 100, 120,
    ];
  }, [isNTType]);

  const itemRows = useMemo(() => {
    return (
      detail?.lstItem?.map((itm, idx) => {
        if (isNTType) {
          return {
            cells: [
              (idx + 1).toString(),
              itm.externalMaterialGroupName || "---",
              itm.uomText || "---",
              itm.specificationType || "---",
              itm.estimatedMonthlyQuantity
                ? formatNum(itm.estimatedMonthlyQuantity)
                : "---",
              itm.note || "---",
            ],
          };
        }
        return {
          cells: [
            itm.itemNo || (idx + 1).toString(),
            itm.acccateName || "---",
            itm.code || "---",
            itm.technicalSpec || "---",
            itm.materialGroupName || "---",
            itm.assetCode
              ? itm.assetDesc
                ? `${itm.assetCode} - ${itm.assetDesc}`
                : itm.assetCode
              : "---",
            itm.orderCode
              ? itm.ioName
                ? `${itm.orderCode} - ${itm.ioName}`
                : itm.orderCode
              : "---",
            itm.shortText || "---",
            itm.plantName || "---",
            typeof itm.quantity === "number" ? formatNum(itm.quantity) : "---",
            itm.ounName || "---",
            typeof itm.price === "number" ? formatNum(itm.price) : "---",
            itm.unitName || "---",
            typeof itm.totalPrice === "number"
              ? formatNum(itm.totalPrice)
              : "---",
            typeof itm.totalPriceVND === "number"
              ? formatNum(itm.totalPriceVND)
              : "---",
            itm.taxCodeName || "---",
            typeof itm.taxRate === "number" ? itm.taxRate.toString() : "---",
            typeof itm.totalPriceAfterTax === "number"
              ? formatNum(itm.totalPriceAfterTax)
              : "---",
            itm.origin || "---",
            itm.factorySupplierName || "---",
            itm.latestDeliveryDate
              ? DateHelper.formatDate(itm.latestDeliveryDate, "DD/MM/YYYY")
              : "---",
            typeof itm.underDeliveryTolerance === "number"
              ? itm.underDeliveryTolerance.toString()
              : "---",
            typeof itm.overDeliveryTolerance === "number"
              ? itm.overDeliveryTolerance.toString()
              : "---",
            itm.stockType || "---",
            itm.valuationType || "---",
          ],
        };
      }) || []
    );
  }, [detail?.lstItem, isNTType]);

  // --- SECTION IX: TÁCH LOT ---
  const lotColumns = useMemo(() => {
    const cols = ["Item line", "Short text", "Số lượng"];
    detail?.lstLot?.forEach((lot, idx) => {
      const formattedDate = lot.lotDate
        ? ` (${DateHelper.formatDate(lot.lotDate, "DD/MM/YYYY")})`
        : "";
      cols.push(lot.title || `Lot ${idx + 1}${formattedDate}`);
    });
    return cols;
  }, [detail?.lstLot]);

  const lotWidths = useMemo(() => {
    const w = [100, 200, 120];
    detail?.lstLot?.forEach(() => {
      w.push(120);
    });
    return w;
  }, [detail?.lstLot]);

  const lotRows = useMemo(() => {
    if (!detail?.lstLot || detail.lstLot.length === 0) return [];
    const firstLot = detail.lstLot[0];
    const rows = firstLot.lstLotItem.map((item, idx) => {
      const cells = [
        item.itemNo || "---",
        item.shortText || "---",
        formatNum(item.quantityTotal),
      ];

      detail.lstLot?.forEach((lotGroup) => {
        const matchingItem = lotGroup.lstLotItem[idx];
        cells.push(matchingItem ? formatNum(matchingItem.quantity) : "0");
      });

      return { cells };
    });

    // Add Total Row
    const totalCells = [
      "Tổng",
      "---",
      formatNum(
        firstLot.lstLotItem.reduce(
          (acc, item) => acc + (item.quantityTotal || 0),
          0,
        ),
      ),
    ];
    detail.lstLot.forEach((lot) => {
      totalCells.push(formatNum(lot.quantityTotal));
    });
    rows.push({ cells: totalCells });

    return rows;
  }, [detail?.lstLot]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={globalStyle.scrollContainerDetail}
    >
      {/* I. THÔNG TIN CHUNG */}
      <Collapse
        title="Thông tin chung"
        collapsible
        containerStyle={globalStyle.collapseContainer}
      >
        <View style={styles.sectionGrid}>
          {renderDetailRow("Loại hợp đồng", detail?.contractTypeName)}
          {renderDetailRow("Số hợp đồng", detail?.contractNumber)}
          {renderDetailRow(
            "Số hợp đồng ngoại thương",
            detail?.foreignContractCode,
          )}
          {renderDetailRow("Nội dung Hợp đồng", detail?.name, true)}
          {renderDetailRow("Tên hợp đồng tiếng anh", detail?.nameEN, true)}
          {renderDetailRow(
            "Ngày tạo hợp đồng",
            detail?.createdAt
              ? DateHelper.formatDate(detail.createdAt, "DD/MM/YYYY")
              : "---",
          )}
          {renderDetailRow("Tham chiếu từ", detail?.contractReferenceFromName)}
          {detail?.contractReferenceFrom === "Normal" &&
            renderDetailRow(
              "Đề nghị mua hàng",
              detail?.recommendedPurchaseName,
            )}
          {renderDetailRow(
            "Tổ chức mua hàng",
            detail?.purchasingOrgCode
              ? `${detail.purchasingOrgCode} - ${detail.purchasingOrgName || ""}`
              : detail?.purchasingOrgName,
            true,
          )}
          {renderDetailRow(
            "Nhóm mua hàng",
            detail?.purchasingGroupCode
              ? `${detail.purchasingGroupCode} - ${detail.purchasingGroupName || ""}`
              : detail?.purchasingGroupName,
            true,
          )}
          {renderDetailRow(
            "Ngày kí hợp đồng",
            detail?.contractDate
              ? DateHelper.formatDate(detail.contractDate, "DD/MM/YYYY")
              : "---",
          )}
          {renderDetailRow(
            "Ngày hiệu lực",
            detail?.effectiveDate
              ? DateHelper.formatDate(detail.effectiveDate, "DD/MM/YYYY")
              : "---",
          )}
          {renderDetailRow(
            "Ngày hết hiệu lực",
            detail?.expiredDate
              ? DateHelper.formatDate(detail.expiredDate, "DD/MM/YYYY")
              : "---",
          )}
        </View>
      </Collapse>

      <Spacer size={10} />

      {/* II. THÔNG TIN BÊN MUA */}
      <Collapse
        title="Thông tin bên mua"
        collapsible
        containerStyle={globalStyle.collapseContainer}
      >
        <View style={styles.sectionGrid}>
          {renderDetailRow(
            "Bên mua/Công ty mua",
            detail?.companyCode
              ? `${detail.companyCode} - ${detail.companyName || ""}`
              : detail?.companyName,
            true,
          )}
          {renderDetailRow(
            "Plant",
            detail?.plantCode
              ? `${detail.plantCode} - ${detail.plantName || ""}`
              : detail?.plantName,
            true,
          )}
          {renderDetailRow("Địa chỉ bên mua", detail?.addressBuyer, true)}
          {renderDetailRow("Số điện thoại bên mua", detail?.telBuyer)}
          {renderDetailRow("Email bên mua", detail?.emailBuyer)}
          {renderDetailRow(
            "Ngày nhà cung cấp giao hàng",
            detail?.supplierDeliveryDate
              ? DateHelper.formatDate(detail.supplierDeliveryDate, "DD-MM-YYYY")
              : "---",
          )}
        </View>
      </Collapse>

      <Spacer size={10} />

      {/* III. THÔNG TIN BÊN BÁN */}
      <Collapse
        title="Thông tin bên bán"
        collapsible
        containerStyle={globalStyle.collapseContainer}
      >
        <View style={styles.sectionGrid}>
          {renderDetailRow("Bên bán/Nhà cung cấp", detail?.supplierName, true)}
          {renderDetailRow("Địa chỉ bên bán", detail?.addressSeller, true)}
          {renderDetailRow("Email bên bán", detail?.emailSeller)}
          {renderDetailRow("Số điện thoại bên bán", detail?.telSeller)}
          {renderDetailRow("Đại diện bên bán", detail?.representativeSeller)}
          {renderDetailRow("Chức vụ", detail?.postionSeller)}
        </View>
      </Collapse>

      <Spacer size={10} />

      {/* IV. THÔNG TIN GIAO NHẬN */}
      {!isNTType && (
        <>
          <Collapse
            title="Thông tin vận chuyển"
            collapsible
            containerStyle={globalStyle.collapseContainer}
          >
            <View style={styles.sectionGrid}>
              {renderDetailRow(
                "Điều khoản thương mại (Incoterm)",
                detail?.incotermName,
              )}
              {renderDetailRow("Phiên bản", detail?.incotermVersion)}
              {renderDetailRow(
                "Địa điểm Incoterm 1",
                isFOB
                  ? detail?.polName
                  : isC
                    ? detail?.podName
                    : detail?.incotermLocation1,
                true,
              )}
              {renderDetailRow(
                "Địa điểm Incoterm 2",
                !isFOB && !isC ? detail?.incotermLocation2 : "",
                true,
              )}
              {renderDetailRow("Cảng xếp hàng (POL)", detail?.polName)}
              {renderDetailRow("Cảng dỡ hàng (POD)", detail?.podName)}
              {renderDetailRow(
                "Địa điểm giao hàng",
                detail?.deliveryPlaceName,
                true,
              )}
            </View>
          </Collapse>
          <Spacer size={10} />
        </>
      )}

      {/* V. DANH SÁCH ITEM */}
      <Collapse
        title="Danh sách Item"
        collapsible
        containerStyle={globalStyle.collapseContainer}
      >
        <Table
          horizontalScroll
          columns={itemColumns}
          rows={itemRows}
          columnWidths={itemWidths}
          onRowDoublePress={handleItemRowDoublePress}
          pagination={{ enabled: false }}
        />
      </Collapse>

      <Spacer size={10} />

      {/* VI. THÔNG TIN THANH TOÁN */}
      <Collapse
        title="Thông tin thanh toán"
        collapsible
        containerStyle={globalStyle.collapseContainer}
      >
        <View style={styles.sectionGrid}>
          {isNTType ? (
            <>
              {renderDetailRow("Đơn vị tiền tệ", detail?.currencyName)}
              {renderDetailRow(
                "Số ngày thanh toán",
                typeof detail?.paymentDays === "number"
                  ? detail.paymentDays.toString()
                  : "---",
              )}
              {renderDetailRow("Thời hạn thanh toán", detail?.paymentTermName)}
              {renderDetailRow(
                "Phương thức thanh toán",
                detail?.paymentMethodName,
              )}
              {renderDetailRow(
                "Điều khoản thanh toán",
                detail?.description,
                true,
              )}
            </>
          ) : (
            <>
              {renderDetailRow(
                "Giá trị hợp đồng trước thuế",
                formatNum(detail?.contractAmountBeforeTax),
              )}
              {renderDetailRow(
                "Giá trị hợp đồng trước thuế bằng chữ",
                detail?.contractAmountBeforeTaxText,
                true,
              )}
              {renderDetailRow(
                "Giá trị hợp đồng sau thuế",
                formatNum(detail?.contractValueAfterTax),
              )}
              {renderDetailRow(
                "Giá trị hợp đồng sau thuế bằng chữ",
                detail?.contractAmountAfterTaxText,
                true,
              )}
              {renderDetailRow("Đơn vị tiền tệ", detail?.currencyName)}
              {renderDetailRow(
                "Tỷ giá",
                typeof detail?.exchangeRate === "number"
                  ? formatNum(detail.exchangeRate)
                  : "---",
              )}
              {renderDetailRow(
                "Giá trị hợp đồng quy đổi sang VNĐ",
                formatNum(detail?.contractValueBeforeTaxInVND),
              )}
              {renderDetailRow(
                "Giá trị hợp đồng sau thuế quy đổi sang VNĐ",
                formatNum(detail?.contractValueAfterTaxInVND),
              )}
              {renderDetailRow(
                "Thời hạn thanh toán",
                detail?.paymentTermName,
                true,
              )}
            </>
          )}
        </View>
      </Collapse>

      <Spacer size={10} />

      {/* VII. THÔNG TIN CHUYỂN KHOẢN */}
      <Collapse
        title="Thông tin chuyển khoản"
        collapsible
        containerStyle={globalStyle.collapseContainer}
      >
        <View style={styles.sectionGrid}>
          {renderDetailRow("STK", detail?.bankNumber)}
          {renderDetailRow("Chủ tài khoản", detail?.bankUsername, true)}
          {renderDetailRow("Ngân hàng", detail?.bankName, true)}
          {renderDetailRow("Chi nhánh", detail?.bankBranchName, true)}
          {renderDetailRow("Swift Code", detail?.swiftCode)}
          {renderDetailRow("IBAN", detail?.iban)}
        </View>
      </Collapse>

      <Spacer size={10} />

      {/* VIII. DANH SÁCH TIẾN ĐỘ THANH TOÁN */}
      {!isNTType && (
        <>
          <Collapse
            title="Danh sách Tiến độ thanh toán"
            collapsible
            containerStyle={globalStyle.collapseContainer}
          >
            <Table
              columns={[
                "Tên tiến độ",
                "Tiến độ thực hiện (%)",
                "Phương thức thanh toán",
                "Số tiền",
                "Thời gian thanh toán",
                "Ghi chú",
              ]}
              columnWidths={[200, 110, 150, 100, 120, 200]}
              rows={
                detail?.lstPaymentProgress?.map((p) => ({
                  cells: [
                    p.name || "---",
                    p.percent !== undefined && p.percent !== null
                      ? p.percent.toString()
                      : "---",
                    p.paymentMethodName || "---",
                    formatNum(p.money),
                    p.time
                      ? DateHelper.formatDate(p.time, "DD/MM/YYYY")
                      : "---",
                    p.description || "---",
                  ],
                })) || []
              }
              onRowDoublePress={handlePaymentRowDoublePress}
              horizontalScroll
              pagination={{ enabled: false }}
            />
          </Collapse>
          <Spacer size={10} />
        </>
      )}

      {/* IX. TÁCH LOT */}
      {detail?.lstLot && detail.lstLot.length > 0 && (
        <>
          <Collapse
            title="Tách lot"
            collapsible
            containerStyle={globalStyle.collapseContainer}
          >
            <Table
              horizontalScroll
              columns={lotColumns}
              rows={lotRows}
              columnWidths={lotWidths}
              onRowDoublePress={handleLotRowDoublePress}
              pagination={{ enabled: false }}
            />
          </Collapse>
          <Spacer size={10} />
        </>
      )}

      {/* ĐIỀU KHOẢN KHÁC */}
      {isNTType && detail?.lstItem && detail.lstItem.length > 0 && (
        <>
          <Collapse
            title="Điều khoản khác"
            collapsible
            containerStyle={globalStyle.collapseContainer}
          >
            <View style={styles.sectionGrid}>
              {renderDetailRow(
                "Hàng hóa mua bán",
                detail?.goodsDescription,
                true,
              )}
              {renderDetailRow(
                "Thời gian giao hàng chậm nhất (ngày)",
                typeof detail?.maxDeliveryTime === "number"
                  ? `${detail.maxDeliveryTime} ngày`
                  : "---",
              )}
              {renderDetailRow(
                "Số tiền chịu phạt nếu giao trễ",
                detail?.lateDeliveryPenaltyAmount,
              )}
              {renderDetailRow(
                "Thời gian thông báo thay đổi (ngày)",
                typeof detail?.changeNoticeTime === "number"
                  ? `${detail.changeNoticeTime} ngày`
                  : "---",
              )}
              {renderDetailRow(
                "Địa điểm giao hàng",
                detail?.deliveryLocation,
                true,
              )}
              {renderDetailRow(
                "Phần trăm phạt hối lộ (%)",
                typeof detail?.briberyPenaltyPercent === "number"
                  ? `${detail.briberyPenaltyPercent}%`
                  : "---",
              )}
            </View>
          </Collapse>
          <Spacer size={10} />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  sectionGrid: {
    padding: 4,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  detailRow: {
    width: "48%",
    paddingBottom: 8,
    borderBottomWidth: 0.75,
    borderBottomColor: "#E2E8F0",
  },
});
