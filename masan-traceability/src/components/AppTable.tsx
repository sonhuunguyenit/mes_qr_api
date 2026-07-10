import React from "react";
import { Table, TableProps } from "antd";
import { PRIMARY_COLOR } from "../contants";

export interface AppTableProps<RecordType extends object = any> extends TableProps<RecordType> {
  grayHeader?: boolean;
}

export function AppTable<RecordType extends object = any>(
  props: AppTableProps<RecordType>,
) {
  const { style, className, grayHeader, ...restProps } = props;
  const uniqueClass = grayHeader ? "app-custom-table-gray" : "app-custom-table-brand";
  const headerBg = grayHeader ? "#f5f5f5" : PRIMARY_COLOR;
  const headerTextColor = grayHeader ? "#262626" : "#ffffff";

  return (
    <>
      <style>{`
        .${uniqueClass} .ant-table-thead > tr > th {
          background-color: ${headerBg} !important;
          color: ${headerTextColor} !important;
          white-space: nowrap !important;
          font-size: 13.5px !important;
        }
        .${uniqueClass} .ant-table-thead > tr > th,
        .${uniqueClass} .ant-table-thead > tr > th * {
          white-space: nowrap !important;
        }
        .${uniqueClass} .ant-table-thead > tr > th .ant-table-column-title {
          color: ${headerTextColor} !important;
          font-size: 13.5px !important;
        }
        .${uniqueClass} .ant-table-thead > tr > th .ant-table-column-sorter {
          color: ${headerTextColor} !important;
        }
        .${uniqueClass} .ant-table-thead > tr > th .ant-table-filter-trigger {
          color: ${headerTextColor} !important;
        }
      `}</style>
      <Table
        className={`${uniqueClass} ${className || ""}`}
        style={{
          background: "#ffffff",
          borderRadius: "8px",
          overflow: "hidden",
          ...style,
        }}
        {...restProps}
      />
    </>
  );
}

export default AppTable;
