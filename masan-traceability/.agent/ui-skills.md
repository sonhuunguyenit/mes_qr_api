# UI Design Patterns & Development Guidelines (UI Skills)

This document outlines the standard UI/UX patterns and design systems extracted from the `/partner` and `/item` modules to ensure design consistency across all pages and features in this system.

---

## 1. Page Header Layout

Page headers should feature a clean title on the left and primary action buttons (e.g. Syncing, Creating) on the right, using Ant Design's grid system.

```tsx
<Row justify="space-between" align="middle" style={{ marginBottom: "20px" }}>
  <Col>
    <h2 style={{ margin: 0 }}>
      {/* Title format: "Index. Title Name" */}
      0. Danh mục Vật tư / Sản phẩm (MASTER_ITEM)
    </h2>
    {/* Optional subtitle / description */}
    <p style={{ color: "#888", margin: "4px 0 0 0" }}>
      Mô tả ngắn gọn về chức năng của module...
    </p>
  </Col>
  <Col>
    <Button type="primary" icon={<ReloadOutlined />} onClick={handleSync}>
      Đồng bộ ERP
    </Button>
  </Col>
</Row>
```

---

## 2. Card-Style Filter Bar

Instead of simple floating search inputs, filters must reside inside the reusable `<FilterCard>` component (located in `src/components`). It is pre-styled with a white background (`#ffffff`), subtle border, and soft box shadow to make the layout clean and modern.

### Code Pattern:

```tsx
import { FilterCard } from "../../../components";

// Inside render:
<FilterCard>
  <Row gutter={[16, 16]} align="middle">
    <Col xs={24} sm={12} md={6}>
      <div style={{ marginBottom: 4, fontWeight: 500 }}>Tìm kiếm:</div>
      <Input
        placeholder="Nhập mã hoặc tên..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
        allowClear
      />
    </Col>
    {/* Additional filter columns here */}
  </Row>
</FilterCard>
```

---

## 3. Table Column Styles & Coding Standards

### 3.1 ItemCode Identification Styling

### 3.1 Code & Key Identification Styling

Mã Vật Tư / ItemCode as well as primary code/key identifier columns in tables (e.g. Mã Hồ Sơ / HscbCode) must always be formatted in **bold blue** (`#096dd9`) to distinguish key identifiers and allow users to quickly scan the codes.

```tsx
{
  title: "Mã Hồ Sơ", // Or "ItemCode", etc.
  dataIndex: "HscbCode",
  key: "HscbCode",
  render: (code: string) => (
    <strong style={{ color: "#096dd9" }}>{code}</strong>
  ),
}
```

### 3.2 Categorization Badges (Tags)

Use Tag enums with standardized styling to display categories:

- **Thành phẩm (FG)**: `blue`
- **Bán thành phẩm (IP)**: `purple`
- **Nguyên liệu (RM)**: `green`
- **Bao bì (PG)**: `orange`

```tsx
{
  title: "Phân Loại",
  dataIndex: "ItemType",
  key: "ItemType",
  render: (type: string) => {
    switch (type) {
      case "FG":
        return <Tag color="blue">Thành phẩm (FG)</Tag>;
      case "IP":
        return <Tag color="purple">Bán thành phẩm (IP)</Tag>;
      case "RM":
        return <Tag color="green">Nguyên liệu (RM)</Tag>;
      case "PG":
        return <Tag color="orange">Bao bì (PG)</Tag>;
      default:
        return <Tag>{type}</Tag>;
    }
  },
}
```

### 3.3 Column Title Brackets Rule

Column headers should be concise and clean. Avoid unnecessary brackets or parentheses containing type abbreviations in header titles (e.g. use `ItemCode` instead of `Mã Vật Tư (ItemCode)`, `Đơn Vị Tính` instead of `Đơn Vị Tính (UoM)`).

---

## 4. Table Layout & Pagination Configuration

Tables should always use the reusable `<AppTable>` component (located in `src/components`). It extends Ant Design's `Table` props while enforcing a white background, `8px` rounded corners, and proper overflow clipping.

### Code Pattern:

```tsx
import { AppTable } from "../../../components";

// Inside render:
<AppTable
  dataSource={filteredData}
  columns={columns}
  rowKey="UniqueKey"
  pagination={{
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "20", "50"],
    showTotal: (total) => `Tổng cộng ${total} dòng`,
  }}
  bordered
/>
```

## 5. Action Column & Details Modal Layout

When adding a view details function:

