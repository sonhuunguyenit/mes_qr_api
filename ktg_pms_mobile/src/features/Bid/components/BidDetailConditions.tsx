import React, { useMemo } from "react";
import { Collapse, Column, Row, Spacer, Table } from "~/common";
import { ColumnInfo } from "~/components/ColumnInfo";
import globalStyle from "~/styles/global-style";
import { useSheet } from "~/contexts/SheetContext";
import { BidConditionDetailSheet } from "../sheets/BidConditionDetailSheet";

interface BidDetailConditionsProps {
  data: any;
}

const formatNumber = (val: any) => {
  if (val === undefined || val === null || val === "") return "---";
  return Number(val).toLocaleString("en-US");
};

const flatConditions = (items: any[], level = 1): any[] => {
  let result: any[] = [];
  items.forEach((item) => {
    result.push({ ...item, level });
    if (item.__childs__ && item.__childs__.length > 0) {
      result = [...result, ...flatConditions(item.__childs__, level + 1)];
    }
  });
  return result;
};

export const BidDetailConditions = React.memo(
  ({ data }: BidDetailConditionsProps) => {
    const { openSheet, closeSheet } = useSheet();

    const techRows = useMemo(() => {
      return flatConditions(data?.listTech || []).map((item) => ({
        cells: [
          item.sort || "",
          { text: item.name, style: { paddingLeft: (item.level - 1) * 16 } },
          formatNumber(item.percent),
          formatNumber(item.percentRule),
          item.type || "---",
          item.isRequired ? "Bắt buộc" : "Không",
        ],
      }));
    }, [data]);

    const tradeRows = useMemo(() => {
      return flatConditions(data?.listTrade || []).map((item) => ({
        cells: [
          item.sort || "",
          { text: item.name, style: { paddingLeft: (item.level - 1) * 16 } },
          formatNumber(item.percent),
          formatNumber(item.percentRule),
          item.type || "---",
          item.isRequired ? "Bắt buộc" : "Không",
        ],
      }));
    }, [data]);

    const handleRowDoublePressTech = (index: number) => {
      const item = flatConditions(data?.listTech || [])[index];
      if (item) {
        openSheet(<BidConditionDetailSheet condition={item} />);
      }
    };

    const handleRowDoublePressTrade = (index: number) => {
      const item = flatConditions(data?.listTrade || [])[index];
      if (item) {
        openSheet(<BidConditionDetailSheet condition={item} />);
      }
    };

    return (
      <>
        <Collapse
          title="IV. Điều kiện kỹ thuật"
          collapsible
          containerStyle={globalStyle.collapseContainer}
        >
          <Table
            columns={[
              "STT",
              "Tên tiêu chí",
              "Tỉ trọng(%)",
              "Giá trị đạt",
              "Kiểu dữ liệu",
              "Bắt buộc?",
            ]}
            columnWidths={[50, 300, 100, 100, 100, 100]}
            horizontalScroll
            rows={techRows as any}
            onRowDoublePress={handleRowDoublePressTech}
          />
        </Collapse>

        <Spacer size={10} />

        <Collapse
          title="V. Điều kiện thương mại"
          collapsible
          containerStyle={globalStyle.collapseContainer}
        >
          <Column gap={12} align="stretch" padding={10}>
            <Row full gap={16}>
              <ColumnInfo
                label="Điều kiện thanh toán"
                value={
                  Array.isArray(data?.lstPaymentTermCode)
                    ? data.lstPaymentTermCode.join(", ")
                    : data?.lstPaymentTermCode
                }
              />
              <ColumnInfo
                label="Điều kiện thanh toán quy đổi"
                value={data?.paymentTermCode}
              />
            </Row>
            <Row full gap={16}>
              <ColumnInfo
                label="Phương thức vận chuyển"
                value={
                  Array.isArray(data?.lstIncotermCode)
                    ? data.lstIncotermCode.join(", ")
                    : data?.lstIncotermCode
                }
              />
              <ColumnInfo
                label="Incoterm Version"
                value={data?.incotermVersion}
              />
            </Row>
          </Column>
          <Table
            columns={[
              "STT",
              "Tên tiêu chí",
              "Tỉ trọng(%)",
              "Giá trị đạt",
              "Kiểu dữ liệu",
              "Bắt buộc?",
            ]}
            columnWidths={[50, 300, 100, 100, 100, 100]}
            horizontalScroll
            rows={tradeRows as any}
            onRowDoublePress={handleRowDoublePressTrade}
          />
        </Collapse>
      </>
    );
  },
);
