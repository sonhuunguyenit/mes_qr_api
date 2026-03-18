import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Icon } from "@rneui/themed";
import moment from "moment";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Row, Spacer, Text } from "~/common";
import { useTheme } from "~/hooks/useTheme";

interface POItemDetailSheetProps {
  item: any;
  dataUom?: any[];
  onClose: () => void;
}

const POItemDetailSheet = ({
  item,
  dataUom,
  onClose,
}: POItemDetailSheetProps) => {
  const { colors, spacing } = useTheme();

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

  const DetailItem = ({
    label,
    value,
  }: {
    label: string;
    value: string | number;
  }) => (
    <View style={styles.itemContainer}>
      <Text color={colors.label} style={styles.label}>
        {label}
      </Text>
      <Text bold color={colors.title} style={styles.value}>
        {value || "---"}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Icon name="info" type="feather" size={20} color={colors.primary} />
          <Text bold size={16} color={colors.title} style={{ marginLeft: 8 }}>
            Chi tiết Item của PO
          </Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Icon name="x" type="feather" size={24} color={colors.label} />
        </TouchableOpacity>
      </View>

      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Row gap={12}>
          <DetailItem label="Close" value={item.itemClosed} />
          <DetailItem label="Delete" value={item.itemDeleted} />
        </Row>

        <Row gap={12}>
          <DetailItem
            label="Item line"
            value={item.itemLine || item.itemNo || "---"}
          />
          <DetailItem
            label="Acc assignment"
            value={item.acccateName || item.accountAssignment || item.acccate}
          />
        </Row>

        <Row gap={12}>
          <DetailItem
            label="Category"
            value={item.itemcateName || item.itemCategory}
          />
          <DetailItem label="Mã vật tư" value={item.materialCode} />
        </Row>

        <Row gap={12}>
          <DetailItem
            label="Mat Group"
            value={item.materialGroupName || item.materialGroupCode}
          />
          <DetailItem
            label="External MatGr"
            value={
              item.extMatGrName ||
              item.externalMaterialGroupName ||
              item.externalMaterialGroupCode
            }
          />
        </Row>

        <Row gap={12}>
          <DetailItem label="Mã tài sản" value={item.assetCode} />
          <DetailItem label="Mã dịch vụ" value={item.serviceCode} />
        </Row>

        <View style={styles.section}>
          <DetailItem
            label="Short text"
            value={item.shortText || item.materialName}
          />
        </View>

        <Row gap={12}>
          <DetailItem
            label="Số lượng lên PO"
            value={formatNumberValue(item.quantityUptoPO)}
          />
          <DetailItem
            label="Số lượng đã nhập kho"
            value={formatNumberValue(item.warehouseQuantity)}
          />
        </Row>

        <View style={styles.section}>
          <DetailItem
            label="OUN (Đơn vị tính)"
            value={item.uomCode || item.ounName || item.unitName || item.uom}
          />
        </View>

        <View style={styles.section}>
          <DetailItem
            label="Thời gian dự kiến hàng về kho"
            value={
              item.deliveryDate || item.expectedDeliveryDate
                ? moment(item.deliveryDate || item.expectedDeliveryDate).format(
                    "DD/MM/YYYY",
                  )
                : "---"
            }
          />
        </View>

        <Row gap={12}>
          <DetailItem
            label="Đơn giá RFQ"
            value={formatNumberValue(item.grossPrice || item.rfqPrice)}
          />
          <DetailItem
            label="Đơn vị tiền tệ RFQ"
            value={item.currencyName || item.rfqCurrency}
          />
        </Row>

        <Row gap={12}>
          <DetailItem
            label="Hệ số giá RFQ (PER)"
            value={item.per || item.rfqPer}
          />
          <DetailItem
            label="Đơn giá PO"
            value={formatNumberValue(
              item.pricePo || item.grossPrice || item.netPrice,
            )}
          />
        </Row>

        <Row gap={12}>
          <DetailItem
            label="Đơn vị tiền tệ PO"
            value={
              item.currencyPoName ||
              item.currencyName ||
              item.currencyPoCode ||
              item.currencyCode
            }
          />
          <DetailItem
            label="Hệ số giá PO (PER)"
            value={item.perPo || item.per}
          />
        </Row>

        <Row gap={12}>
          <DetailItem label="OPU" value={getOPUName()} />
          <DetailItem
            label="Fund center"
            value={item.fcPr || item.fundsCenterPr || item.fc}
          />
        </Row>

        <Row gap={12}>
          <DetailItem label="FP" value={item.fpPr || item.fp} />
          <DetailItem
            label="CI"
            value={item.ciPr || item.commitmentItemCode || item.ci}
          />
        </Row>

        <View style={styles.section}>
          <DetailItem
            label="CIName"
            value={item.ciPrName || item.ciname || item.commitmentItemName}
          />
        </View>

        <Row gap={12}>
          <DetailItem label="Kỳ ngân sách" value={item.budgetPeriod} />
          <DetailItem
            label="Ngân sách Item"
            value={formatNumberValue(
              item.valueItem || item.budgetItem || item.valueItemOld,
            )}
          />
        </Row>

        <View style={styles.section}>
          <DetailItem
            label="Ngân sách"
            value={formatNumberValue(item.totalBudget || item.totalBudgetOld)}
          />
        </View>

        <Row gap={12}>
          <DetailItem
            label="Vị trí kho hàng"
            value={item.storageLocation || item.storeLocationCode}
          />
          <DetailItem
            label="ValType"
            value={item.valType || item.valuationType}
          />
        </Row>

        <Row gap={12}>
          <DetailItem
            label="Rfq"
            value={
              item.rfqCode || item.rfq || (item.__rfq__ && item.__rfq__.code)
            }
          />
          <DetailItem label="Item Rfq" value={item.rfqItem || item.rfqItemNo} />
        </Row>

        <Row gap={12}>
          <DetailItem
            label="PR"
            value={item.prCode || item.purchaseRequisition}
          />
          <DetailItem
            label="Item PR"
            value={item.prItemCode || item.prItem || item.prItemNo}
          />
        </Row>
        <Spacer size={40} />
      </BottomSheetScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 0,
  },
  itemContainer: {
    flex: 1,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
  },
});
export default POItemDetailSheet;