1. **Action Column in Table**:
   - Title must be `Hành động`, with centered alignment (`align: "center"`).
   - Render a solid primary blue button (`type="primary"`) containing a white eye icon (`EyeOutlined`) with `style={{ fontSize: "16px" }}` to increase icon size, and no text labels.
2. **State Management**:
   - Use React states to manage modal visibility and the active record (e.g., `isModalVisible`, `selectedItem`).
3. **Modal Structure**:
   - Title must include a status icon (e.g. `<EyeOutlined style={{ color: "#1890ff", marginRight: "8px" }} />`).
   - Content structure consists of a small, bordered `<Descriptions>` component with 2 columns displaying key fields (like `ItemCode` in bold blue, `ItemType` as tags, etc.).
   - Include a single primary closing button in the footer.

### Code Pattern:

```tsx
// 1. Column Definition
const columns = [
  // ... other columns
  {
    title: "Hành động",
    key: "action",
    align: "center" as const,
    render: (_: any, record: Item) => (
      <Button
        type="primary"
        icon={<EyeOutlined style={{ fontSize: "16px" }} />}
        onClick={() => {
          setSelectedItem(record);
          setIsModalVisible(true);
        }}
      />
    ),
  },
];

// 2. Modal Markup
<Modal
  title={
    <span style={{ fontSize: "18px", fontWeight: "bold" }}>
      <EyeOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
      Chi tiết thông tin...
    </span>
  }
  open={isModalVisible}
  onCancel={() => {
    setIsModalVisible(false);
    setSelectedItem(null);
  }}
  footer={[
    <Button
      key="close"
      type="primary"
      onClick={() => {
        setIsModalVisible(false);
        setSelectedItem(null);
      }}
    >
      Đóng
    </Button>,
  ]}
  width={800}
>
  {selectedItem && (
    <Descriptions
      bordered
      size="small"
      column={2}
      style={{ marginBottom: "20px" }}
    >
      <Descriptions.Item label="Mã">
        <strong style={{ color: "#096dd9" }}>{selectedItem.ItemCode}</strong>
      </Descriptions.Item>
      {/* Other description items */}
    </Descriptions>
  )}
</Modal>;
```

---

## 6. Table Layout Fixed Columns & Columns Ordering Rule

To ensure consistent scanning of actions across different list tables:

1. **Action Column (Hành động)**:
   - Must always be centered (`align: "center" as const`).
   - Must be the last column of the table.
   - Must be fixed to the right side of the screen (`fixed: "right" as const`, `width: 80` or `100` as appropriate) to prevent it from disappearing during scrolling.
2. **Document Column (Tài liệu)**:
   - Must be positioned immediately adjacent to the Action column (second-to-last column).
   - Should be fixed to the right side (`fixed: "right" as const`, `width: 100` as appropriate) alongside the Action column to maintain layout alignment.
3. **Scroll Property & Column Widths (Bắt buộc khi dùng fixed columns)**:
   - Must specify `scroll={{ x: 1200 }}` (or `scroll={{ x: "max-content" }}`) on the `<Table>` component to enable horizontal scrolling and prevent layout overlap of fixed columns on smaller screens.
   - **Column Width Specification (Bắt buộc)**: Phải đặt thuộc tính `width` cụ thể cho các cột chính (như Mã, Tên, Trạng thái, v.v.) để tránh việc trình duyệt tự động co khít cột làm chữ bị xuống dòng quá nhiều, gây tăng chiều cao hàng (`row height`) của bảng một cách bất hợp lý và làm mất thẩm mỹ giao diện.
   - **Pagination Size Control (Bắt buộc khi dùng size="middle" hoặc "small")**: Khi bảng dùng `size="middle"` hoặc `size="small"`, bộ phân trang sẽ tự động bị thu nhỏ lại theo. Để đảm bảo kích thước các nút phân trang dễ nhìn và dễ bấm, hãy định nghĩa tường minh `size: "default"` trong đối tượng `pagination` của `<Table>`.

```tsx
// 1. Column Definition
const columns = [
  // ... other regular columns
  {
    title: "Tài liệu",
    key: "File",
    fixed: "right" as const,
    width: 100,
    render: (record: any) => (
      // Render PDF button/link
    )
  },
  {
    title: "Hành động",
    key: "action",
    align: "center" as const,
    fixed: "right" as const,
    width: 100,
    render: (record: any) => (
      // Render Eye icon button
    ),
  },
];

// 2. Table Markup
<Table
  dataSource={data}
  columns={columns}
  scroll={{ x: 1200 }}
  bordered
  size="middle"
  pagination={{
    size: "default",
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total) => `Tổng cộng ${total} dòng`,
  }}
/>
```
