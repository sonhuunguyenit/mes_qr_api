import moment from "moment";
import React, { useCallback, useMemo } from "react";
import { Alert, Linking, ScrollView } from "react-native";
import { Collapse, Column, Row, Spacer } from "~/common";
import Table, { ColumnTable } from "~/common/Table";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useSheet } from "~/contexts/SheetContext";
import { useTheme } from "~/hooks/useTheme";
import globalStyle from "~/styles/global-style";
import { MaterialUOMDetailSheet } from "../sheets/MaterialUOMDetailSheet";

import {
  MaterialItemData,
  MaterialUOMItem,
} from "~/services/material/material.type";

interface MaterialApprovalDetailInfoTabProps {
  data: MaterialItemData;
}

const UOM_WIDTHS = [
  50, 80, 150, 80, 150, 80, 80, 80, 120, 150, 100, 100, 100, 100,
];
const UOM_ALIGNS: ("left" | "center" | "right")[] = [
  "center", // STT
  "center", // Hệ số X
  "left", // ĐVT thay thế
  "center", // Hệ số Y
  "left", // ĐVT
  "right", // Dài
  "right", // Rộng
  "right", // Cao
  "center", // Unit of Dimension
  "right", // Thể tích
  "center", // Area Unit
  "right", // Gross Weight
  "right", // Net Weight
  "center", // Weight unit
];

