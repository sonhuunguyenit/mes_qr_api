# API Transformation Notes

## 📡 API Response Structure

- **Tất cả các API (Pagination/Find/Detail)**: Luôn trả về dữ liệu trực tiếp trong `response.data`.
- **KHÔNG sử dụng** `response.data?.response`. Kết quả trả về từ `apiClient` đã được xác định là dữ liệu thô (raw data) hoặc tuple `[data, total]`.

### Ví dụ Service chuẩn:

```typescript
getInvoiceList: async (params: InvoiceFilterParams): Promise<[InvoiceItem[], number]> => {
  // ... xử lý filters
  const response = await apiClient.post<any>(ENDPOINTS.PAGINATION, body);
  return response.data; // Trả về trực tiếp data
},
```

### Ví dụ Hook chuẩn:

```typescript
export const useInvoiceList = (params: InvoiceFilterParams) => {
  return useQuery({
    queryKey: ["invoice-list", params],
    queryFn: () => invoiceService.getInvoiceList(params),
    select: (res) => {
      const [data, total] = res || [[], 0];
      return { data, total };
    },
  });
};
```
