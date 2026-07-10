# Project Context & Rules — Masan QA Portal

## 1. Tổng quan & Tech Stack

Đây là ứng dụng **Masan QA Portal** — hệ thống quản lý chất lượng nội bộ (Enterprise Quality Management System). Ứng dụng được xây dựng bằng React + TypeScript + Vite, sử dụng Ant Design làm UI library và TanStack Query (React Query) làm data layer.

### Tech Stack

| Thành phần      | Công nghệ                                   |
| --------------- | ------------------------------------------- |
| Framework       | React 19 + TypeScript 6 + Vite 8            |
| UI Library      | Ant Design 6 + @ant-design/icons            |
| Data Fetching   | TanStack Query v5 (`@tanstack/react-query`) |
| Routing         | React Router DOM v7                         |
| Package Manager | Yarn 1.x / Bun                              |
| Linter          | Oxlint                                      |

---

## 2. Quy tắc phát triển (Project Rules)

1. **⚠️ TUYỆT ĐỐI KHÔNG TỰ Ý TẠO FEATURE MỚI:**
   Dự án được phân chia cố định theo các feature folder trong `src/features/`. Không tự ý tạo thêm các thư mục feature mới (như `shtt`, `barcode`, `sourcing`...). Mọi module/tính năng mới phải được map vào 1 trong các feature folder hiện tại:
   - `item`: Quản lý danh mục vật tư/sản phẩm (`MASTER_ITEM`), thông tin SHTT (`ShttList`), Hồ sơ công bố (`HscbList`).
   - `spec` (hoặc `specification`): Quản lý tiêu chuẩn kỹ thuật (`SpecList`), thông tin NCC/NSX (`SourcingDashboard`), Chứng từ NCC...
   - `bom`: Quản lý BOM mapping.

2. **Quy tắc CSS & Code:**
   - **Chỉ dùng default CSS của Ant Design** (thông qua `ConfigProvider` và inline style cơ bản) — không dùng Tailwind, không thêm CSS custom tùy biến.
   - **YAGNI:** Chỉ làm đúng và đủ theo yêu cầu — không tự ý thêm các phần popup, banner giải thích hoặc các nút hành động (Thêm/Sửa/Xóa) thừa nếu người dùng chưa yêu cầu rõ ràng.
   - **Cấu trúc trang danh mục (List Page):** Phía trên là bộ lọc (`Input`/`Select`), phía dưới là bảng dữ liệu (`<Table />`). Không sử dụng tính năng `copyable` trên cột Mã/ID trừ khi được yêu cầu.

3. **Quản lý dữ liệu và Types:**
   - **Types:** Luôn khai báo tập trung trong thư mục `types/index.ts` của từng feature. Import types từ chính module đó hoặc cross-module (như `../../item/types`). Không định nghĩa type trong files `services/`.
   - **local-data/:** Chỉ chứa dữ liệu mock/seed ban đầu. Import types trực tiếp từ các features tương ứng.
   - **Quy tắc hạn hiệu lực (Validity pattern):**
     - `ValidTo === null` nghĩa là đang hiệu lực.
     - `ValidTo !== null` nghĩa là đã hết hiệu lực.
     - Khi chọn khoảng ngày hiệu lực, sử dụng `DatePicker.RangePicker` và lưu thành 2 trường độc lập `ValidFrom` và `ValidTo`.

---

## 3. Cấu trúc thư mục dự án

```
/visual (root)
├── .agent/                        # Hướng dẫn và tài liệu dành cho AI agent
│   └── project-context.md         # File này (Context & Rules tổng hợp)
├── src/
│   ├── App.tsx                    # Root component: Layout + Routing + Sidebar menu
│   ├── main.tsx                   # Entry point (mount App + QueryClientProvider)
│   ├── local-data/                # Mock data (thay thế API call khi chưa có backend)
│   │   ├── item.ts                # Mock MASTER_ITEM
│   │   ├── hscb.ts                # Mock HSCB
│   │   ├── spec.ts                # Mock Specification
│   │   ├── bom.ts                 # Mock BOM
│   │   └── index.ts               # Re-export tập trung
│   └── features/                  # Các module nghiệp vụ (Feature-based)
│       ├── item/                  # Module Vật tư / Sản phẩm
│       ├── hscb/                  # Module Hồ sơ công bố sản phẩm (HSCB)
│       ├── spec/                  # Module Tiêu chuẩn kỹ thuật (TCCS/Spec)
│       └── bom/                   # Module Bill of Materials (BOM)
          # Mỗi module luôn có cấu trúc cố định gồm:
          ├── types/
          │   └── index.ts       # Định nghĩa tất cả interface/type/enum của module
          ├── components/        # Các sub-components độc lập
          │   └── BomTable.tsx   # Bảng hiển thị danh sách BOM
          ├── hooks/
          │   └── use{Entity}.ts # React Query hooks (useQuery, useMutation)
          ├── services/
          │   └── {entity}.service.ts
          ├── pages/
          │   └── {PageName}.tsx # React component giao diện chính
          └── index.ts           # Barrel export (export * từ pages, hooks, components, types)
```

