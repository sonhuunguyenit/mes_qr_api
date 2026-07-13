import React from "react";
import { Button, Tooltip, Space, Badge, Tag } from "antd";
import { HistoryOutlined, EditOutlined } from "@ant-design/icons";
import { Bom } from "../types";
import { Hscb } from "../../hscb/types";
import { AppTable } from "../../../components";
import { PRIMARY_COLOR } from "../../../contants";

interface BomTableProps {
  dataSource: Bom[];
  allHscbs: Hscb[];
  onViewDetails: (bom: Bom) => void;
  onViewHistory: (bom: Bom) => void;
  loading?: boolean;
}

export const BomTable: React.FC<BomTableProps> = ({
  dataSource,
  allHscbs,
  onViewDetails,
  onViewHistory,
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
      key: "ErpVersion",
      width: 150,
      align: "center" as const,
      render: (record: Bom) => {
        const erpVal = Number(record.ErpVersion) || 1;
        const storageVal = Number(record.Version) || 1;
        const isMismatch = erpVal !== storageVal;
        return (
          <Space size="small">
            <Tooltip title={`ERP v${erpVal}`}>
              <Badge
                count={erpVal}
                showZero
                color={isMismatch ? "#fa8c16" : "#1677ff"}
                style={{ cursor: "default" }}
              />
            </Tooltip>
            {isMismatch && (
              <Tooltip
                title={`Chênh lệch: Phiên bản hệ thống là ${storageVal}`}
              >
                <Tag color="warning" style={{ margin: 0 }}>
                  Lệch ERP
                </Tag>
              </Tooltip>
            )}
          </Space>
        );
      },
    },
    {
      title: "Version BOM",
      dataIndex: "Version",
      key: "Version",
      width: 120,
      align: "center" as const,
      render: (val: any) => {
        const v = Number(val) || 1;
        return (
          <Tooltip title={`Hệ thống v${v}`}>
            <Badge
              count={v}
              showZero
              color="#52c41a"
              style={{ cursor: "default" }}
            />
          </Tooltip>
        );
      },
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
      width: 150,
      fixed: "right" as const,
      render: (record: Bom) => (
        <Space size="middle">
          <Tooltip title="Điều chỉnh">
            <Button
              type="primary"
              icon={<EditOutlined style={{ fontSize: "16px" }} />}
              onClick={() => onViewDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Lịch sử thay đổi">
            <Button
              icon={
                <HistoryOutlined
                  style={{ fontSize: "16px", color: PRIMARY_COLOR }}
                />
              }
              onClick={() => onViewHistory(record)}
            />
          </Tooltip>
        </Space>
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
