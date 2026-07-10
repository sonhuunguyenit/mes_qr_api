import {
  MenuUnfoldOutlined,
  SearchOutlined,
  ReloadOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Badge,
  Button,
  Col,
  Collapse,
  Descriptions,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { BomTable } from "../components";
import { updateBomLine, updateParentHscb } from "../store/bomSlice";
import { Bom, Bom_Line } from "../types";
import { DocStatus } from "../../doc/types";
import { PRIMARY_COLOR } from "../../../contants";

export const BomList: React.FC = () => {
  const dispatch = useAppDispatch();

  // Retrieve Redux state
  const boms = useAppSelector((state) => state.bom.boms);
  const items = useAppSelector((state) => state.item.items);
  const allSpecs = useAppSelector((state) => state.spec.specs);
  const allHscbs = useAppSelector((state) => state.hscb.hscbs);

  const [tempBomId, setTempBomId] = useState("");
  const [bomIdFilter, setBomIdFilter] = useState("");
  const [tempItemCode, setTempItemCode] = useState("");
  const [itemCodeFilter, setItemCodeFilter] = useState("");
  const [tempHscb, setTempHscb] = useState("");
  const [hscbFilter, setHscbFilter] = useState("");
  const [selectedBom, setSelectedBom] = useState<Bom | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSearch = () => {
    setBomIdFilter(tempBomId);
    setItemCodeFilter(tempItemCode);
    setHscbFilter(tempHscb);
  };

  const handleReset = () => {
    setTempBomId("");
    setTempItemCode("");
    setTempHscb("");
    setBomIdFilter("");
    setItemCodeFilter("");
    setHscbFilter("");
    message.success("Đã thiết lập lại bộ lọc!");
  };

  // Real-time sync of selected BOM from store
  const activeSelectedBom = selectedBom
    ? boms.find((b) => b.BomId === selectedBom.BomId)
    : null;

  // Local state to keep track of unsaved inline row edits in the tree table
  // Key represents the BomLineId, Value stores the selected Spec
  const [editedLines, setEditedLines] = useState<
    Record<string, { Selected_SpecId: string }>
  >({});

  // Local state to keep track of parent's unsaved HSCB version edit
  const [tempParentHscbId, setTempParentHscbId] = useState<string | undefined>(
    undefined,
  );

  // Sync temp parent HSCB state whenever the active selected BOM changes
  useEffect(() => {
    if (activeSelectedBom) {
      setTempParentHscbId(activeSelectedBom.Selected_HscbVersionId);
    } else {
      setTempParentHscbId(undefined);
    }
  }, [activeSelectedBom?.BomId, isModalVisible]);

  // Filter logic for main table
  const filteredBoms = boms.filter((bom) => {
    const matchesBomId = bom.BomId.toLowerCase().includes(
      bomIdFilter.toLowerCase(),
    );
    const matchesItemCode = bom.ItemCode.toLowerCase().includes(
      itemCodeFilter.toLowerCase(),
    );

    let matchesHscb = true;
    if (hscbFilter) {
      if (!bom.Selected_HscbVersionId) {
        matchesHscb = false;
      } else {
        const match = allHscbs.find((h) =>
          h.HscbVersions?.some(
            (v) => v.HscbVersionId === bom.Selected_HscbVersionId,
          ),
        );
        if (match) {
          const ver = match.HscbVersions?.find(
            (v) => v.HscbVersionId === bom.Selected_HscbVersionId,
          );
          const hscbText =
            `${match.HscbCode} (${ver?.VersionName || ""})`.toLowerCase();
          matchesHscb = hscbText.includes(hscbFilter.toLowerCase());
        } else {
          matchesHscb = bom.Selected_HscbVersionId.toLowerCase().includes(
            hscbFilter.toLowerCase(),
          );
        }
      }
    }

    return matchesBomId && matchesItemCode && matchesHscb;
  });

  // Helper to look up item info
  const getItemInfo = (code: string) => {
    return items.find((item) => item.ItemCode === code);
  };

  // mainColumns removed and extracted to components/BomTable.tsx

  const parentItem = selectedBom ? getItemInfo(selectedBom.ItemCode) : null;

  // Real-time sync of selected BOM from store (Moved to top)

  // Resolve parent HSCB version options
  const parentHscbOptions: any[] = [];
  if (activeSelectedBom && parentItem?.ItemType === "FG") {
    allHscbs.forEach((h) => {
      h.HscbVersions?.forEach((v) => {
        if (
          v.HscbItems?.some((hi) => hi.ItemCode === activeSelectedBom.ItemCode)
        ) {
          parentHscbOptions.push({
            label: `${h.HscbCode} - ${v.VersionName}`,
            value: v.HscbVersionId,
          });
        }
      });
    });
  }

  // Recursive builder for tree table datasource
  const buildTableTreeData = (bomLines: Bom_Line[], depth = 1): any[] => {
    if (depth > 7) return [];

    return bomLines.map((line) => {
      const item = items.find((i) => i.ItemCode === line.ErpItemCode);
      const subBom = boms.find((b) => b.ItemCode === line.ErpItemCode);

      const row: any = {
        key: line.BomLineId,
        line: line,
        bomId: line.BomId,
        ItemCode: line.ErpItemCode,
        ItemName: item?.ItemName || "N/A",
        ItemType: item?.ItemType || "N/A",
        UoM: item?.UoM || "N/A",
        depth: depth,
      };

      // Recurse for nested Finished Goods (FG-) or Semi-Finished Goods (IP-) ingredients
      if (
        (line.ErpItemCode.startsWith("FG-") ||
          line.ErpItemCode.startsWith("IP-")) &&
        subBom &&
        subBom.BomLines
      ) {
        if (depth >= 6) {
          // Recursion limit warning at Level 7
          row.children = [
            {
              key: `LIMIT-${line.BomLineId}`,
              isLimitNode: true,
              itemCode: line.ErpItemCode,
              subBom: subBom,
              depth: depth + 1,
            },
          ];
        } else {
          row.children = buildTableTreeData(subBom.BomLines, depth + 1);
        }
      }

      return row;
    });
  };

  // Sub-tree table columns (table group view in details modal)
  const treeColumns = [
    {
      title: "ItemCode",
      dataIndex: "ItemCode",
      key: "ItemCode",
      width: "38%",
      render: (text: string, record: any) => {
        if (record.isLimitNode) {
          return (
            <Alert
              type="warning"
              showIcon
              message={
                <span>
                  Độ sâu cây BOM đã đạt giới hạn ({record.depth - 1} cấp).{" "}
                  <Button
                    type="link"
                    size="small"
                    onClick={() => {
                      setSelectedBom(record.subBom);
                      setEditedLines({});
                    }}
                    style={{
                      padding: 0,
                      height: "auto",
                      verticalAlign: "baseline",
                    }}
                  >
                    Xem chi tiết BOM của {record.itemCode}
                  </Button>
                </span>
              }
              style={{ padding: "4px 10px" }}
            />
          );
        }
        return (
          <span>
            <strong style={{ color: "#1890ff" }}>{record.ItemCode}</strong> -{" "}
            {record.ItemName}
          </span>
        );
      },
      onCell: (record: any) => {
        if (record.isLimitNode) {
          return { colSpan: 5 };
        }
        return {};
      },
    },
    {
      title: "Phân loại",
      dataIndex: "ItemType",
      key: "ItemType",
      width: "12%",
      align: "center" as const,
      render: (text: string, record: any) => {
        if (record.isLimitNode) return null;
        let color = "blue";
        let label = record.ItemType;
        if (record.ItemType === "FG") {
          color = "purple";
          label = "Thành phẩm";
        } else if (record.ItemType === "IP") {
          color = "orange";
          label = "Bán thành phẩm";
        } else if (record.ItemType === "RM") {
          color = "green";
          label = "Nguyên liệu";
        } else if (record.ItemType === "PG") {
          color = "cyan";
          label = "Bao bì";
        }
        return <Tag color={color}>{label}</Tag>;
      },
      onCell: (record: any) => {
        if (record.isLimitNode) return { colSpan: 0 };
        return {};
      },
    },
    {
      title: "Tiêu chuẩn (Spec)",
      key: "Spec",
      width: "35%",
      render: (text: any, record: any) => {
        if (record.isLimitNode) return null;
        const line = record.line;
        const currentSpecId =
          editedLines[record.key]?.Selected_SpecId ?? line.Selected_SpecId;

        const applicableSpecs = allSpecs.filter((spec) => {
          const isApproved =
            (spec.Status || DocStatus.APPROVED) === DocStatus.APPROVED;
          const isSelected = spec.SpecId === currentSpecId;
          return (
            (isApproved || isSelected) &&
            spec.SpecItems?.some((si) => si.ItemCode === record.ItemCode)
          );
        });

        return (
          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Select
              value={currentSpecId || undefined}
              onChange={(val) => {
                setEditedLines((prev) => ({
                  ...prev,
                  [record.key]: {
                    Selected_SpecId: val || "",
                  },
                }));
              }}
              placeholder="Chọn tiêu chuẩn"
              style={{ flex: 1 }}
              allowClear
            >
              {applicableSpecs.map((spec) => (
                <Select.Option key={spec.SpecId} value={spec.SpecId}>
                  {spec.SpecCode}
                </Select.Option>
              ))}
            </Select>
            <Tooltip
              title={`Có ${applicableSpecs.length} tiêu chuẩn áp dụng cho vật tư này`}
            >
              <span
                style={{
                  fontSize: "10px",
                  background:
                    applicableSpecs.length > 0 ? PRIMARY_COLOR : "#d9d9d9",
                  color: "#ffffff",
                  borderRadius: "10px",
                  padding: "0 5px",
                  minWidth: "16px",
                  height: "16px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  flexShrink: 0,
                }}
              >
                {applicableSpecs.length}
              </span>
            </Tooltip>
          </div>
        );
      },
      onCell: (record: any) => {
        if (record.isLimitNode) return { colSpan: 0 };
        return {};
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      width: "15%",
      align: "center" as const,
      render: (text: any, record: any) => {
        if (record.isLimitNode) return null;
        const changes = editedLines[record.key];
        if (!changes)
          return (
            <span style={{ color: "#bfbfbf", fontSize: "12px" }}>Đã lưu</span>
          );

        return (
          <Space>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                const selectedSpecObj = allSpecs.find(
                  (s) => s.SpecId === changes.Selected_SpecId,
                );
                dispatch(
                  updateBomLine({
                    BomId: record.bomId,
                    BomLineId: record.key,
                    data: {
                      Selected_SpecId: changes.Selected_SpecId,
                      Selected_SpecCode: selectedSpecObj
                        ? selectedSpecObj.SpecCode
                        : "",
                    },
                  }),
                );
                setEditedLines((prev) => {
                  const copy = { ...prev };
                  delete copy[record.key];
                  return copy;
                });
                message.success(`Đã lưu thay đổi cho dòng ${record.ItemCode}!`);
              }}
            >
              Lưu
            </Button>
            <Button
              size="small"
              onClick={() => {
                setEditedLines((prev) => {
                  const copy = { ...prev };
                  delete copy[record.key];
                  return copy;
                });
              }}
            >
              Hủy
            </Button>
          </Space>
        );
      },
      onCell: (record: any) => {
        if (record.isLimitNode) return { colSpan: 0 };
        return {};
      },
    },
  ];

  const collapseItems = activeSelectedBom
    ? [
        {
          key: "parent",
          label: `Sản phẩm cha: ${activeSelectedBom.ItemCode}`,
          children: (
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="Mã sản phẩm">
                {activeSelectedBom.ItemCode}
              </Descriptions.Item>
              <Descriptions.Item label="Tên sản phẩm">
                {parentItem?.ItemName || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Đơn vị tính">
                {parentItem?.UoM || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Phân loại">
                {parentItem?.ItemType || "N/A"}
              </Descriptions.Item>
              {parentItem?.ItemType === "FG" && (
                <Descriptions.Item label="Hồ sơ tự công bố (HSCB Thành phẩm)">
                  <Space style={{ width: "100%" }}>
                    <Select
                      value={tempParentHscbId || undefined}
                      onChange={(val) => setTempParentHscbId(val || undefined)}
                      style={{ minWidth: "350px", flex: 1 }}
                      placeholder="Chưa chọn hồ sơ tự công bố"
                      allowClear
                    >
                      {parentHscbOptions.map((opt) => (
                        <Select.Option key={opt.value} value={opt.value}>
                          {opt.label}
                        </Select.Option>
                      ))}
                    </Select>
                    {tempParentHscbId !==
                      activeSelectedBom.Selected_HscbVersionId && (
                      <Button
                        type="primary"
                        onClick={() => {
                          dispatch(
                            updateParentHscb({
                              BomId: activeSelectedBom.BomId,
                              Selected_HscbVersionId: tempParentHscbId,
                            }),
                          );
                          message.success(
                            "Đã cập nhật hồ sơ tự công bố thành phẩm cha thành công!",
                          );
                        }}
                      >
                        Lưu
                      </Button>
                    )}
                  </Space>
                </Descriptions.Item>
              )}
            </Descriptions>
          ),
        },
        {
          key: "children",
          label: `Cấu trúc định mức BOM Item nhiều cấp`,
          children: (
            <Table
              dataSource={buildTableTreeData(activeSelectedBom.BomLines || [])}
              columns={treeColumns}
              pagination={false}
              bordered
              size="small"
              expandable={{
                defaultExpandAllRows: true,
              }}
            />
          ),
        },
      ]
    : [];

  return (
    <div>
      {/* Collapsible Filter Panel */}
      <Collapse
        defaultActiveKey={["filterPanel"]}
        style={{
          background: "#ffffff",
          borderRadius: "8px",
          marginBottom: "20px",
          border: "1px solid #f0f0f0",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
          overflow: "hidden",
        }}
      >
        <Collapse.Panel
          key="filterPanel"
          header={
            <span
              style={{
                color: PRIMARY_COLOR,
                fontWeight: "bold",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <MenuUnfoldOutlined
                style={{ marginRight: 8, fontSize: "14px" }}
              />
              Tìm kiếm và chức năng
            </span>
          }
          style={{ background: "#ffffff", border: "none" }}
        >
          <Row gutter={[16, 16]} align="bottom">
            <Col xs={24} sm={12} md={8} lg={8}>
              <div
                style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}
              >
                Mã BOM:
              </div>
              <Input
                placeholder="Tìm theo mã BOM..."
                value={tempBomId}
                onChange={(e) => setTempBomId(e.target.value)}
                onPressEnter={handleSearch}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={8}>
              <div
                style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}
              >
                Mã Sản Phẩm:
              </div>
              <Input
                placeholder="Tìm theo mã Sản phẩm..."
                value={tempItemCode}
                onChange={(e) => setTempItemCode(e.target.value)}
                onPressEnter={handleSearch}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={8}>
              <div
                style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}
              >
                HSCB Thành phẩm:
              </div>
              <Input
                placeholder="Tìm theo HSCB..."
                value={tempHscb}
                onChange={(e) => setTempHscb(e.target.value)}
                onPressEnter={handleSearch}
                allowClear
              />
            </Col>
            <Col xs={24} md={24} lg={24}>
              <Space size="middle" wrap style={{ width: "100%" }}>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  style={{
                    backgroundColor: PRIMARY_COLOR,
                    borderColor: PRIMARY_COLOR,
                  }}
                  onClick={handleSearch}
                >
                  Tìm kiếm
                </Button>
                <Button
                  type="default"
                  icon={<ReloadOutlined />}
                  onClick={handleReset}
                >
                  Reset
                </Button>
                <Button
                  type="primary"
                  icon={<FileExcelOutlined />}
                  style={{ background: "#107c41", borderColor: "#107c41" }}
                  onClick={() =>
                    message.info(
                      "Chức năng tải lên Excel đang được phát triển!",
                    )
                  }
                >
                  Upload Excel
                </Button>
              </Space>
            </Col>
          </Row>
        </Collapse.Panel>
      </Collapse>

      {/* 2. Load Table */}
      <BomTable
        dataSource={filteredBoms}
        allHscbs={allHscbs}
        onViewDetails={(record) => {
          setSelectedBom(record);
          setIsModalVisible(true);
          setEditedLines({});
        }}
      />

      {/* 3. Detail Collapse Modal */}
      <Modal
        title={
          <span
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: PRIMARY_COLOR,
            }}
          >
            Cấu Trúc BOM
          </span>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedBom(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setIsModalVisible(false);
              setSelectedBom(null);
            }}
          >
            Đóng
          </Button>,
        ]}
        width="95%"
      >
        {activeSelectedBom && (
          <Collapse
            defaultActiveKey={["parent", "children"]}
            items={collapseItems}
            style={{ marginTop: "15px" }}
          />
        )}
      </Modal>
    </div>
  );
};

export default BomList;