---

## 4. Hướng dẫn Code nhanh Trang Danh Mục (List Page Template)

Dưới đây là khung code chuẩn để sao chép và điều chỉnh nhanh cho mọi trang danh mục của dự án:

```tsx
import React, { useState, useMemo } from "react";
import { Table, Card, Input, Select, Tag, Flex, Typography } from "antd";
import { DatabaseOutlined } from "@ant-design/icons";
import { useDataHook } from "../hooks/useDataHook"; // Import hook thực tế
import { EntityType, TypeEnum } from "../types"; // Import type thực tế

const { Title, Text } = Typography;

export const EntityList: React.FC = () => {
  // 1. KHAI BÁO CÁC STATE BỘ LỌC (Tương ứng với các cột cần lọc)
  const [prop1Filter, setProp1Filter] = useState(""); // Bộ lọc nhập chữ (Ví dụ: Mã)
  const [prop2Filter, setProp2Filter] = useState(""); // Bộ lọc nhập chữ (Ví dụ: Tên)
  const [prop3Filter, setProp3Filter] = useState("ALL"); // Bộ lọc dạng lựa chọn (Ví dụ: Loại)
  const [prop4Filter, setProp4Filter] = useState(""); // Bộ lọc nhập chữ (Ví dụ: Đơn vị)

  // 2. GỌI HOOK LẤY DỮ LIỆU TỪ REACT QUERY
  const { data: listData = [], isLoading, isFetching } = useDataHook();

  // 3. XỬ LÝ LỌC DỮ LIỆU DÙNG USEMEMO
  const filteredItems = useMemo(() => {
    return listData.filter((item) => {
      const matchProp1 = item.Prop1.toLowerCase().includes(
        prop1Filter.toLowerCase(),
      );
      const matchProp2 = item.Prop2.toLowerCase().includes(
        prop2Filter.toLowerCase(),
      );
      const matchProp3 = prop3Filter === "ALL" || item.Prop3 === prop3Filter;
      const matchProp4 = item.Prop4.toLowerCase().includes(
        prop4Filter.toLowerCase(),
      );

      return matchProp1 && matchProp2 && matchProp3 && matchProp4;
    });
  }, [listData, prop1Filter, prop2Filter, prop3Filter, prop4Filter]);

  // 4. ĐỊNH NGHĨA CÁC CỘT CỦA BẢNG (Không dùng copyable trên mã định danh)
  const columns = [
    {
      title: "Mã Định Danh",
      dataIndex: "Prop1",
      key: "Prop1",
      width: "20%",
      render: (text: string) => (
        <Text style={{ fontFamily: "monospace", fontWeight: "bold" }}>
          {text}
        </Text>
      ),
      sorter: (a: EntityType, b: EntityType) => a.Prop1.localeCompare(b.Prop1),
    },
    {
      title: "Tên Hiển Thị",
      dataIndex: "Prop2",
      key: "Prop2",
      width: "45%",
      sorter: (a: EntityType, b: EntityType) => a.Prop2.localeCompare(b.Prop2),
    },
    {
      title: "Phân Loại",
      dataIndex: "Prop3",
      key: "Prop3",
      width: "20%",
      render: (type: TypeEnum) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: "Thuộc tính khác",
      dataIndex: "Prop4",
      key: "Prop4",
      width: "15%",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* PHẦN TIÊU ĐỀ HỆ THỐNG */}
      <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
        <Flex align="center" gap={12}>
          <DatabaseOutlined style={{ fontSize: 24, color: "#1677ff" }} />
          <Title level={3} style={{ margin: 0 }}>
            Quản Lý Danh Mục (Tên Entity)
          </Title>
        </Flex>
      </Flex>

      {/* BỘ LỌC (SEARCH & FILTERS CARD) */}
      <Card
        style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)" }}
      >
        <Flex gap={16} wrap="wrap">
          <Input
            placeholder="Tìm theo Mã..."
            value={prop1Filter}
            onChange={(e) => setProp1Filter(e.target.value)}
            style={{ flex: 1, minWidth: 150, borderRadius: 6 }}
            allowClear
          />
          <Input
            placeholder="Tìm theo Tên..."
            value={prop2Filter}
            onChange={(e) => setProp2Filter(e.target.value)}
            style={{ flex: 2, minWidth: 200, borderRadius: 6 }}
            allowClear
          />
          <Select
            placeholder="Lọc theo phân loại"
            value={prop3Filter}
            onChange={(value) => setProp3Filter(value)}
            style={{ width: 180 }}
            options={[
              { value: "ALL", label: "Tất cả" },
              { value: "TYPE_A", label: "Loại A" },
              { value: "TYPE_B", label: "Loại B" },
            ]}
          />
          <Input
            placeholder="Tìm theo Thuộc tính..."
            value={prop4Filter}
            onChange={(e) => setProp4Filter(e.target.value)}
            style={{ width: 130, borderRadius: 6 }}
            allowClear
          />
        </Flex>
      </Card>

      {/* BẢNG HIỂN THỊ DỮ LIỆU (TABLE CARD) */}
      <Card
        style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)" }}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          columns={columns}
          dataSource={filteredItems}
          rowKey="Prop1"
          loading={isLoading || isFetching}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
            showTotal: (total) => `Tổng cộng ${total} bản ghi`,
          }}
          locale={{
            emptyText: "Không tìm thấy dữ liệu phù hợp",
          }}
        />
      </Card>
    </div>
  );
};
```

