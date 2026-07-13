import moment from "moment";
import React from "react";
import { Collapse, Column, Row } from "~/common";
import { StatusBadge } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { RESERVATION_STATUS_CONFIG } from "~/enums/reservation.enum";
import { useTheme } from "~/hooks/useTheme";
import { ReservationDetailData } from "~/services/reservation/reservation.type";

interface Props {
  data: ReservationDetailData;
}

export const ReservationDemandDetailGeneral = ({ data }: Props) => {
  const { colors } = useTheme();
  const isMaintenance = data.sourceType === "DichVu";

  return (
    <Collapse title="I. Thông tin chung" collapsible>
      <Column gap={12} align="stretch">
        <Row full gap={16}>
          <ColumnInfo
            label="Loại phiếu"
            value={
              data.sourceTypeName || (isMaintenance ? "Dịch vụ" : "Hàng hóa")
            }
          />
          <ColumnInfo
            label="Số phiếu"
            value={data.reservationNo || data.code}
          />
        </Row>

        <Row full gap={16}>
          <ColumnInfo label="Mã SAP" value={data.sapCode} />
          <ColumnInfo label="Mã công ty" value={data.companyLabel} />
        </Row>

        <ColumnInfo label="Nhà máy" value={data.plantLabel} />
        <ColumnInfo label="Bộ phận" value={data.departmentLabel} />

        <Row full gap={16}>
          <ColumnInfo label="Người yêu cầu" value={data.requisitionerLabel} />
          <ColumnInfo
            label="Ngày đặt chỗ vật tư"
            value={
              data.baseDate ? moment(data.baseDate).format("DD/MM/YYYY") : "---"
            }
          />
        </Row>

        <Row full gap={16}>
          <ColumnInfo label="GL Account" value={data.glAccountLabel} />
          <ColumnInfo label="Order" value={data.order} />
        </Row>

        <Row full gap={16}>
          <ColumnInfo
            label="Trạng thái"
            value={
              <StatusBadge
                value={
                  data.statusName ||
                  RESERVATION_STATUS_CONFIG[data.status as any]?.label
                }
                color={
                  data.statusColor ||
                  RESERVATION_STATUS_CONFIG[data.status as any]?.color
                }
                bgColor={
                  data.statusBgColor ||
                  RESERVATION_STATUS_CONFIG[data.status as any]?.bgColor
                }
                borderColor={
                  data.statusBorderColor ||
                  RESERVATION_STATUS_CONFIG[data.status as any]?.borderColor
                }
              />
            }
            last
          />
          <ColumnInfo label="Mục đích sử dụng" value={data.uses} />
        </Row>

        {isMaintenance && (
          <>
            <ColumnInfo label="Tên order" value={data.order_des} full />
            <Row full gap={16}>
              <ColumnInfo label="Loại order" value={data.orderType} />
              <ColumnInfo label="Thiết bị" value={data.equipmentName} />
            </Row>
            <ColumnInfo
              label="Settle Order (IO)"
              value={data.settle_order}
              full
            />
            <Row full gap={16}>
              <ColumnInfo
                label="Ngày yêu cầu"
                value={
                  data.req_d_start
                    ? `${moment(data.req_d_start).format("DD/MM/YYYY")} ${
                        data.req_h_start
                          ? moment(data.req_h_start).format("HH:mm")
                          : ""
                      }`
                    : "---"
                }
              />
            </Row>
            <ColumnInfo label="Lỗi" value={data.textItem} full />
            <ColumnInfo label="Nguyên nhân" value={data.textCauses} full />
            <ColumnInfo label="Xử lý" value={data.textActivities} full />
          </>
        )}

        <ColumnInfo
          label="Ngày tạo"
          value={
            data.createdAt ? moment(data.createdAt).format("DD/MM/YYYY") : "---"
          }
        />
        <ColumnInfo label="Ghi chú" value={data.description} last full />
      </Column>
    </Collapse>
  );
};
