import React from "react";
import moment from "moment";
import { Linking, TouchableOpacity } from "react-native";
import { Column, Row, Spacer, Text, Collapse, Divider, Table } from "~/common";
import { useTheme } from "~/hooks/useTheme";
import NumberHelper from "~/utils/number";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useSheet } from "~/contexts/SheetContext";
import { SupplierLegalTaxDetailSheet } from "./sheets/SupplierLegalTaxDetailSheet";
import { SupplierLegalRepresentativeDetailSheet } from "./sheets/SupplierLegalRepresentativeDetailSheet";
import { SupplierBankDetailSheet } from "./sheets/SupplierBankDetailSheet";
import { SupplierFactoryDetailSheet } from "./sheets/SupplierFactoryDetailSheet";
import { SupplierRevenueDetailSheet } from "./sheets/SupplierRevenueDetailSheet";

interface SupplierCommonInfoProps {
  supplier: any;
}

const SupplierCommonInfo = ({ supplier }: SupplierCommonInfoProps) => {
  const { colors, spacing } = useTheme();
  const { openSheet } = useSheet();

  return (
    <>
      {/* I. THÔNG TIN NHÀ CUNG CẤP */}
      <Collapse title="I. Thông tin nhà cung cấp" collapsible={true}>
        <Column style={{ gap: spacing.sm }} align="stretch">
          <ColumnInfo
            label="Tên nhà cung cấp"
            value={supplier?.name || ""}
            full
          />

          <Row full gap={spacing.md}>
            <ColumnInfo
              label="Doanh nghiệp VN"
              value={supplier?.countryName === "Vietnam" ? "Có" : "Không"}
            />
            <ColumnInfo
              label="Mã số thuế"
              value={supplier?.taxCode || supplier?.code || ""}
            />
          </Row>

          <Row full gap={spacing.md}>
            <ColumnInfo label="Quốc gia" value={supplier?.countryName || ""} />
            <ColumnInfo label="Số điện thoại" value={supplier?.phone || ""} />
          </Row>

          <ColumnInfo
            label="Trụ sở chính"
            value={supplier?.address || ""}
            full
          />

          <Row full gap={spacing.md}>
            <ColumnInfo
              label="Postal Code"
              value={supplier?.postalCode || ""}
            />
            <ColumnInfo label="Email" value={supplier?.email || ""} />
          </Row>

          <Row full gap={spacing.md}>
            <ColumnInfo label="Số Fax" value={supplier?.fax || ""} />
            <ColumnInfo label="Website" value={supplier?.website || ""} />
          </Row>

          <Row full gap={spacing.md}>
            <ColumnInfo
              label="Loại hình DN"
              value={supplier?.businessTypeName || ""}
            />
            <ColumnInfo
              label="Loại hình SX/KD"
              value={supplier?.bizTypeName || ""}
            />
          </Row>

          <Row full gap={spacing.md}>
            <ColumnInfo
              label="Vốn điều lệ"
              value={`${supplier?.capital ? NumberHelper.formatMoney(supplier.capital) : ""} ${supplier?.capitalUnitCode || "Vietnamese Dong"}`}
            />
            <ColumnInfo
              label="Tài sản cố định"
              value={`${supplier?.assets ? NumberHelper.formatMoney(supplier.assets) : ""} ${supplier?.assetsUnitCode || "Vietnamese Dong"}`}
            />
          </Row>

          <ColumnInfo
            label="Ngày thành lập công ty"
            value={
              supplier?.dateFound
                ? moment(supplier?.dateFound).format("DD/MM/YYYY")
                : ""
            }
            full
            last
          />

          <Divider />

          <Text bold size={11} color={colors.label}>
            Sơ lược về quá trình hình thành & phát triển của Nhà Cung Cấp
          </Text>
          <Text size={14}>{supplier?.description || ""}</Text>

          <Spacer size={15} />

          <Row full gap={spacing.md}>
            <ColumnInfo
              label="Giấy phép đăng kí kinh doanh"
              value={supplier?.fileMST ? "Xem file" : ""}
              onPress={
                supplier?.fileMST
                  ? () => Linking.openURL(supplier.fileMST)
                  : undefined
              }
              last
            />
            <ColumnInfo
              label="File bất kì"
              value={supplier?.fileOther ? "Xem file" : ""}
              onPress={
                supplier?.fileOther
                  ? () => Linking.openURL(supplier.fileOther)
                  : undefined
              }
              last
            />
          </Row>

          <Divider />

          <Text bold size={13} color={colors.label}>
            Thông tin người liên hệ
          </Text>
          <Table
            columns={["STT", "Loại thuế", "Mã số thuế"]}
            columnWidths={[50, 150, 150]}
            horizontalScroll
            rows={(supplier?.lstLegalRepresentativeTax || []).map(
              (item: any, index: number) => ({
                cells: [(index + 1).toString(), item.taxType, item.taxCode],
              }),
            )}
            onRowDoublePress={(index) => {
              openSheet(() => (
                <SupplierLegalTaxDetailSheet
                  item={supplier.lstLegalRepresentativeTax[index]}
                />
              ));
            }}
          />

          <Table
            columns={["STT", "Họ và tên", "Loại định danh", "Mã định danh", "Lưu ý"]}
            columnWidths={[50, 150, 150, 150, 200]}
            horizontalScroll
            rows={(supplier?.lstLegalRepresentative || []).map((item: any, index: number) => ({
              cells: [(index + 1).toString(), item.name, item.idType, item.idNumber, item.note],
            }))}
            onRowDoublePress={(index) => {
              openSheet(() => (
                <SupplierLegalRepresentativeDetailSheet
                  item={supplier.lstLegalRepresentative[index]}
                />
              ));
            }}
          />

          <Text bold size={13} color={colors.label}>
            Tài khoản ngân hàng
          </Text>
          <Table
            columns={[
              "Quốc gia",
              "Tỉnh thành",
              "Ngân hàng",
              "Chi nhánh",
              "STK ngân hàng",
              "STK bổ sung",
              "Chủ thẻ",
              "Swift Code",
              "IBAN",
              "File thông báo",
            ]}
            columnWidths={[150, 150, 250, 200, 150, 150, 150, 150, 150, 150]}
            horizontalScroll
            rows={(supplier?.lstBank || []).map((item: any) => ({
              cells: [
                item.countryName,
                item.regionName,
                item.bankName,
                item.bankBranchName,
                item.bankNumber,
                item.accountNumber,
                item.bankUsername,
                item.swiftCode,
                item.iban,
                item.fileAccount ? (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(item.fileAccount)}
                  >
                    <Text color={colors.active}>Xem file</Text>
                  </TouchableOpacity>
                ) : (
                  ""
                ),
              ],
            }))}
            onRowDoublePress={(index) => {
              openSheet(() => (
                <SupplierBankDetailSheet item={supplier.lstBank[index]} />
              ));
            }}
          />

          <Text bold size={13} color={colors.label}>
            Danh sách nhà máy
          </Text>
          <Table
            columns={[
              "Tên nhà máy sản xuất",
              "Địa chỉ nhà máy sản xuất",
              "Số điện thoại",
              "Số fax",
            ]}
            columnWidths={[200, 250, 150, 150]}
            horizontalScroll
            rows={(supplier?.lstFactorySupplier || []).map((item: any) => ({
              cells: [item.name, item.address, item.phone, item.fax],
            }))}
            onRowDoublePress={(index) => {
              openSheet(() => (
                <SupplierFactoryDetailSheet
                  item={supplier.lstFactorySupplier[index]}
                />
              ));
            }}
          />
        </Column>
      </Collapse>

      <Spacer size={10} />

      {/* II. MỘT SỐ THÔNG TIN CƠ BẢN VỀ TẦM NHÌN CHIẾN LƯỢC */}
      <Collapse
        title="II. Một số thông tin cơ bản về tầm nhìn chiến lược"
        collapsible={true}
      >
        <Column style={{ gap: spacing.sm }} align="stretch">
          <Text bold size={13} color={colors.label}>
            Tầm nhìn, Sứ mệnh của Nhà cung cấp
          </Text>
          <Text size={14}>{supplier?.visionAndMission || ""}</Text>

          <Spacer size={5} />
          <Text bold size={13} color={colors.label}>
            Mục tiêu trung và dài hạn
          </Text>
          <Text size={14}>{supplier?.midLongTermGoals || ""}</Text>

          <Spacer size={5} />
          <ColumnInfo
            label="Lĩnh vực hoạt động chính"
            value={supplier?.mainBusinessArea || ""}
            full
          />
          <ColumnInfo
            label="Sơ đồ tổ chức"
            value={supplier?.fileOrganization ? "Xem file" : ""}
            onPress={
              supplier?.fileOrganization
                ? () => Linking.openURL(supplier.fileOrganization)
                : undefined
            }
            full
            last
          />
        </Column>
      </Collapse>

      <Spacer size={10} />

      {/* III. NHÂN SỰ */}
      <Collapse title="III. Nhân sự" collapsible={true}>
        <Column style={{ gap: spacing.sm }} align="stretch">
          <Text bold size={13} color={colors.title}>
            Số lượng CB CNV toàn thời gian
          </Text>
          <Row full justify="space-between">
            <Column align="center">
              <Text size={12} color={colors.label}>
                Trực tiếp
              </Text>
              <Text bold>{supplier?.directEmpCount || 0}</Text>
            </Column>
            <Column align="center">
              <Text size={12} color={colors.label}>
                Gián tiếp
              </Text>
              <Text bold>{supplier?.indirectEmpCount || 0}</Text>
            </Column>
            <Column align="center">
              <Text size={12} color={colors.label}>
                Khác
              </Text>
              <Text bold>{supplier?.otherEmpCount || 0}</Text>
            </Column>
            <Column align="center">
              <Text size={12} color={colors.label}>
                Tổng cộng
              </Text>
              <Text bold color={colors.active}>
                {supplier?.totalEmpCount || 0}
              </Text>
            </Column>
          </Row>

          <Divider top={5} bottom={5} />
          <Text bold size={13} color={colors.title}>
            Vị trí then chốt (Họ và tên)
          </Text>
          <Row full gap={spacing.md}>
            <ColumnInfo label="Giám đốc" value={supplier?.director || ""} />
            <ColumnInfo
              label="TP Kinh doanh/Marketing"
              value={supplier?.marketingManager || ""}
            />
          </Row>

          <Row full gap={spacing.md}>
            <ColumnInfo
              label="TP Cung ứng/Mua"
              value={supplier?.procurementManager || ""}
            />
            <ColumnInfo label="Quản đốc" value={supplier?.foreman || ""} last />
          </Row>

          <Divider top={5} bottom={5} />
          <Text bold size={13} color={colors.title}>
            Số lượng nhân sự của các phòng chức năng
          </Text>
          <Row full gap={spacing.md}>
            <ColumnInfo
              label="Phòng R&D"
              value={supplier?.rndDepartmentCount || 0}
            />
            <ColumnInfo
              label="Phòng Mua hàng"
              value={supplier?.purchasingDepartmentCount || 0}
            />
          </Row>

          <Row full gap={spacing.md}>
            <ColumnInfo
              label="BP Sản xuất"
              value={supplier?.productionDepartmentCount || 0}
            />
            <ColumnInfo
              label="Phòng Chất lượng"
              value={supplier?.qualityDepartmentCount || 0}
            />
          </Row>

          <Row full gap={spacing.md}>
            <ColumnInfo
              label="Phòng Bảo hành - Bảo trì"
              value={supplier?.warrantyMaintenanceDepartmentCount || 0}
            />
            <ColumnInfo
              label="P. Kiểm tra và thử"
              value={supplier?.testingDepartmentCount || 0}
            />
          </Row>

          <Row full gap={spacing.md}>
            <ColumnInfo
              label="P. Marketing và Sale"
              value={supplier?.marketingSalesDepartmentCount || 0}
            />
            <ColumnInfo
              label="P. Kỹ thuật"
              value={supplier?.technicalDepartmentCount || 0}
            />
          </Row>

          <Row full gap={spacing.md}>
            <ColumnInfo
              label="Số giờ làm việc Trung bình tuần"
              value={supplier?.avgWeeklyWorkingHours || 0}
              full
              last
            />
          </Row>
        </Column>
      </Collapse>

      <Spacer size={10} />

      {/* IV. CÁC CHỈ SỐ VỀ TÀI CHÍNH */}
      <Collapse title="IV. Các chỉ số về tài chính" collapsible={true}>
        <Column style={{ gap: spacing.sm }} align="stretch">
          <ColumnInfo
            label="Năm tài chính"
            value={
              supplier?.fiscalYearRangeFrom || supplier?.fiscalYearRangeTo
                ? `Từ Tháng ${supplier.fiscalYearRangeFrom || 0} - Đến Tháng ${
                    supplier.fiscalYearRangeTo || 0
                  }`
                : ""
            }
            full
          />
          <ColumnInfo
            label="Tài liệu đính kèm báo cáo tài chính năm gần nhất"
            value={supplier?.financialReportFile ? "Xem file" : ""}
            onPress={
              supplier?.financialReportFile
                ? () => Linking.openURL(supplier.financialReportFile)
                : undefined
            }
            full
          />

          <Spacer size={10} />
          <Text bold size={13} color={colors.label}>
            Doanh thu của nhà cung cấp trong 5 năm gần đây
          </Text>
          <Table
            columns={["Năm", "Doanh thu"]}
            columnWidths={["auto", "auto"]}
            horizontalScroll
            rows={(supplier?.revenueHistory || []).map((rev: any) => ({
              cells: [
                rev.year ? moment(rev.year).format("YYYY") : "---",
                NumberHelper.formatMoney(rev.revenue),
              ],
            }))}
            onRowDoublePress={(index) => {
              openSheet(() => (
                <SupplierRevenueDetailSheet
                  item={supplier.revenueHistory[index]}
                />
              ));
            }}
          />
        </Column>
      </Collapse>

      <Spacer size={10} />

      {/* V. Nghiên cứu và phát triển sản phẩm */}
      <Collapse title="V. Nghiên cứu và phát triển sản phẩm" collapsible={true}>
        <Column style={{ gap: spacing.sm }} align="stretch">
          <Text bold size={11} color={colors.label}>
            Nhà cung cấp có bộ phận chuyên trách về nghiên cứu sản phẩm mới và
            phát triển sản phẩm hiện có không?
          </Text>
          <Text size={14}>{supplier?.hasResearchDept ? "Có" : "Không"}</Text>

          {supplier?.hasResearchDept && (
            <>
              <Spacer size={10} />
              <Text bold size={11} color={colors.label}>
                Số thành viên R&D
              </Text>
              <Text size={14}>{supplier?.researchDeptMemberCount || 0}</Text>
            </>
          )}

          <Text bold size={11} color={colors.label}>
            Thành tựu về Nghiên cứu và phát triển của nhà cung cấp hoặc các giải
            thưởng, chứng nhận đạt được
          </Text>
          <Text size={14}>{supplier?.researchAchievements || ""}</Text>
        </Column>
      </Collapse>
    </>
  );
};

export default SupplierCommonInfo;

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({});