export const MaterialApprovalDetailInfoTab = React.memo(
  ({ data }: MaterialApprovalDetailInfoTabProps) => {
    const { colors } = useTheme();
    const { openSheet } = useSheet();

    const handleRowDoublePress = useCallback(
      (index: number) => {
        const items = data?.lstUOM || [];
        const item = items[index];
        if (item) {
          openSheet(<MaterialUOMDetailSheet item={item} index={index} />);
        }
      },
      [data?.lstUOM, openSheet],
    );

    const uomTableContent = useMemo(() => {
      const items = data?.lstUOM || [];
      return items.map((item: MaterialUOMItem, idx: number) => ({
        cells: [
          (idx + 1).toString(),
          item.coefficientX != null
            ? Number(item.coefficientX).toLocaleString("en-US")
            : "0",
          item.uomAlternativeName || "---",
          item.coefficientY != null
            ? Number(item.coefficientY).toLocaleString("en-US")
            : "0",
          item.oumCode || "---",
          item.lngth != null ? Number(item.lngth).toLocaleString("en-US") : "0",
          item.width != null ? Number(item.width).toLocaleString("en-US") : "0",
          item.height != null
            ? Number(item.height).toLocaleString("en-US")
            : "0",
          item.unitOfDimensionCode || "---",
          item.cmb != null ? Number(item.cmb).toLocaleString("en-US") : "0",
          item.unitOfVolumeMaterialUomCode || "---",
          item.grossWeight != null
            ? Number(item.grossWeight).toLocaleString("en-US")
            : "0",
          item.netWeight != null
            ? Number(item.netWeight).toLocaleString("en-US")
            : "0",
          item.unitOfMassMaterialUomCode || "---",
        ] as ColumnTable[],
      }));
    }, [data?.lstUOM]);

    const handleOpenImage = (url: string) => {
      Linking.canOpenURL(url)
        .then((supported) => {
          if (supported) {
            Linking.openURL(url);
          } else {
            Alert.alert("Lỗi", "Không thể mở đường dẫn hình ảnh này.");
          }
        })
        .catch(() => {
          Alert.alert("Lỗi", "Đã xảy ra lỗi khi mở đường dẫn.");
        });
    };

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={globalStyle.scrollContainerDetail}
      >
        {/* I. THÔNG TIN CHUNG */}
        <Collapse title="I. Thông tin chung" collapsible defaultExpanded>
          <Column gap={12} align="stretch">
            <Row full gap={16}>
              <ColumnInfo label="Mã vật tư" value={data?.code} />
              <ColumnInfo label="Mã vật tư cũ" value={data?.oldCode} />
            </Row>

            <Row full gap={16}>
              <ColumnInfo label="Đơn vị tính" value={data?.baseUnitCode} />
              <ColumnInfo label="Tên hàng cũ" value={data?.oldMaterialName} />
            </Row>

            <Row full gap={16}>
              <ColumnInfo label="MatType" value={data?.materialTypeLable} />
              <ColumnInfo label="Tên ngắn" value={data?.name} />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="Material Group"
                value={data?.materialGroupLable}
              />
              <ColumnInfo label="Tên dài" value={data?.longText} />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="External Material Group"
                value={data?.externalMaterialGroupLable}
              />
              <ColumnInfo
                label="Tên vật tư tiếng anh"
                value={data?.englishName}
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo label="Nguồn mua" value={data?.purchasingSource} />
              <ColumnInfo
                label="Tên đại diện"
                value={data?.representativeName}
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo label="Ngành hàng" value={data?.divisionTCode} />
              <ColumnInfo
                label="Tên khai hải quan"
                value={data?.customsName || data?.customsDeclarationName}
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="Cấu trúc phân cấp sản phẩm"
                value={data?.productHierarchyName}
              />
              <ColumnInfo label="Tên khoa học" value={data?.scientificName} />
            </Row>

            <ColumnInfo label="Plant" value={data?.plantCode} full last />
          </Column>
        </Collapse>

        <Spacer size={10} />

        {/* II. THÔNG TIN ĐƠN VỊ TÍNH */}
        <Collapse
          title="II. Thông tin đơn vị tính"
          collapsible
          defaultExpanded
          containerStyle={globalStyle.collapseContainer}
        >
          <Table
            horizontalScroll
            columns={[
              "STT",
              "Hệ số X",
              "Đơn vị tính thay thế",
              "Hệ số Y",
              "Đơn vị tính",
              "Dài",
              "Rộng",
              "Cao",
              "Unit of Dimension",
              "Thể tích (CBM/SKU)",
              "Area Unit",
              "Gross Weight",
              "Net Weight",
              "Weight unit",
            ]}
            columnWidths={UOM_WIDTHS}
            columnTextAlignments={UOM_ALIGNS}
            rows={uomTableContent}
            onRowDoublePress={handleRowDoublePress}
            pagination={{ enabled: false }}
          />
        </Collapse>

        <Spacer size={10} />

        {/* III. ĐẶC TÍNH & THÔNG TIN QUẢN LÝ */}
        <Collapse
          title="III. Đặc tính & Thông tin quản lý"
          collapsible
          defaultExpanded
        >
          <Column gap={12} align="stretch">
            <Row full gap={16}>
              <ColumnInfo
                label="Mã quản lý lô"
                value={data?.batch || data?.batchCode}
              />
              <ColumnInfo label="Mã HS code" value={data?.hsCode} />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="Mã theo khách hàng"
                value={data?.customerSpecificCode}
              />
              <ColumnInfo
                label="Cấp 5 - Đặc tính SP1 (Loại/Model/Lõi Ván)"
                value={data?.productTypeLevel1Name || data?.productTypeLevel1Id}
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="Cấp 6 - Đặc tính SP2 (Màu/Décor/Bao bì)"
                value={
                  data?.productAppearanceLevel2Name ||
                  data?.productAppearanceLevel2Id
                }
              />
              <ColumnInfo
                label="Cấp 7 - Đặc tính SP3 (cơ lí hóa tính -chống trầy, tỷ trọng….mạ)"
                value={
                  data?.physicalPropertiesLevel3Name ||
                  data?.physicalPropertiesLevel3Id
                }
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="Cấp 8 - Đặc tính SP4 (Rulo/phẩm cấp/Màu sắc lõi Ván….khác)"
                value={
                  data?.coreAttributesLevel4Name || data?.coreAttributesLevel4Id
                }
              />
              <ColumnInfo
                label="Cấp 9 - Backing/Dòng Keo/Nhóm Đóng gói/Số mặt phủ"
                value={
                  data?.backingAndPackingGroupName ||
                  data?.backingAndPackingGroupId
                }
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="Cấp 10 - Quy cách/đóng gói 1"
                value={
                  data?.packingSpecification1Name ||
                  data?.packingSpecification1Id
                }
              />
              <ColumnInfo
                label="Cấp 11 - Quy cách/đóng gói 2"
                value={
                  data?.packingSpecification2Name ||
                  data?.packingSpecification2Id
                }
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="Cấp 12 - Loại keo/Loại Khuôn/ Hèm khóa/Nhãn hiệu M1"
                value={
                  data?.glueMoldLockingBrandM1Name ||
                  data?.glueMoldLockingBrandM1Id
                }
              />
              <ColumnInfo
                label="Cấp 13 - Dòng SP theo quy cách/Nhóm hoa văn M1"
                value={
                  data?.productLinePatternGroupM1Name ||
                  data?.productLinePatternGroupM1Id
                }
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="Cấp 14 - Dòng SP theo Hoa văn+Khuôn/Hoa Văn M1"
                value={
                  data?.productPatternAndMoldM1Name ||
                  data?.productPatternAndMoldM1Id
                }
              />
              <ColumnInfo
                label="Cấp 15 - Cấp phát thải For/Mã màu M1"
                value={
                  data?.formaldehydeGradeColorM1Name ||
                  data?.formaldehydeGradeColorM1Id
                }
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="Cấp 16 - Phẩm cấp Sản xuất/Khuôn M1"
                value={
                  data?.productionGradeMoldM1Name ||
                  data?.productionGradeMoldM1Id
                }
              />
              <ColumnInfo
                label="Cấp 17- Giấy Overlay/Div M2"
                value={data?.overlayPaperDivM2Name || data?.overlayPaperDivM2Id}
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="Cấp 18- Giấy Balance/Nhãn hiệu M2"
                value={
                  data?.balancePaperBrandM2Name || data?.balancePaperBrandM2Id
                }
              />
              <ColumnInfo
                label="Cấp 19- Nhóm hoa văn M2"
                value={data?.patternGroupM2Name || data?.patternGroupM2Id}
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="Cấp 20- Hoa văn M2"
                value={data?.patternM2Name || data?.patternM2Id}
              />
              <ColumnInfo
                label="Cấp 21- Mã màu M2"
                value={data?.colorCodeM2Name || data?.colorCodeM2Id}
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo
                label="Cấp 22- Khuôn hiệu ứng M2"
                value={data?.moldEffectM2Name || data?.moldEffectM2Id}
              />
              <ColumnInfo
                label="Số máy/ thùng"
                value={data?.numberMachinesBox}
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo label="Class Type" value={data?.classType} />
              <ColumnInfo
                label="Flag for delete"
                value={data?.flagForDetete ? "Có" : "Không"}
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo label="Create by" value={data?.createBy} />
              <ColumnInfo
                label="Create On"
                value={
                  data?.createOn
                    ? moment(data.createOn).format("DD/MM/YYYY")
                    : "---"
                }
              />
            </Row>

            <Row full gap={16}>
              <ColumnInfo label="DVT Cấp 2" value={data?.unit2Code} />
              <ColumnInfo label="Size" value={data?.size} />
            </Row>

            <ColumnInfo
              label="Material Batch"
              value={data?.isMaterialBatch ? "Có" : "Không"}
              full
            />

            <ColumnInfo label="Link" value={data?.link} full />

            {data?.imageMaterialUrl ? (
              <ColumnInfo
                label="File Hình ảnh"
                value="Nhấn để xem hình ảnh"
                valueStyle={{
                  color: colors.primary,
                  textDecorationLine: "underline",
                }}
                onPress={() => handleOpenImage(data.imageMaterialUrl!)}
                full
                last
              />
            ) : (
              <ColumnInfo label="File Hình ảnh" value="---" full last />
            )}
          </Column>
        </Collapse>
      </ScrollView>
    );
  },
);
