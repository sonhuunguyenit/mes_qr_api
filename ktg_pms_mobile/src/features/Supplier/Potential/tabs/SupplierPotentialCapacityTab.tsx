import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Column, Row, Text, Collapse, Spacer, Table } from "~/common";
import globalStyle from "~/styles/global-style";
import { useTheme } from "~/hooks/useTheme";
import { ColumnInfo } from "~/components/ColumnInfo";
import moment from "moment";
import { useSheet } from "~/contexts/SheetContext";

import { SupplierPotentialFacilityDetailSheet } from "../sheets/SupplierPotentialFacilityDetailSheet";
import { SupplierPotentialProductionLineDetailSheet } from "../sheets/SupplierPotentialProductionLineDetailSheet";
import { SupplierPotentialCertificationDetailSheet } from "../sheets/SupplierPotentialCertificationDetailSheet";

interface Props {
  data: any;
}

const SupplierPotentialCapacityTab = ({ data }: Props) => {
  const { colors, spacing } = useTheme();
  const { openSheet } = useSheet();
  // Based on Admin source, this should be the list of services/business areas
  const businessAreas = data?.businessAreas || [];

  if (businessAreas.length === 0) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.emptyContent}
      >
        <Text color={colors.label}>
          Không có dữ liệu năng lực lĩnh vực kinh doanh
        </Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={globalStyle.scrollContainerDetail}
    >
      {businessAreas.map((service: any, index: number) => {
        return (
          <View key={service.id || index} style={styles.serviceSection}>
            {/* I. General & Personnel Info - Now includes the LVKD Name in title */}
            <Collapse
              title={`I. Thông tin năng lực LVKD: ${service.serviceName || "---"}`}
              collapsible={true}
            >
              <Column style={{ gap: spacing.md }} align="stretch">
                <Row full gap={spacing.md}>
                  <ColumnInfo
                    label="Phương thức thanh toán"
                    value={service.paymentMethodName || "---"}
                  />
                  <ColumnInfo
                    label="Thời hạn thanh toán"
                    value={service.paymentTermName || "---"}
                  />
                </Row>

                <Spacer size={8} />
                <Text bold size={13} color={colors.label}>
                  Người quyết định
                </Text>
                <Row full gap={spacing.md}>
                  <ColumnInfo
                    label="Người quyết định"
                    value={service.decider || "---"}
                  />
                  <ColumnInfo
                    label="Chức vụ"
                    value={service.deciderPosition || "---"}
                  />
                </Row>
                <Row full gap={spacing.md}>
                  <ColumnInfo
                    label="Số điện thoại"
                    value={service.deciderPhone || "---"}
                  />
                  <ColumnInfo
                    label="Số Fax"
                    value={service.deciderFax || "---"}
                  />
                </Row>
                <ColumnInfo
                  label="Email"
                  value={service.deciderEmail || "---"}
                  full
                />
                <ColumnInfo
                  label="Lưu ý"
                  value={service.deciderNote || "---"}
                  full
                  last
                />

                <Spacer size={8} />
                <Text bold size={13} color={colors.label}>
                  Người giao dịch
                </Text>
                <Row full gap={spacing.md}>
                  <ColumnInfo
                    label="Người giao dịch"
                    value={service.trader || "---"}
                  />
                  <ColumnInfo
                    label="Chức vụ"
                    value={service.traderPosition || "---"}
                  />
                </Row>
                <Row full gap={spacing.md}>
                  <ColumnInfo
                    label="Số điện thoại"
                    value={service.traderPhone || "---"}
                  />
                  <ColumnInfo
                    label="Số Fax"
                    value={service.traderFax || "---"}
                  />
                </Row>
                <ColumnInfo
                  label="Email"
                  value={service.traderEmail || "---"}
                  full
                />
                <ColumnInfo
                  label="Lưu ý"
                  value={service.traderNote || "---"}
                  full
                  last
                />
              </Column>
            </Collapse>
            <Spacer size={10} />

            {/* Mã hàng ưu tiên */}
            {service.lstSupplierServicePriorityMaterials && service.lstSupplierServicePriorityMaterials.length > 0 && (
              <>
                <Collapse title="Mã hàng ưu tiên" collapsible={true}>
                  <Table
                    columns={["STT", "Mã vật tư", "Tên vật tư", "Đơn vị tính"]}
                    columnWidths={[60, 150, 200, 100]}
                    rows={service.lstSupplierServicePriorityMaterials.map((item: any, idx: number) => ({
                      cells: [
                        (idx + 1).toString(),
                        item.materialCode || "---",
                        item.materialName || "---",
                        item.unitCode || "---",
                      ],
                    }))}
                    horizontalScroll
                  />
                </Collapse>
                <Spacer size={10} />
              </>
            )}

            {/* II. Products & Services Table */}
            <Collapse
              title="II. Sản phẩm và dịch vụ NCC sản xuất/kinh doanh"
              collapsible={true}
            >
              <Table
                columns={["Tên", "Năng lực cung cấp/Tháng"]}
                rows={(service.lstProductService || []).map((item: any) => ({
                  cells: [
                    item.name || "---",
                    item.supplyCapacityPerMonth1 ||
                      item.supplyCapacityPerMonth ||
                      "---",
                  ],
                }))}
                horizontalScroll
              />
            </Collapse>
            <Spacer size={10} />

            {/* III. Nhà xưởng và thiết bị */}
            <Collapse title="III. Nhà xưởng và thiết bị" collapsible={true}>
              <Table
                columns={[
                  "Tên",
                  "Tổng diện tích (m2)",
                  "Số giờ làm việc trung bình",
                  "Diện tích Văn phòng (m2)",
                  "Diện tích nhà xưởng sản xuất (m2)",
                  "Diện tích nhà kho nguyên liệu (m2)",
                  "Diện tích nhà kho thành phẩm (m2)",
                ]}
                columnWidths={[200, 200, 200, 200, 200, 200, 200]}
                rows={(service.facilities || []).map((item: any) => ({
                  cells: [
                    item.name || "---",
                    item.totalAreaM2 || "---",
                    item.avgWorkHour || "---",
                    item.officeAreaM2 || "---",
                    item.productionAreaM2 || "---",
                    item.rawMaterialAreaM2 || "---",
                    item.finishedGoodsAreaM2 || "---",
                  ],
                }))}
                horizontalScroll
                onRowDoublePress={(rowIdx) => {
                  openSheet(() => (
                    <SupplierPotentialFacilityDetailSheet
                      item={service.facilities[rowIdx]}
                    />
                  ));
                }}
              />
            </Collapse>
            <Spacer size={10} />

            {/* IV. Thiết bị dây chuyền */}
            <Collapse
              title="IV. Liệt kê một số trang thiết bị thứ tự lần lượt theo dây chuyền, quy trình sản xuất"
              collapsible={true}
            >
              <Table
                columns={[
                  "Bước quy trình SX",
                  "Tên thiết bị",
                  "Số lượng thiết bị đang vận hành",
                  "Năm đưa vào sử dụng",
                  "Công suất thiết kế",
                  "Công suất thực tế đang đạt được",
                ]}
                columnWidths={[200, 200, 200, 200, 200, 200]}
                rows={(service.lstProductionLine || []).map((item: any) => ({
                  cells: [
                    item.step || "---",
                    item.equipmentName || "---",
                    item.quantity || "---",
                    item.commissioningYear
                      ? moment(item.commissioningYear).format("YYYY")
                      : "---",
                    item.designCapacity || "---",
                    item.actualCapacity || "---",
                  ],
                }))}
                horizontalScroll
                onRowDoublePress={(rowIdx) => {
                  openSheet(() => (
                    <SupplierPotentialProductionLineDetailSheet
                      item={service.lstProductionLine[rowIdx]}
                    />
                  ));
                }}
              />
            </Collapse>
            <Spacer size={10} />

            {/* V. ISO Certification */}
            <Collapse
              title="V. Nhà cung cấp có đạt chứng nhận ISO 9000 hoặc chứng nhận tương đương - Vui lòng nêu rõ và đính kèm giấy chứng nhận"
              collapsible={true}
            >
              <Column
                style={{
                  gap: spacing.sm,
                  paddingHorizontal: 5,
                  paddingBottom: 5,
                }}
              >
                <Text size={14} color={colors.label}>
                  Đạt chứng nhận ISO 9000 hoặc tương đương:{" "}
                  <Text bold color={colors.title}>
                    {service.isISO ? "Có" : "Không"}
                  </Text>
                </Text>

                {service.isISO && (
                  <Table
                    columns={["Tên", "File đính kèm"]}
                    columnWidths={[250, 100]}
                    rows={(service.lstCertification || []).map((cert: any) => ({
                      cells: [
                        cert.name || "---",
                        cert.fileAttachment ? "[Xem file]" : "---",
                      ],
                    }))}
                    horizontalScroll
                    onRowDoublePress={(rowIdx) => {
                      openSheet(() => (
                        <SupplierPotentialCertificationDetailSheet
                          item={service.lstCertification[rowIdx]}
                        />
                      ));
                    }}
                  />
                )}
              </Column>
            </Collapse>

            <Spacer size={10} />
          </View>
        );
      })}
    </ScrollView>
  );
};

export default SupplierPotentialCapacityTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  content: {
    padding: 5,
    paddingBottom: 40,
    width: "100%",
    alignItems: "stretch",
    flexGrow: 1,
  },
  emptyContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  serviceSection: {
    marginBottom: 10,
    width: "100%",
  },
});
