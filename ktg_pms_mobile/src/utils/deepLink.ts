import {
  goPODetail,
  goPRDetail,
  goBidDetail,
  goContractDetail,
  goSupplierPotentialDetail,
  goSupplierSapDetail,
  goSupplierLawDetail,
  goNotification,
  goHome,
  navigationRef,
} from "./navigate";
import { showMessage } from "react-native-flash-message";

// Bộ nhớ đệm dùng để lưu tạm các deep link đến trước khi thông tin người dùng được load hoặc đăng nhập thành công
let pendingUrl: string | null = null;

export const getPendingUrl = () => pendingUrl;
export const setPendingUrl = (url: string | null) => {
  pendingUrl = url;
};
export const clearPendingUrl = () => {
  pendingUrl = null;
};

/**
 * Phân tích cú pháp của URL đầu vào (bao gồm cả custom scheme như ktgpms:// và HTTPS universal link)
 * để trích xuất pathname sạch và các tham số truy vấn (search parameters).
 */
export const parseUrl = (urlStr: string) => {
  try {
    // Thay thế custom scheme bằng https để sử dụng được bộ phân tích URL chuẩn của JS
    const cleanUrl = urlStr.startsWith("ktgpms://")
      ? urlStr.replace("ktgpms://", "https://localhost/")
      : urlStr;

    const url = new URL(cleanUrl);
    return {
      pathname: url.pathname,
      searchParams: url.searchParams,
    };
  } catch (e) {
    // Bộ phân tích thủ công dự phòng cho các engine JS cũ hơn
    const parts = urlStr.split("?");
    const pathPart = parts[0];
    const queryPart = parts[1] || "";

    let pathname = pathPart;
    if (pathPart.includes("://")) {
      const domainSplit = pathPart.split("://")[1];
      const firstSlash = domainSplit.indexOf("/");
      pathname = firstSlash !== -1 ? domainSplit.substring(firstSlash) : "/";
    }

    const searchParams = {
      get: (key: string) => {
        const match = queryPart.match(new RegExp(`[?|&]${key}=([^&]+)`));
        return match ? decodeURIComponent(match[1]) : null;
      },
    };

    return { pathname, searchParams };
  }
};

/**
 * Bộ xử lý tập trung cho tất cả các deep link và URL từ thông báo đẩy.
 * Tự động trích xuất các ID tài nguyên và điều hướng người dùng tới màn hình tương ứng của app.
 */
export const handleOpenURL = (url: string) => {
  if (!url) return;

  const { pathname, searchParams } = parseUrl(url);

  // Hàm điều hướng an toàn: tự động thử lại nếu hệ thống chưa sẵn sàng và trì hoãn hiệu ứng để tránh lỗi đơ cảm ứng/Drawer Menu
  const safeNavigate = (navigateFn: () => void, retries = 10) => {
    if (navigationRef.isReady()) {
      // Hệ thống đã sẵn sàng -> Hoãn 400ms để thiết bị vẽ xong Layout/Gestures của màn hình gốc rồi mới nhảy trang (tránh đơ cảm ứng)
      setTimeout(navigateFn, 400);
    } else if (retries > 0) {
      // Hệ thống chưa sẵn sàng (đang khởi động app) -> Chờ 250ms rồi thử đệ quy lại, tối đa thử 10 lần (2.5 giây)
      setTimeout(() => safeNavigate(navigateFn, retries - 1), 250);
    }
  };

  // Trích xuất ID từ tham số query hoặc phân đoạn cuối cùng của pathname (giống màn hình Notification)
  let id = searchParams.get("id");
  if (!id) {
    const parts = pathname.split("/");
    const lastSegment = parts[parts.length - 1];
    // ID thường là UUID hoặc mã số có độ dài lớn (ví dụ > 5 ký tự) để tránh nhận nhầm chữ như "detail", "pr"
    if (lastSegment && lastSegment.length > 5) {
      id = lastSegment;
    }
  }

  // Hàm helper kiểm tra có ID hợp lệ rồi mới điều hướng
  const checkIdAndNavigate = (navigateFn: () => void) => {
    if (!id) {
      showMessage({
        message: "Thông báo",
        description: "Không tìm thấy mã tham chiếu chi tiết.",
        type: "default",
      });
      return;
    }
    safeNavigate(navigateFn);
  };

  // 1. Các liên kết thuộc Module Đơn mua hàng PO (Khớp các đường dẫn chứa /po/)
  if (pathname.includes("/po/")) {
    const code = searchParams.get("code");
    checkIdAndNavigate(() =>
      goPODetail({ id: id!, code: code || `PO-${id!.substring(0, 6)}` }),
    );
  }

  // 2. Các liên kết thuộc Module Yêu cầu mua sắm PR (Khớp các đường dẫn chứa /pr/)
  else if (pathname.includes("/pr/")) {
    const code = searchParams.get("code");
    checkIdAndNavigate(() =>
      goPRDetail({ id: id!, code: code || `PR-${id!.substring(0, 6)}` }),
    );
  }

  // 3. Các liên kết thuộc Module Hợp đồng Contract (Khớp các đường dẫn chứa /contract/)
  else if (pathname.includes("/contract/")) {
    checkIdAndNavigate(() => goContractDetail({ item: { id } }));
  }

  // 4. Các liên kết thuộc Module Đấu thầu Bid (Khớp các đường dẫn chứa /bid/)
  else if (pathname.includes("/bid/")) {
    checkIdAndNavigate(() => {
      const isRate = pathname.includes("bid-rate");
      goBidDetail(id!, isRate);
    });
  }

  // 5. Các liên kết thuộc Module Nhà cung cấp tiềm năng (Khớp đường dẫn chứa supplier-potential)
  else if (pathname.includes("supplier-potential")) {
    checkIdAndNavigate(() => goSupplierPotentialDetail({ id }));
  }

  // 6. Các liên kết thuộc Module Nhà cung cấp SAP/Nâng cấp chính thức (Khớp đường dẫn chứa supplier-official-upgrade hoặc supplier-sap)
  else if (
    pathname.includes("supplier-official-upgrade") ||
    pathname.includes("supplier-sap")
  ) {
    checkIdAndNavigate(() => goSupplierSapDetail({ id }));
  }

  // 7. Các liên kết thuộc Module Nhà cung cấp Pháp lý (Khớp đường dẫn chứa supplier-law)
  else if (pathname.includes("supplier-law")) {
    checkIdAndNavigate(() => goSupplierLawDetail({ id }));
  }

  // 8. Các liên kết thuộc màn hình Danh sách thông báo (Khớp đường dẫn chứa /notification)
  else if (pathname.includes("/notification")) {
    safeNavigate(() => goNotification());
  }

  // 9. Dự phòng cho các đường dẫn không xác định (chuyển hướng về trang chủ Home)
  else {
    showMessage({
      message: "Thông báo",
      description: "Chức năng xem chi tiết chưa hỗ trợ trên mobile.",
      type: "default",
    });
    safeNavigate(() => goHome());
  }
};