---

## 5. Senior Code Standards

Các quy tắc dưới đây không nhằm tối ưu cực đoan — mà để code **gọn, rõ, dễ đọc, dễ bảo trì**. Đây là tiêu chuẩn tối thiểu mỗi lần sinh code phải đáp ứng.

---

### 5.1 TypeScript — Dùng đúng, đủ

```ts
// ❌ BAD — any làm mất hết điểm TypeScript
const handleChange = (value: any) => { ... }
const columns: any[] = [...]

// ✅ GOOD — type rõ ràng, cụ thể
const handleChange = (value: string) => { ... }
const columns: ColumnType<Item>[] = [...]
```

**Nguyên tắc:**

- Không dùng `any`. Nếu chưa biết type thì dùng `unknown` + type guard.
- Không định nghĩa `interface` trong file service hay component — luôn khai báo trong `types/index.ts`.
- Props của component con: khai báo `interface Props` ngay trên component, trong cùng file `.tsx`.
- **Tránh render trực tiếp đối tượng `Date`:** TypeScript sẽ báo lỗi biên dịch `Type 'Date' is not assignable to type 'ReactNode'` nếu render trực tiếp các thuộc tính ngày tháng có kiểu dữ liệu là `Date | string` (ví dụ: `ValidFrom`, `ValidTo`). Luôn luôn chuẩn hóa sang dạng chuỗi an toàn bằng hàm helper sử dụng `dayjs` (ví dụ: `dayjs(d).format("YYYY-MM-DD")`) trước khi đưa vào JSX.

---

### 5.2 Naming — Tên tự giải thích, không cần comment

```ts
// ❌ BAD
const d = useItems();
const fn = () => { ... }
const arr = items.filter(i => i.t === 'FG');

// ✅ GOOD
const { data: items } = useItems();
const handleAddSpec = () => { ... }
const finishedGoods = items.filter(item => item.ItemType === 'FG');
```

**Convention cố định:**

- **Hook:** `use` + noun → `useItems`, `useCreateSpec`
- **Event handler:** `handle` + verb → `handleSubmit`, `handleRowClick`
- **Boolean:** `is/has/can` → `isLoading`, `hasError`, `canEdit`
- **Component:** PascalCase, đủ ngữ cảnh → `ItemList`, `SpecDetailDrawer`

---

### 5.3 Component — Nhỏ, một nhiệm vụ

```tsx
// ❌ BAD — 500 dòng làm tất cả: filter, table, drawer, modal, form, submit
export const SpecList = () => { ... }

// ✅ GOOD — tách sub-component khi JSX lồng sâu hoặc có state/logic riêng
export const SpecList = () => (
  <>
    <SpecFilterBar filters={filters} onChange={setFilters} />
    <SpecTable data={filteredData} loading={isLoading} />
    {selected && <SpecDetailDrawer spec={selected} onClose={clear} />}
  </>
);
```

**Khi nào tách:**

- JSX block lặp lại > 1 lần → extract.
- Một khối có state riêng (drawer, modal, form) → extract, truyền props rõ ràng.
- Component vượt ~150 dòng → cân nhắc tách.

---

### 5.4 React Query — Đúng pattern

