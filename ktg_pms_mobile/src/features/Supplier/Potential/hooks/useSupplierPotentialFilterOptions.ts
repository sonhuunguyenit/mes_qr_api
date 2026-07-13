import { useQuery } from "@tanstack/react-query";
import { supplierPotentialService } from "~/services/supplier/supplier-potential.service";
import { supplierService } from "~/services/supplier/supplier.service";
import { prService } from "~/services/pr/pr.service";

/**
 * Hook lấy các tùy chọn cho bộ lọc Nhà cung cấp tiềm năng (Potential Supplier).
 * Tham khảo logic từ usePRFilterOptions.
 */
export const useSupplierPotentialFilterOptions = () => {
  return useQuery({
    queryKey: ["supplier-potential-filter-options"],
    queryFn: async () => {
      // Gọi song song các API cần thiết cho filter
      const [businessTypeRes, companyRes, purchaseGroupRes] = await Promise.allSettled([
        supplierPotentialService.getBusinessTypes(),
        supplierService.getCompanies(),
        prService.getPurchaseGroups(),
      ]);

      const getArray = (res: any) => {
        const body = res.status === "fulfilled" ? (res.value?.data ?? res.value) : [];
        return Array.isArray(body) ? body : body?.data || [];
      };

      const formatLabel = (item: any) => {
        const { code, name } = item;
        return code && name && code !== name ? `${code} - ${name}` : name || code;
      };

      return {
        // Loại hình doanh nghiệp
        businessTypes: getArray(businessTypeRes).map((item: any) => ({
          label: item.name || item.code,
          value: item.name, // Thường filter theo tên cho search text
        })),
        // Danh sách công ty (Company Code)
        companies: getArray(companyRes).map((item: any) => ({
          label: formatLabel(item),
          value: item.code,
        })),
        // Nhóm mua (Purchasing Group)
        purchaseGroups: getArray(purchaseGroupRes).map((item: any) => ({
          label: formatLabel(item),
          value: item.name,
        })),
        // Trạng thái SAP (Hardcode theo enum nếu không có API riêng)
        sapStatuses: [
          { label: "Mới tạo", value: "NEW" },
          { label: "Đang duyệt", value: "PENDING" },
          { label: "Đã duyệt", value: "APPROVED" },
          { label: "Kiểm tra lại", value: "RECHECK" },
          { label: "Chưa được nhập liệu", value: "DEFAULT" },
        ],
        // Xếp loại NCC
        supplierGrades: [
          { label: "Nhà cung cấp tiềm năng", value: "Nhà cung cấp tiềm năng" },
          { label: "Nhà cung cấp chính thức", value: "Nhà cung cấp chính thức" },
        ],
      };
    },
  });
};
