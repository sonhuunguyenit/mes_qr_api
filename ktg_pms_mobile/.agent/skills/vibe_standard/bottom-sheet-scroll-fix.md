# Hướng dẫn Fix lỗi Scroll trong BottomSheet (v5)

Tài liệu này ghi lại cách xử lý vấn đề không scroll được nội dung hoặc scroll bị nhảy (giật) do xung đột Gesture trong thư viện `@gorhom/bottom-sheet`.

## 1. Vấn đề (Symptoms)

1.  **Chạm vào vùng trống không scroll được:** Khi người dùng chạm vào các vùng "xám" (không phải là Input, Button, hay Select), BottomSheet không nhận diện được thao tác cuộn nội dung.
2.  **Scroll bị hiểu nhầm thành SnapPoint:** Khi đang cuộn nội dung, BottomSheet cố gắng "hút" (snap) về các vị trí snapPoints có sẵn, gây ra hiện tượng khựng hoặc đóng sheet bất ngờ.
3.  **Xung đột giữa ScrollView và Panning Gesture:** Cử chỉ kéo (pan) của BottomSheet cha tranh chấp với cử chỉ cuộn (scroll) của Component con.

## 2. Nguyên nhân (Root Cause)

- **`enableContentPanningGesture` mặc định là `true`:** Điều này cho phép người dùng kéo từ bất kỳ điểm nào trên nội dung để thay đổi độ cao của Sheet. Khi chỉ có 1 snapPoint cố định, việc này gây xung đột với ScrollView bên trong.
- **Sử dụng `BottomSheetView` cho nội dung có scroll:** Theo tài liệu, `BottomSheetView` chỉ dùng cho các nội dung tĩnh, không có khả năng cuộn.
- **Sử dụng `ScrollView` chuẩn của React Native:** ScrollView mặc định không được tối ưu để hoạt động mượt mà bên trong hệ thống Gesture của BottomSheet.

## 3. Cách xử lý (Solution)

### Bước 1: Cấu hình lại BottomSheet cha (thường là trong Context hoặc Wrapper)

Trong file `SheetContext.tsx`, cấu hình BottomSheet như sau:

```tsx
<BottomSheet
  // ... các props khác
  snapPoints={["75%"]} // Nên dùng 1 snapPoint cố định nếu muốn nội dung scroll mượt
  enableContentPanningGesture={false} // QUAN TRỌNG: Tắt để nhường quyền handle scroll cho content
  enablePanDownToClose={true} // Vẫn cho phép kéo từ Handle (thanh ngang) để đóng
>
  {/* Thay BottomSheetView bằng View thường */}
  <View style={{ flex: 1 }}>{content}</View>
</BottomSheet>
```

### Bước 2: Sử dụng đúng Component cuộn

Luôn luôn sử dụng `BottomSheetScrollView` thay vì `ScrollView` thông thường khi đặt nội dung vào trong BottomSheet.

```tsx
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

// Trong Component của bạn
return (
  <BottomSheetScrollView>
    {/* Nội dung filter, thông tin chi tiết... */}
  </BottomSheetScrollView>
);
```

## 4. Lưu ý quan trọng

- Nếu bạn tắt `enableContentPanningGesture`, người dùng **không thể** kéo từ vùng nội dung để đóng sheet. Họ bắt buộc phải kéo từ **Handle** phía trên hoặc chạm vào backdrop (nếu đã cấu hình). Đây là "đánh đổi" cần thiết để có trải nghiệm cuộn nội dung 100% mượt mà ở mọi điểm chạm.
- Tránh bọc quá nhiều tầng View lồng nhau bên ngoài `BottomSheetScrollView`.
- Đảm bảo `flex: 1` được set đúng từ BottomSheet cha xuống đến ScrollView của bạn.
