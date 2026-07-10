import React from "react";
import { Button, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { Bom } from "../types";
import { Hscb } from "../../hscb/types";
import { AppTable } from "../../../components";

interface BomTableProps {
  dataSource: Bom[];
  allHscbs: Hscb[];
  onViewDetails: (bom: Bom) => void;
  loading?: boolean;
}

export const BomTable: React.FC<BomTableProps> = ({
  dataSource,
  allHscbs,
  onViewDetails,
  loading = false,
}) => {
  const columns = [
    {
      title: "Mã BOM",
      dataIndex: "BomId",
      key: "BomId",
      width: 120,
      align: "center" as const,
      render: (text: string) => (
        <strong style={{ color: "#096dd9" }}>{text}</strong>
      ),
    },
    {
      title: "Mã Sản Phẩm",
      dataIndex: "ItemCode",
      key: "ItemCode",
      width: 160,
      align: "center" as const,
      render: (text: string) => (
        <strong style={{ color: "#096dd9" }}>{text}</strong>
      ),
    },
    {
      title: "Version ERP",
      dataIndex: "ErpVersion",
      key: "ErpVersion",
      width: 120,
      align: "center" as const,
    },
    {
      title: "Version BOM",
      dataIndex: "Version",
      key: "Version",
      width: 120,
      align: "center" as const,
    },
    {
      title: "HSCB Thành phẩm",
      key: "Selected_HscbVersionId",
      width: 380,
      render: (record: Bom) => {
        if (!record.Selected_HscbVersionId) return "-";
        const match = allHscbs.find((h) =>
          h.HscbVersions?.some(
            (v) => v.HscbVersionId === record.Selected_HscbVersionId,
          ),
        );
        if (!match) return record.Selected_HscbVersionId;
        const ver = match.HscbVersions?.find(
          (v) => v.HscbVersionId === record.Selected_HscbVersionId,
        );
        return `${match.HscbCode} (${ver?.VersionName || ""})`;
      },
    },
    {
      title: "Thời hạn hiệu lực",
      key: "Validity",
      width: 200,
      align: "center" as const,
      render: (record: Bom) => {
        const from = record.ValidFrom ? String(record.ValidFrom) : "";
        const to = record.ValidTo ? String(record.ValidTo) : "";
        return to ? `${from} ➔ ${to}` : from;
      },
    },
    {
      title: "Số lượng Item",
      key: "LinesCount",
      width: 120,
      align: "center" as const,
      render: (record: any) => record.BomLines?.length || 0,
    },
    {
      title: "Hành động",
      key: "action",
      align: "center" as const,
      width: 120,
      fixed: "right" as const,
      render: (record: Bom) => (
        <Tooltip title="Chi tiết">
          <Button
            type="primary"
            icon={<EyeOutlined style={{ fontSize: "16px" }} />}
            onClick={() => onViewDetails(record)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <AppTable
      dataSource={dataSource}
      columns={columns}
      rowKey="BomId"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "20", "50"],
        showTotal: (total) => `Tổng cộng ${total} dòng`,
      }}
      bordered
      size="middle"
      loading={loading}
      scroll={{ x: 1350 }}
    />
  );
};

export default BomTable;
