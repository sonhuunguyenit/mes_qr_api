---
description: Hướng dẫn chuyển đổi Logic từ Angular (Admin) sang React Native (Mobile) chuẩn Vibe Code
---

# 🔄 Workflow: Transform Angular to React Native

Quy trình chuẩn để chuyển đổi một tính năng từ hệ thống Web Admin (Angular) sang Mobile (React Native). Các quy tắc kiến trúc và UI chi tiết xem tại `.agent/skills/vibe_standard/SKILL.md`.

## 📋 Các bước thực hiện (Execution Steps)

1. **Phân tích Admin (Angular)**:
   - Mở `.component.ts` và `.html` của Admin.
   - Ghi lại các trường trong `whereCon` (lọc dự liệu) và cấu trúc Response (thường là Tuple).
   - Xác định danh sách các cột (Header bảng) cần hiển thị trên Mobile.

2. **Khởi tạo Feature Module theo Vibe Pattern**:
   - Tạo thư mục `src/features/[ModuleName]`.
   - Tạo các file `components/[ModuleName]Item.tsx`, `screens/[ModuleName].tsx`, `index.ts`.
   - Đăng ký Route trong `ROUTE_KEYS` và `navigate.ts`.

3. **Xây dựng Service & Types (Strong Typing)**:
   - Tạo `src/services/[module_name]/[module_name].service.ts` và `.type.ts`.
   - Định nghĩa Interface cho Request/Response. **KHÔNG DÙNG ANY**.
   - Viết hàm destructure Tuple response thành object `{ data, total, stats }`.

4. **Thiết kế UI Item (Data Density)**:
   - Dùng Badge cho các mã Code (SAP/PMS).
   - Sắp xếp các metadata quan trọng (Plant, Type, User) dạng Tag để tối ưu diện tích.
   - Hiển thị đầy đủ thông tin tiền tệ, số lượng như bảng trên Web.

5. **Tích hợp Filter BottomSheet**:
   - Tạo biểu tượng Search trên Header.
   - Mở BottomSheet chứa các trường lọc (SelectSheet, DatePicker, Input) theo đúng thứ tự logic của Web.

6. **Verify & Sync**:
   - Bật logger để so sánh body JSON gửi lên giữa Mobile và Web.
   - Kiểm tra số lượng bản ghi `total` và dữ liệu hiển thị phải khớp 100% với Web.

---

**QUY TẮC BẮT BUỘC**:

- Luôn sử dụng `useTheme` cho màu sắc và spacing.
- Không dùng Shadow cho Card/UI.
- Luôn dùng `goModuleNameDetail(item)` để điều hướng chi tiết.
