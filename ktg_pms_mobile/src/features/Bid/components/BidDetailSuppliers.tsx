import React, { useMemo } from "react";
import { Collapse, Table } from "~/common";
import globalStyle from "~/styles/global-style";
import { useSheet } from "~/contexts/SheetContext";
import { BidSupplierDetailSheet } from "../sheets/BidSupplierDetailSheet";

interface BidDetailSuppliersProps {
  data: any;
}

export const BidDetailSuppliers = React.memo(
  ({ data }: BidDetailSuppliersProps) => {
    const { openSheet, closeSheet } = useSheet();

    const supplierRows = useMemo(() => {
      return (data?.lstSupplier || []).map((item: any, index: number) => ({
        cells: [
          item.supplierSapCode || "---",
          item.supplierCode || "---",
          item.supplierName || "---",
          item.supplierAddress || "---",
          item.businessCategoryName || "---",
        ],
      }));
    }, [data?.lstSupplier]);

    const handleRowDoublePress = (index: number) => {
      const supplier = data?.lstSupplier?.[index];
      if (supplier) {
        openSheet(<BidSupplierDetailSheet supplier={supplier} />);
      }
    };

    return (
      <Collapse
        title="III. Nhà cung cấp"
        collapsible
        containerStyle={globalStyle.collapseContainer}
      >
        <Table
          columns={[
            "Mã SAP NCC",
            "Mã số NCC",
            "Nhà cung cấp",
            "Địa chỉ",
            "Lĩnh vực kinh doanh",
          ]}
          columnWidths={[120, 120, 250, 300, 200]}
          horizontalScroll
          rows={supplierRows as any}
          onRowDoublePress={handleRowDoublePress}
        />
      </Collapse>
    );
  },
);
