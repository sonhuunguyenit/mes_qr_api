import React from "react";
import { ScrollView, View } from "react-native";
import { Column, Row } from "~/common";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";
import { MaterialItemData } from "~/services/material/material.type";
import globalStyle from "~/styles/global-style";

interface MaterialApprovalDetailPurchasingTabProps {
  data: MaterialItemData;
}

const formatBoolean = (
  val: boolean | string | number | undefined | null,
): string => {
  if (val === true || val === "true" || val === 1 || val === "1") {
    return "Có";
  }
  if (val === false || val === "false" || val === 0 || val === "0") {
    return "Không";
  }
  return "Không";
};

const formatDeleteAtPlant = (
  val: boolean | string | null | undefined,
): string => {
  if (val !== undefined && val !== null && val !== "" && val !== false) {
    return "Có";
  }
  return "Không";
};

export const MaterialApprovalDetailPurchasingTab = React.memo(
  ({ data }: MaterialApprovalDetailPurchasingTabProps) => {
    const { colors } = useTheme();

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={globalStyle.scrollContainerDetail}
      >
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 10,
            paddingHorizontal: 10,
            paddingVertical: 12,
          }}
        >
          <Column gap={12} align="stretch">
            <Row full gap={16}>
              <ColumnInfo label="Mã vật tư" value={data?.code} />
              <ColumnInfo label="Plant" value={data?.plantCode} />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="Order Unit (đơn vị tính mua hàng)"
                value={data?.purchasingOrderUnitName}
              />
              <ColumnInfo
                label="Purchasing Group"
                value={data?.purchasingGroupLable}
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="Thuế suất mua hàng"
                value={data?.purchasingTaxClassificationCode}
              />
              <ColumnInfo
                label="Manufacturer number"
                value={data?.manufacturernumber}
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="Variable Purchase Order Unit Active"
                value={data?.varOun}
              />
              <ColumnInfo
                label="Flag for detete at plant level"
                value={formatDeleteAtPlant(data?.flagForDeteteAtPlantLevel)}
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="Quản lý lô"
                value={formatBoolean(data?.isBatchManaged)}
              />
              <ColumnInfo label="Qm Time" value={data?.qmTimeDays} />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="01 - KTCL đầu vào từ nhập kho mua hàng"
                value={formatBoolean(data?.quality01)}
              />
              <ColumnInfo
                label="05 - KTCL hàng trả/ hàng đổi"
                value={formatBoolean(data?.quality05)}
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="08 - KTCL vật tư bảo dưỡng, phục hồi bên trong"
                value={formatBoolean(data?.quality08)}
              />
              <ColumnInfo
                label="03 - KTCL công đoạn sản xuất."
                value={formatBoolean(data?.quality03)}
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="89 - KTCL khi có nhu cầu ngẫu nhiên, định kỳ."
                value={formatBoolean(data?.quality89)}
              />
              <ColumnInfo
                label="04 - KTCL BTP/TP nhập kho theo lệnh sản xuất."
                value={formatBoolean(data?.quality04)}
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="ZCT - KTCL cải tiến sản phẩm."
                value={formatBoolean(data?.qualityZCT)}
              />
              <ColumnInfo
                label="Z1 - Kiểm tra cơ hóa lý (TP/BTP)"
                value={formatBoolean(data?.qualityZ1)}
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="Z4 - Kiểm tra lưu mẫu (TP/BTP)"
                value={formatBoolean(data?.qualityZ4)}
              />
              <ColumnInfo
                label="Z5 - KTCL nhập kho khác (BTP)"
                value={formatBoolean(data?.qualityZ5)}
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="Z6 - Nhập kho số dư đầu kỳ (TP/BTP)"
                value={formatBoolean(data?.qualityZ6)}
              />
              <ColumnInfo
                label="Z7 - Tính năng hàn Thành phẩm"
                value={formatBoolean(data?.qualityZ7)}
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo label="Origin Group" value={data?.originGroupCode} />
              <ColumnInfo
                label="Profit Center"
                value={data?.profitCenterCode}
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="Do Not Cost"
                value={formatBoolean(data?.doNotCost)}
              />
              <ColumnInfo
                label="Material Is Costed with Quantity Structure"
                value={formatBoolean(data?.withQuantityStructure)}
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="Material-related origin"
                value={formatBoolean(data?.materialOrigin)}
              />
              <ColumnInfo
                label="Costing Lot Size"
                value={data?.costingLotSize}
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="Mrp Profile"
                value={data?.mrpProfileCode || data?.mrpProfile}
              />
              <ColumnInfo
                label="Mrp Group"
                value={data?.mrpGroupCode || data?.mrpGroup}
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="Mrp Type"
                value={data?.mrpTypeCode || data?.mRPType}
              />
              <ColumnInfo
                label="Procurement Type"
                value={data?.procurementType}
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="Indiv./coll"
                value={data?.requirementPlanningType}
              />
              <ColumnInfo
                label="Planning strategy group"
                value={data?.strategyGroup}
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo label="Lot size" value={data?.lotSize} />
              <ColumnInfo label="Fixed Lot size" value={data?.fixedLotSize} />
            </Row>

            <Row full gap={16}>
              <ColumnInfo label="Minimum Lot Size" value={data?.minLotSize} />
              <ColumnInfo label="Maximum Lot Size" value={data?.maxLotSize} />
            </Row>

            <Row full gap={16}>
              <ColumnInfo label="Rounding Value" value={data?.roundingValue} />
              <ColumnInfo label="Safety Stock" value={data?.safetyStock} />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="Reorder Point (Điểm tái đặt hàng)"
                value={data?.reorderPoint}
              />
              <ColumnInfo
                label="Mrp Controller"
                value={data?.mrpControllerCode || data?.mrpController}
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="Planned Delivery Time in Days (BTCI)"
                value={data?.deliveryTime || data?.deliveryTimeDays}
              />
              <ColumnInfo
                label="GR processing time (days)"
                value={data?.gRProcessingTime}
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo label="Overdely tol" value={data?.overdelyTol} />
              <ColumnInfo label="Underdely tol" value={data?.underdelyTol} />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="Production unit"
                value={data?.productionUnitTCode}
              />
              <ColumnInfo
                label="Critical Part"
                value={formatBoolean(
                  data?.isCriticalPart || data?.criticalPart,
                )}
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="Assembly scrap (%)"
                value={data?.assemblyScrapPercent}
              />
              <ColumnInfo
                label="Component scrap"
                value={data?.componentScrapPercent}
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="In-house production"
                value={data?.inHouseProduction}
              />
              <ColumnInfo label="Backflush" value={data?.backflushCode} />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="Co-Production"
                value={formatBoolean(data?.hasCoProduct)}
              />
              <ColumnInfo
                label="SchedMargin key"
                value={data?.schedMarginKey}
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="Maximum stock level"
                value={data?.maximumStockLevel}
              />
              <ColumnInfo
                label="Min Safety Stock"
                value={data?.minSafetyStock}
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="Minimum Remaining Shelf Life"
                value={data?.minimumRemainingShelfLife}
              />
              <ColumnInfo
                label="Total Shelf Life"
                value={data?.totalShelfLife}
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="Period Ind. for SLED"
                value={data?.periodIndForSled}
              />
              <ColumnInfo
                label="Mã CC Phys. Inv. Ind."
                value={data?.ccPhysInvIndCode}
              />
            </Row>
          </Column>
        </View>
      </ScrollView>
    );
  },
);

export default MaterialApprovalDetailPurchasingTab;
