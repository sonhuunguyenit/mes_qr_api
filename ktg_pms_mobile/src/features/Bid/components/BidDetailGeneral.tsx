import React, { useMemo } from "react";
import { Badge } from "~/components/Badge";
import { ColumnInfo } from "~/components/ColumnInfo";
import { Collapse, Column, Row, Table, Text } from "~/common";
import { RowTable } from "~/common/Table";
import { useTheme } from "~/hooks/useTheme";
import DateHelper from "~/utils/date";

interface BidDetailGeneralProps {
  data: any;
}

const formatNumber = (val: any) => {
  if (val === undefined || val === null || val === "") return "---";
  return Number(val).toLocaleString("en-US");
};

export const BidDetailGeneral = React.memo(
  ({ data }: BidDetailGeneralProps) => {
    const { colors } = useTheme();

    const releaseRows = useMemo(() => {
      const rows: RowTable[] = [];
      (data?.lstApprovalProgress || []).forEach((row: any) => {
        rows.push({
          cells: [
            { text: row.level, style: { fontWeight: "bold" } },
            "",
            "",
            "",
            "",
            "",
          ],
        });
        row.lstApprove.forEach((item: any) => {
          rows.push({
            cells: [
              "",
              item.tile,
              item.employeeName,
              item.status,
              DateHelper.formatDate(
                item.createdAt || item.updatedAt,
                "DD/MM/YYYY HH:mm",
              ),
              item.comment || "---",
            ],
          });
        });
      });
      return rows;
    }, [data]);

    return (
      <Collapse title="I. Thông tin chung" collapsible>
        <Column gap={12} align="stretch">
          <Row full gap={16}>
            <ColumnInfo label="Mã gói thầu" value={data?.code} />
            <ColumnInfo label="Tiêu đề gói thầu" value={data?.name} />
          </Row>
          <ColumnInfo label="Tiêu đề tiếng Anh" value={data?.nameEnglish} />
          <ColumnInfo
            label="Trạng thái"
            value={
              <Badge
                label="Trạng thái"
                value={data?.statusName || data?.status}
                color={data?.statusColor || colors.active}
                backgroundColor={data?.statusBgColor}
              />
            }
            last
          />
          <ColumnInfo label="Công ty mời thầu" value={data?.company} />
          <ColumnInfo label="Plant" value={data?.plant} />
          <ColumnInfo label="Tổ chức mua hàng" value={data?.purchasingOrgT} />
          <ColumnInfo label="Nhóm mua hàng" value={data?.purchasingGroupT} />
          <ColumnInfo label="Mục đích đấu thầu" value={data?.purposeName} />
          <ColumnInfo label="Hình thức đấu thầu" value={data?.bidTypeName} />
          <ColumnInfo
            label="Phạm vi gói thầu"
            value={data?.scopeBiddingPackage}
            full
          />
          <ColumnInfo
            label="Địa điểm thực thi"
            value={data?.locationBidExecution}
          />
          <ColumnInfo label="Dự án" value={data?.projectT} />
          <ColumnInfo
            label="File Hồ sơ mời thầu"
            value={
              data?.lstMediaFileBid?.length > 0
                ? data.lstMediaFileBid
                    .map((f: any, i: number) => f.fileName || `File ${i + 1}`)
                    .join(", ")
                : "---"
            }
            full
          />
          <ColumnInfo
            label="File đính kèm khác"
            value={
              data?.lstMediaFileBidOther?.length > 0
                ? data.lstMediaFileBidOther
                    .map((f: any, i: number) => f.fileName || `File ${i + 1}`)
                    .join(", ")
                : "---"
            }
            full
          />
          <ColumnInfo
            label="Các thành viên HĐ xét thầu"
            value={data?.lstBidMemberName}
            full
          />
          <Row full gap={16}>
            <ColumnInfo
              label="Gộp HĐ chấm thầu?"
              value={data?.isMergeBidCouncel ? "Có" : "Không"}
            />
            <ColumnInfo label="Phụ trách kỹ thuật" value={data?.techName} />
          </Row>

          {data?.isMergeBidCouncel === false ? (
            <>
              <Row full gap={16}>
                <ColumnInfo
                  label="HĐ chấm thầu kỹ thuật"
                  value={data?.lstTechnicalCommitteeName}
                />
                <ColumnInfo
                  label="Phụ trách thương mại"
                  value={data?.tradeName}
                />
              </Row>
              <Row full gap={16}>
                <ColumnInfo
                  label="HĐ chấm thầu thương mại"
                  value={data?.lstTradeCommitteeName}
                />
                <ColumnInfo label="Hội đồng chấm thầu" value={""} />
              </Row>
            </>
          ) : (
            <>
              <Row full gap={16}>
                <ColumnInfo
                  label="Phụ trách thương mại"
                  value={data?.tradeName}
                />
                <ColumnInfo
                  label="Hội đồng chấm thầu"
                  value={data?.lstMemmberAllName}
                />
              </Row>
            </>
          )}

          <Row full gap={16}>
            <ColumnInfo
              label="Hạn thiết lập yêu cầu KT"
              value={DateHelper.formatDate(
                data?.timeTechDate,
                "DD/MM/YYYY HH:mm",
              )}
            />
            <ColumnInfo
              label="Hạn thiết lập yêu cầu TM"
              value={DateHelper.formatDate(
                data?.timePriceDate,
                "DD/MM/YYYY HH:mm",
              )}
            />
          </Row>
          <Row full gap={16}>
            <ColumnInfo
              label="Hạn xác nhận tham gia"
              value={DateHelper.formatDate(
                data?.acceptEndDate,
                "DD/MM/YYYY HH:mm",
              )}
            />
            <ColumnInfo
              label="Hạn nộp hồ sơ thầu"
              value={DateHelper.formatDate(
                data?.submitEndDate,
                "DD/MM/YYYY HH:mm",
              )}
            />
          </Row>
          <Row full gap={16}>
            <ColumnInfo
              label="Mở thầu dự kiến"
              value={DateHelper.formatDate(
                data?.estimatedBidOpeningDate,
                "DD/MM/YYYY HH:mm",
              )}
            />
            <ColumnInfo
              label="Đánh giá yêu cầu KT"
              value={DateHelper.formatDate(
                data?.timeCheckTechDate,
                "DD/MM/YYYY HH:mm",
              )}
            />
          </Row>
          <Row full gap={16}>
            <ColumnInfo
              label="Đánh giá yêu cầu TM"
              value={DateHelper.formatDate(
                data?.timeCheckPriceDate,
                "DD/MM/YYYY HH:mm",
              )}
            />
            <ColumnInfo
              label="Đóng thầu dự kiến"
              value={DateHelper.formatDate(
                data?.estimatedBidClosedDate,
                "DD/MM/YYYY HH:mm",
              )}
            />
          </Row>
          <Row full gap={16}>
            <ColumnInfo
              label="Hình thức Hợp đồng"
              value={data?.formContractName}
            />
            <ColumnInfo
              label="Hiệu lực HĐ (tháng)"
              value={data?.timeserving?.toString()}
            />
          </Row>
          <Row full gap={16}>
            <ColumnInfo
              label="Hình thức bảo lãnh"
              value={data?.bidGuaranteeName}
            />
            <ColumnInfo
              label="Số tiền bảo lãnh (VNĐ)"
              value={formatNumber(data?.moneyGuarantee)}
            />
          </Row>
          <Row full gap={16}>
            <ColumnInfo
              label="Hạn bảo lãnh (tháng)"
              value={data?.timeGuarantee?.toString()}
            />
            <ColumnInfo
              label="Tỷ trọng điểm kỹ thuật"
              value={formatNumber(data?.techPrecent)}
            />
          </Row>
          <Row full gap={16}>
            <ColumnInfo
              label="Tỷ trọng điểm bảng giá"
              value={formatNumber(data?.pricePrecent)}
            />
            <ColumnInfo
              label="Tỷ trọng điểm ĐKTM"
              value={formatNumber(data?.tradePrecent)}
            />
          </Row>

          <Text bold size={13} color={colors.label} style={{ marginBottom: 4 }}>
            Release
          </Text>
          <Table
            columns={[
              "Cấp duyệt",
              "Vị trí / nhân viên duyệt",
              "Người duyệt (Nếu có)",
              "Trạng thái duyệt",
              "Ngày duyệt",
              "Ghi chú người duyệt",
            ]}
            columnWidths={[80, 200, 200, 150, 150, 200]}
            horizontalScroll
            rows={releaseRows as any}
            pagination={{ enabled: false }}
          />
        </Column>
      </Collapse>
    );
  },
);