```ts
// ❌ BAD — fetch trong useEffect, không có cache, không có loading state
useEffect(() => {
  fetch('/api/items').then(r => r.json()).then(setItems);
}, []);

// ✅ GOOD
const { data: items = [], isLoading } = useItems();

// ❌ BAD — mutation không invalidate → UI không tự cập nhật
useMutation({ mutationFn: createSpec });

// ✅ GOOD
useMutation({
  mutationFn: createSpec,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['specs'] }),
  onError: (err) => message.error(err.message),
});

// ❌ BAD — data có thể undefined → crash khi render
const { data } = useItems();
return <Table dataSource={data} />;

// ✅ GOOD — luôn có default value
const { data: items = [] } = useItems();
```

---

### 5.5 Tách logic ra khỏi JSX

```tsx
// ❌ BAD — logic lộn xộn trong JSX, khó đọc
return (
  <Tag
    color={
      record.ValidTo === null
        ? "green"
        : dayjs(record.ValidTo).isAfter(dayjs())
          ? "orange"
          : "red"
    }
  >
    {record.ValidTo === null
      ? "Hiệu lực"
      : dayjs(record.ValidTo).isAfter(dayjs())
        ? "Sắp hết"
        : "Hết hạn"}
  </Tag>
);

// ✅ GOOD — extract helper function bên ngoài component
const getValidityTag = (validTo: string | null) => {
  if (validTo === null) return { label: "Đang hiệu lực", color: "success" };
  if (dayjs(validTo).isAfter(dayjs()))
    return { label: "Sắp hết hạn", color: "warning" };
  return { label: "Hết hiệu lực", color: "error" };
};

// Trong columns:
render: (validTo: string | null) => {
  const { label, color } = getValidityTag(validTo);
  return <Tag color={color}>{label}</Tag>;
};
```

**Nguyên tắc:**

- Logic tính toán (status, format, transform) → pure function **bên ngoài** component.
- `useMemo` chỉ cho tính toán nặng (filter/sort mảng lớn). Không wrap mọi thứ.
- Không viết logic nhiều dòng trực tiếp vào `onClick={() => { ... }}` → extract `handleXxx`.

---

### 5.6 Anti-patterns cần tránh

| Anti-pattern                            | Vấn đề                | Thay bằng                              |
| --------------------------------------- | --------------------- | -------------------------------------- |
| `any`                                   | Mất type safety       | `unknown` + guard, hoặc type đúng      |
| Nested ternary                          | Không ai đọc được     | `if/else` hoặc helper function         |
| `console.log` sót lại                   | Dirty code            | Xóa trước khi done                     |
| Comment giải thích **cái gì**           | Noise                 | Chỉ comment khi giải thích **tại sao** |
| `useEffect` để sync state từ state khác | Bugs, vòng lặp        | `useMemo` hoặc tính inline             |
| Magic string inline                     | Khó maintain          | Dùng enum/type đã định nghĩa           |
| `import * as X`                         | Khó trace, bundle lớn | `import { X }` cụ thể                  |

```ts
// ❌ BAD — magic string
if (item.ItemType === 'FG') { ... }

// ✅ GOOD — dùng type đã định nghĩa
import type { ItemType } from '../types';
if (item.ItemType === 'FG' satisfies ItemType) { ... }
// hoặc nếu là enum:
if (item.ItemType === ItemType.FG) { ... }
```

---

### 5.7 Thứ tự khai báo chuẩn trong file `.tsx`

```tsx
// 1. Imports: external lib → internal modules → types
import React, { useState, useMemo } from 'react';
import { Table, Card } from 'antd';
import { useItems } from '../hooks/useItem';
import type { Item } from '../types';

// 2. Constants (không phụ thuộc state, khai báo ngoài component)
const PAGE_SIZE_OPTIONS = ['10', '20', '50'];

// 3. Pure helper functions
const getValidityTag = (validTo: string | null) => { ... };

// 4. Props interface (nếu là sub-component)
interface SpecDrawerProps {
  spec: Specification;
  onClose: () => void;
}

// 5. Component
export const ItemList: React.FC = () => {
  // 5a. Hooks theo thứ tự phụ thuộc
  const [filter, setFilter] = useState('');
  const { data: items = [], isLoading } = useItems();
  const filteredItems = useMemo(() => { ... }, [items, filter]);

  // 5b. Event handlers
  const handleFilterChange = (value: string) => setFilter(value);

  // 5c. Column definitions (khai báo gần return)
  const columns: ColumnType<Item>[] = [ ... ];

  // 5d. JSX
  return ( ... );
};
```
