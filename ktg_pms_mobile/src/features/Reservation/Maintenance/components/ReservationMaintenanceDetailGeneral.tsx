import moment from "moment";
import React from "react";
import { StyleSheet } from "react-native";
import { Column, Row } from "~/common";
import { StatusBadge } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { RESERVATION_STATUS_CONFIG } from "~/enums/reservation.enum";
import { ReservationDetailData } from "~/services/reservation/reservation.type";

interface Props {
  data: ReservationDetailData;
}

export const ReservationMaintenanceDetailGeneral = ({ data }: Props) => {
  return (
    <Column gap={12} align="stretch" style={{ padding: 12 }}>
      <ColumnInfo label="Mã" value={data.code} />
      <ColumnInfo label="Mã PM" value={data.order_id || "---"} />
      <ColumnInfo
        label="Công ty"
        value={data.companyLabel || data.companyName}
      />

      <ColumnInfo label="Plant" value={data.plantLabel || data.plantName} />
      <ColumnInfo
        label="Trạng thái"
        value={
          <StatusBadge
            value={
              data.statusName ||
              (data.status && typeof RESERVATION_STATUS_CONFIG !== "undefined"
                ? RESERVATION_STATUS_CONFIG[data.status as any]?.label
                : "") ||
              "---"
            }
            color={
              data.statusColor ||
              (data.status && typeof RESERVATION_STATUS_CONFIG !== "undefined"
                ? RESERVATION_STATUS_CONFIG[data.status as any]?.color
                : undefined)
            }
            bgColor={
              data.statusBgColor ||
              (data.status && typeof RESERVATION_STATUS_CONFIG !== "undefined"
                ? RESERVATION_STATUS_CONFIG[data.status as any]?.bgColor
                : undefined)
            }
            borderColor={
              data.statusBorderColor ||
              (data.status && typeof RESERVATION_STATUS_CONFIG !== "undefined"
                ? RESERVATION_STATUS_CONFIG[data.status as any]?.borderColor
                : undefined)
            }
          />
        }
        last
      />

      <Row full gap={16}>
        <ColumnInfo
          label="Ngày tạo"
          value={
            data.createdAt
              ? moment(data.createdAt).format("DD/MM/YYYY HH:mm")
              : "---"
          }
        />
        <ColumnInfo
          label="Ngày lập phiếu"
          value={
            data.notiDate ? moment(data.notiDate).format("DD/MM/YYYY") : "---"
          }
        />
      </Row>

      <Row full gap={16}>
        <ColumnInfo label="Tên order" value={data.order_des || "---"} />
        <ColumnInfo label="Loại order" value={data.orderType || "---"} />
      </Row>

      <ColumnInfo label="Thiết bị" value={data.equipmentName || "---"} full />

      <ColumnInfo
        label="Người tạo "
        value={data.employeeName || data.createdByName || "---"}
      />
      <ColumnInfo
        label="Phòng ban "
        value={
          (data as any).depamnetName ||
          data.departmentLabel ||
          data.departmentName ||
          "---"
        }
      />

      <ColumnInfo
        label="Settle Order (IO)"
        value={data.settle_order || "---"}
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
        <ColumnInfo
          label="Ngày yêu cầu kết thúc"
          value={
            data.req_d_end
              ? `${moment(data.req_d_end).format("DD/MM/YYYY")} ${
                  data.req_h_end ? moment(data.req_h_end).format("HH:mm") : ""
                }`
              : "---"
          }
        />
      </Row>

      <ColumnInfo
        label="Ngày bắt đầu sự cố"
        value={
          data.mal_d_start
            ? `${moment(data.mal_d_start).format("DD/MM/YYYY")} ${
                data.mal_h_start ? moment(data.mal_h_start).format("HH:mm") : ""
              }`
            : "---"
        }
        full
      />

      <ColumnInfo label="Lỗi" value={data.textItem || "---"} full />
      <ColumnInfo label="Nguyên nhân" value={data.textCauses || "---"} full />
      <ColumnInfo label="Xử lý" value={data.textActivities || "---"} full />
      <ColumnInfo label="Mô tả" value={data.description || "---"} last full />
    </Column>
  );
};

const styles = StyleSheet.create({});

export default ReservationMaintenanceDetailGeneral;
