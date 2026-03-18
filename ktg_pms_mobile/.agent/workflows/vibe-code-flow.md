---
description: Hướng dẫn tạo Module mới (Feature & Service) chuẩn Vibe Code (KTG PMS Mobile)
---

# Vibe Code Flow: Quy trình tạo Module mới

Quy trình này áp dụng khi cần thêm một tính năng mới (ví dụ: PO, Inventory) vào project Mobile, đảm bảo tính đồng nhất với module `PR` hiện tại.

## 1. Cấu trúc và Đặt tên (Naming)

- **Module Name**: Viết thường (vd: `po`, `inventory`).
- **Feature Layer**: `src/features/{{Module}}` (vd: `src/features/PO`).
- **Service Layer**: `src/services/{{module}}` (vd: `src/services/po`).
- **File Naming cho Service**:
  - File Service: `{{module}}.service.ts` (vd: `po.service.ts`).
  - File Types: `{{module}}.type.ts` (vd: `po.type.ts`).

## 2. Chi tiết triển khai

### Bước 1: Khởi tạo Service Layer (`src/services/{{module}}/`)

- **{{module}}.type.ts**: Định nghĩa Interface (Response, Request, ItemData). Map chính xác camelCase từ API Admin.
- **{{module}}.service.ts**:
  - Export `{{module}}Service` object.
  - Sử dụng `apiClient` từ `~/services/axios/client`.
  - Tên hàm camelCase: `get{{Module}}List`, `get{{Module}}Detail`, ...
  - **Lưu ý**: Hàm list phải hỗ trợ pagination gửi lên backend: `skip: (pageIndex - 1) * pageSize` và `take: pageSize`.
  - Kiểu trả về chuẩn: `Promise<ApiResponse<ApiPaginationResponse<{{Module}}ItemData>>>`.

### Bước 2: Khởi tạo Feature Layer (`src/features/{{Module}}/`)

- Tạo các thư mục con: `components/`, `hooks/`, `screens/`, `sheets/`, `tabs/`.
- **hooks/use{{Module}}.ts**:
  - **Sử dụng hook `useInfiniteScroll`** từ `~/hooks/useInfiniteScroll` để quản lý danh sách.
  - Truyền `queryKey` và `fetchPage` (gọi từ service).
- **components/{{Module}}Item.tsx**:
  - Dùng `Card` (common) làm khung.
  - Dùng `Badge` cho trạng thái ở hàng đầu. (Vibe: `label="Trạng thái" value={item.statusName} color={item.statusColor}`).
  - Dùng "Tag Cloud" (nhiều component `Tag` liên tiếp) để hiện metadata như Plant, Nhóm mua, Ngày tạo...

### Bước 3: Hoàn thiện Screen

- **screens/{{Module}}.tsx**:
  - UI bọc trong `Linear` -> `View` (căn chỉnh theo `insets.top`) -> `Container`.
  - Dùng `SearchBox` có filter button. `hasFilter` dựa trên state của bộ lọc.
  - `FlatList`:
    - `data` lấy từ hook `useInfiniteScroll`.
    - Implement `onEndReached` và `onRefresh`.
    - `ListEmptyComponent` dùng `Empty`.
    - `renderItem` trả về `{{Module}}Item`.

### Bước 4: Navigation & Route

- Đăng ký screen trong `src/navigation/` (nếu cần).
- Thêm key vào `src/constants/route.ts`.
- Thêm helper function điều hướng vào `src/utils/navigate.ts` (vd: `go{{Module}}`, `go{{Module}}Detail`).

## 3. Nguyên tắc "Vibe"

- Tuyệt đối không hardcode màu, dùng `useTheme()`.
- Tên biến, hàm luôn là **camelCase**.
- UI phải "Wow": Sử dụng đúng hệ thống component common (`Badge`, `Tag`, `Row`, `Spacer`, `Text`, `Linear`, `Empty`).
- Tham khảo module `PR` làm "Standard" về layout và spacing.
- Xử lý Number: Luôn dùng `toLocaleString('vi-VN')` khi hiển thị tiền tệ/số lượng.
