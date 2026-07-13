import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Card, Descriptions, Tag, Result, Row, Col } from "antd";
import {
  CheckCircleFilled,
  SafetyCertificateOutlined,
  GlobalOutlined,
  BarcodeOutlined,
  ShopOutlined,
  CalendarOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { useAppSelector } from "../../../store/hooks";
import { getFgLotInfo } from "../services/erp-lot.service";
import { mockBarcodes } from "../../../local-data/barcode";
import { LicenseType } from "../../facility/types";

export const PublicTracePage: React.FC = () => {
  const { itemCode } = useParams<{ itemCode: string }>();
  const [searchParams] = useSearchParams();
  const lotCode = searchParams.get("lot") || "";

  // Select store data
  const items = useAppSelector((state) => state.item.items);
  const boms = useAppSelector((state) => state.bom.boms);
  const hscbs = useAppSelector((state) => state.hscb.hscbs);
  const specs = useAppSelector((state) => state.spec.specs);
  const facilities = useAppSelector((state) => state.facility.facilities);
  const shttMappings = useAppSelector((state) => state.shtt.mappings || []);
  const ipmsInfo = useAppSelector((state) => state.shtt.ipmsInfo || {});

  if (!itemCode || !lotCode) {
    return (
      <Result
        status="warning"
        title="Thiếu thông tin truy xuất"
        subTitle="Vui lòng quét mã QR hợp lệ từ bao bì sản phẩm."
      />
    );
  }

  // Find item
  const selectedItem = items.find((it) => it.ItemCode === itemCode);
  if (!selectedItem) {
    return (
      <Result
        status="error"
        title="Không tìm thấy sản phẩm"
        subTitle={`Sản phẩm với mã ${itemCode} không tồn tại trên hệ thống.`}
      />
    );
  }

  // Get ERP lot info
  const fgLotResp = getFgLotInfo(itemCode, lotCode);
  if (fgLotResp.status === "error" || !fgLotResp.data) {
    return (
      <Result
        status="error"
        title="Không tìm thấy lô sản xuất"
        subTitle={`Mã lô ${lotCode} của sản phẩm này không tồn tại hoặc chưa được đồng bộ từ ERP.`}
      />
    );
  }

  const erpOutput = fgLotResp.data;

  // Resolve HSCB & Spec
  const matchedBom =
    boms.find(
      (b) =>
        b.ItemCode === itemCode &&
        (b.Version === erpOutput.FactoryVersionBOM ||
          b.ErpVersion === erpOutput.FactoryVersionBOM),
    ) || boms.find((b) => b.ItemCode === itemCode);

  let matchedHscbVersion: any = null;
  let matchedHscb: any = null;

  if (matchedBom && matchedBom.Selected_HscbVersionId) {
    for (const h of hscbs) {
      const v = h.HscbVersions?.find(
        (ver) => ver.HscbVersionId === matchedBom.Selected_HscbVersionId,
      );
      if (v) {
        matchedHscbVersion = v;
        matchedHscb = h;
        break;
      }
    }
  }

  if (!matchedHscb) {
    const h = hscbs.find(
      (x) =>
        x.HscbCode === `HSCB-${itemCode}` ||
        x.HscbVersions?.some((ver) =>
          ver.HscbItems?.some((it) => it.ItemCode === itemCode),
        ),
    );
    if (h) {
      matchedHscb = h;
      matchedHscbVersion =
        h.HscbVersions?.find((v) => v.Status === "APPROVED") ||
        h.HscbVersions?.[0];
    }
  }

  const matchedSpec = specs.find((s) => s.SpecId === matchedHscb?.SpecId);

  // Resolve producing facility (Nhà máy sản xuất)
  let producingFacility = facilities.find(
    (fac) =>
      matchedHscb?.producingFacilityIds?.includes(fac.FacilityId) &&
      (fac.FacilityCode === erpOutput.FactoryCode ||
        fac.FacilityId === erpOutput.FactoryCode),
  );

  if (!producingFacility && matchedHscb?.producingFacilityIds?.length > 0) {
    producingFacility = facilities.find(
      (fac) => fac.FacilityId === matchedHscb.producingFacilityIds[0],
    );
  }

  if (!producingFacility) {
    producingFacility = facilities.find(
      (fac) =>
        fac.FacilityCode === erpOutput.FactoryCode ||
        fac.FacilityId === erpOutput.FactoryCode,
    );
  }

  const attpLicenseOfFactory = producingFacility?.Licenses?.find(
    (lic) => lic.LicenseType === LicenseType.ATVSTP,
  );

  // Resolve Barcode
  const foundBarcodeObj = mockBarcodes.find((bc) =>
    bc.BarcodeItems?.some((item) => item.ItemCode === itemCode),
  );
  const barcodeNumber = foundBarcodeObj
    ? foundBarcodeObj.BarcodeNumber
    : `893601${itemCode.replace(/\D/g, "").padStart(6, "0")}`;

  // Resolve SHTT patent
  const shttMapping = shttMappings.find(
    (m: any) => m.HscbVersionId === matchedHscbVersion?.HscbVersionId,
  );
  const ipms = shttMapping ? ipmsInfo[shttMapping.ShttCode] : null;

  const circularBrandName =
    ipms?.Trademark_Name || matchedHscb?.Spec?.Brand || "CHIN-SU";

  const circularShttPatentNo = shttMapping?.ShttCode
    ? `Bằng bảo hộ độc quyền nhãn hiệu số ${shttMapping.ShttCode}`
    : "Bằng bảo hộ độc quyền nhãn hiệu số 12345/SHTT";

  const circularQualityStandard = matchedSpec
    ? `${matchedSpec.SpecCode} - Bản tự công bố số ${matchedHscb?.HscbCode || "456/MSN/2024"}`
    : "TCCS 01:2024/MSN - Bản tự công bố số 456/MSN/2024";

  // Product Images (1 lớn + 3 nhỏ)
  const productImages = [
    "https://images.unsplash.com/photo-1612927601601-6638404737ce?q=80&w=600",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200",
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=200",
    "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=200",
  ];

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh",
        padding: "16px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: "800px" }}>
        {/* Certificate Card */}
        <Card
          bordered={false}
          style={{
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            borderRadius: "16px",
            background: "#ffffff",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Top Gold Stripe */}
          <div
            style={{
              height: "8px",
              background:
                "linear-gradient(90deg, #d4b106 0%, #fadb14 50%, #d4b106 100%)",
            }}
          />

          {/* Header */}
          <div style={{ textAlign: "center", padding: "24px 16px 12px 16px" }}>
            <h2
              style={{
                color: "#856404",
                margin: 0,
                fontSize: "18px",
                fontWeight: "bold",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Bản Công Bố Truy Xuất Nguồn Gốc Sản Phẩm
            </h2>
            <div
              style={{
                fontSize: "11px",
                color: "#721c24",
                fontWeight: 600,
                marginTop: "4px",
              }}
            >
              (Theo Thông tư hướng dẫn về Truy xuất nguồn gốc và An toàn thực
              phẩm)
            </div>
          </div>

          {/* Header Badge */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <Tag
              color="success"
              icon={<CheckCircleFilled style={{ color: "#fff" }} />}
              style={{
                borderRadius: "20px",
                fontWeight: "bold",
                fontSize: "11px",
                padding: "4px 12px",
                boxShadow: "0 2px 8px rgba(82, 196, 26, 0.2)",
                border: "none",
              }}
            >
              ĐÃ XÁC MINH GS1
            </Tag>
          </div>

          {/* Content Body */}
          <div style={{ padding: "0 20px 24px 20px" }}>
            <Row gutter={[24, 24]}>
              {/* Cột trái: Thông tin thuộc tính (Descriptions) */}
              <Col xs={24} md={15}>
                <Descriptions
                  bordered
                  size="small"
                  column={1}
                  labelStyle={{
                    width: "35%",
                    fontWeight: "600",
                    color: "#595959",
                    background: "#fafafa",
                  }}
                  contentStyle={{ background: "#ffffff", color: "#262626" }}
                >
                  <Descriptions.Item
                    label={
                      <span>
                        <GlobalOutlined
                          style={{ marginRight: 6, color: "#d4b106" }}
                        />
                        Tên sản phẩm
                      </span>
                    }
                  >
                    <strong style={{ color: "#856404" }}>
                      {matchedHscb?.LegalProductName || selectedItem.ItemName}
                    </strong>
                  </Descriptions.Item>

                  <Descriptions.Item
                    label={
                      <span>
                        <GlobalOutlined
                          style={{ marginRight: 6, color: "#d4b106" }}
                        />
                        Thương hiệu
                      </span>
                    }
                  >
                    <strong>{circularBrandName}</strong>
                  </Descriptions.Item>

                  <Descriptions.Item
                    label={
                      <span>
                        <GlobalOutlined
                          style={{ marginRight: 6, color: "#d4b106" }}
                        />
                        Xuất xứ
                      </span>
                    }
                  >
                    Việt Nam
                  </Descriptions.Item>

                  <Descriptions.Item
                    label={
                      <span>
                        <ShopOutlined
                          style={{ marginRight: 6, color: "#d4b106" }}
                        />
                        Cơ sở sản xuất
                      </span>
                    }
                  >
                    <div>
                      <strong>
                        {producingFacility?.FacilityName ||
                          "Nhà máy Masan Bình Dương"}
                      </strong>
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#8c8c8c",
                        marginTop: "2px",
                      }}
                    >
                      Địa chỉ:{" "}
                      {attpLicenseOfFactory?.Address ||
                        "Khu công nghiệp Sóng Thần 1, Dĩ An, Tỉnh Bình Dương"}
                    </div>
                  </Descriptions.Item>

                  <Descriptions.Item
                    label={
                      <span>
                        <ShopOutlined
                          style={{ marginRight: 6, color: "#d4b106" }}
                        />
                        Đơn vị phân phối
                      </span>
                    }
                  >
                    <div>
                      <strong>
                        Công ty Cổ phần Thương mại Dịch vụ Tổng hợp WinCommerce
                      </strong>
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#8c8c8c",
                        marginTop: "2px",
                      }}
                    >
                      Địa chỉ: Tòa nhà Netland, 20 Cộng Hòa, Phường 12, Quận Tân
                      Bình, TP.HCM
                    </div>
                  </Descriptions.Item>

                  <Descriptions.Item
                    label={
                      <span>
                        <BarcodeOutlined
                          style={{ marginRight: 6, color: "#d4b106" }}
                        />
                        Số lô sản xuất
                      </span>
                    }
                  >
                    <Tag
                      color="warning"
                      style={{
                        fontWeight: "bold",
                        fontSize: "11px",
                        borderRadius: "4px",
                      }}
                    >
                      {lotCode}
                    </Tag>
                  </Descriptions.Item>

                  <Descriptions.Item
                    label={
                      <span>
                        <CalendarOutlined
                          style={{ marginRight: 6, color: "#d4b106" }}
                        />
                        Hạn sử dụng
                      </span>
                    }
                  >
                    <strong>{erpOutput?.HSD || "2027-12-31"}</strong>
                  </Descriptions.Item>

                  <Descriptions.Item
                    label={
                      <span>
                        <SafetyCertificateOutlined
                          style={{ marginRight: 6, color: "#d4b106" }}
                        />
                        Tiêu chuẩn áp dụng
                      </span>
                    }
                  >
                    {circularQualityStandard}
                  </Descriptions.Item>

                  <Descriptions.Item
                    label={
                      <span>
                        <SafetyOutlined
                          style={{ marginRight: 6, color: "#d4b106" }}
                        />
                        Bảo hộ Sở hữu trí tuệ
                      </span>
                    }
                  >
                    {circularShttPatentNo}
                  </Descriptions.Item>
                </Descriptions>
              </Col>

              {/* Cột phải: Hình ảnh sản phẩm (1 lớn + 3 nhỏ) */}
              <Col xs={24} md={9}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "600",
                      color: "#595959",
                      marginBottom: 8,
                      fontSize: "13px",
                    }}
                  >
                    Hình ảnh nhãn & sản phẩm:
                  </div>
                  {/* Ảnh lớn */}
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "1.2/1",
                      borderRadius: 8,
                      overflow: "hidden",
                      marginBottom: 8,
                      border: "1px solid #f0f0f0",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                  >
                    <img
                      src={productImages[0]}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      alt="Ảnh mặt trước"
                    />
                  </div>
                  {/* 3 ảnh nhỏ */}
                  <Row gutter={6}>
                    <Col span={8}>
                      <div
                        style={{
                          width: "100%",
                          aspectRatio: "1/1",
                          borderRadius: 6,
                          overflow: "hidden",
                          border: "1px solid #f0f0f0",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                        }}
                      >
                        <img
                          src={productImages[1]}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          alt="Ảnh mặt sau"
                        />
                      </div>
                    </Col>
                    <Col span={8}>
                      <div
                        style={{
                          width: "100%",
                          aspectRatio: "1/1",
                          borderRadius: 6,
                          overflow: "hidden",
                          border: "1px solid #f0f0f0",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                        }}
                      >
                        <img
                          src={productImages[2]}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          alt="Ảnh nhãn phụ"
                        />
                      </div>
                    </Col>
                    <Col span={8}>
                      <div
                        style={{
                          width: "100%",
                          aspectRatio: "1/1",
                          borderRadius: 6,
                          overflow: "hidden",
                          border: "1px solid #f0f0f0",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                        }}
                      >
                        <img
                          src={productImages[3]}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          alt="Ảnh khác"
                        />
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>

          {/* Footer Logo & Disclaimer */}
          <div
            style={{
              background: "#fafafa",
              padding: "16px",
              textAlign: "center",
              borderTop: "1px solid #f0f0f0",
              fontSize: "11px",
              color: "#bfbfbf",
            }}
          >
            <div>
              Hệ thống quản lý dữ liệu truy xuất nguồn gốc Masan QA Portal
            </div>
            <div style={{ marginTop: "4px" }}>
              © {new Date().getFullYear()} Masan Consumer Corp. All rights
              reserved.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
