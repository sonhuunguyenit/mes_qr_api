---
name: Vibe Development Standard
description: Core philosophy, architectural patterns, and UI guidelines for KTG PMS Mobile (React Native) based on Vibe Code.
---

# 🚀 Vibe Development Standard (KTG PMS)

Tài liệu này là **Single Source of Truth** tập hợp tất cả các quy tắc, tầm nhìn và kiến trúc để phát triển hệ thống KTG PMS Mobile. AI và Developer phải tuân thủ tuyệt đối các hướng dẫn này để đảm bảo tính đồng nhất giữa Angular Admin và React Native.

---

## 🏔️ 1. Tầm nhìn & Sứ mệnh (Transformation Mission)

Hệ thống Mobile là phiên bản "di động hóa" hoàn chỉnh của Admin.

- **Logic Parity**: Bộ lọc (Filters) và Quy trình duyệt (Approval Flow) phải khớp 100% với Admin.
- **Data Density**: Hiển thị mật độ thông tin cao (nhiều cột từ Web) tinh tế trên Mobile.
- **Source of Truth**: Luôn đối chiếu `ktg_pms_admin` (Angular) để tìm logic `whereCon`, mapping API và EnumData.

---

## 🎨 2. Nguyên tắc Thiết kế (UI & Aesthetics)

Xây dựng giao diện "Premium & Clean" thông qua Typography và Spacing, không lạm dụng hiệu ứng.

### Quy tắc Đổ bóng (Shadow Rules)

- **Flat Design First**: Ưu tiên thiết kế phẳng. Chỉ dùng border (`borderWidth: 1` hoặc `hairlineWidth`) và màu nền nhẹ để phân tách.
- **No Default Shadows**: Tuyệt đối **KHÔNG** dùng `shadow` hoặc `elevation` cho Card, SearchBox trừ khi có yêu cầu đặc biệt.

### Component Guidelines

- **SearchBar**: Có border rõ ràng, không dùng shadow. Background dùng `colors.card`.
- **Cards/Items**: Dùng `colors.border` thay cho shadow. Radius theo `radius.card`.
- **Typography**: Sử dụng `useTheme` hook. Cấm hardcode màu sắc (`#FFF`, `#000`) trực tiếp trong styles.

---

## 🏗️ 3. Kiến trúc Feature (Vibe Code Pattern)

Mỗi module trong `src/features/` (ví dụ: `PR`, `PO`) phải tuân thủ:

### Cấu trúc Thư mục

```text
ModuleName
├── components              # UI components dùng riêng (e.g., PRItem.tsx, PRFilterSheet.tsx)
├── screens                 # Screens (e.g., PR.tsx, PRDetail.tsx)
├── index.ts                # Nested export (export { ModuleName, ModuleNameDetail })
└── ModuleName.md           # Ghi chú logic đặc thù (Vibe logic) của module
```

### Quy tắc đặt tên

- **PascalCase**: ModuleName, FileName (PRItem, PRDetail).
- **Export**: Chỉ export thông qua `index.ts`.

### Navigation Pattern

- **KHÔNG** dùng trực tiếp `navigation.navigate()`.
- **PHẢI** dùng helper trong `src/utils/navigate.ts` (e.g., `goPR()`, `goPRDetail(item)`).
- **Type Safety**: Khai báo params trong `navigation.type.ts` cho mọi màn hình Detail.

---

## 🔌 4. Service & API (Strong Typing)

Tất cả logic gọi API nằm tại `src/services/[module_name]/`.

- **Cấm dùng `any`**: Mọi tham số, props và response phải có Interface rõ ràng.
- **Tuple Response**: Hệ thống KTG trả về `[Data[], Number, Stats{}]`. Phải destructure ngay trong Service sang Object sạch `{ data, total, stats }`.
- **Enum Management**: Tuyệt đối không hardcode Status/Type. Dùng `src/enums/[module].enum.ts`.

### React Hooks (Safety Pattern)

- **useEffect Dependencies**: Tuyệt đối **KHÔNG** đưa function vào mảng dependency của `useEffect`. Nếu cần dùng function trong effect, hãy định nghĩa function đó bên trong effect hoặc sử dụng mảng phụ thuộc là các giá trị nguyên thủy (primitive values). Điều này giúp tránh vòng lặp render vô tận và lỗi logic khó debug.

---

## 🔄 5. Workflow Chuyển đổi (Logic Mapping)

Khi chuyển đổi một chức năng từ Admin sang:

1. **Soi Admin**: Check file `.component.ts` và `.html` để tìm logic mapping `whereCon`.
2. **Xây Service**: Viết hàm mapping biến UI sang cấu trúc `where` Backend yêu cầu.
3. **Design Item**: Dùng mảng Badge/Icon để nén nhiều cột bảng Web vào 1 Card Mobile (Data Density).
4. **Filter Sheet**: Dùng `BottomSheet` với các trường lọc sắp xếp đúng thứ tự cột của Web.

---

**LƯU Ý QUAN TRỌNG CHO AI**: Khi thực hiện task mới, hãy luôn đọc file `SKILL.md` này đầu tiên để nắm bắt các quy tắc "bất di bất dịch" của dự án.
