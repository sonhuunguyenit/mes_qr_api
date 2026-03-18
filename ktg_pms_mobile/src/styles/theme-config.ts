import { colors } from "~/constants/colors";
import { sizes } from "~/constants/sizes";

/**
 * ĐÂY LÀ FILE QUAN TRỌNG NHẤT ĐỂ CLONE DỰ ÁN
 * Khi sang dự án mới, chỉ cần chỉnh sửa các giá trị ở đây.
 */
export const BrandConfig = {
  // 1. Màu sắc chủ đạo (Brand Colors)
  primary: colors.primary, // #FFD54F (Màu vàng hiện tại)
  secondary: colors.secondary,
  tertiary: colors.tertiary,

  // 2. Cấu hình bo góc (Border Radius)
  // Dự án này thích bo tròn nhiều (20px cho Card)
  // Dự án khác có thể chỉnh về 8px hoặc 4px
  radius: {
    sm: sizes.radius.sm,
    md: sizes.radius.md,
    lg: sizes.radius.lg,
    xl: sizes.radius.xl,
    // Giá trị đặc thù cho Block/Card
    card: 10,
    button: 10,
    input: 10,
    block: 10,
  },

  // 3. Cấu hình Font Family (Sẽ được map vào typography)
  fonts: {
    regular: "Inter-Regular",
    medium: "Inter-Medium",
    semibold: "Inter-SemiBold",
    bold: "Inter-Bold",
    extraBold: "Inter-ExtraBold",
    black: "Inter-Black",
  },

  // 4. Hệ thống Spacing chuẩn
  spacing: {
    xs: 5,
    sm: 10,
    md: 16,
    lg: 20,
    xl: 25,
    xxl: 30,
  },
};
