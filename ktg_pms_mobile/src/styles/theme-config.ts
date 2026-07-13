import { sizes } from "~/constants/sizes";

export const BrandConfig = {
  // 2. Cấu hình bo góc (Border Radius)
  radius: {
    sm: sizes.radius.sm,
    md: sizes.radius.md,
    lg: sizes.radius.lg,
    xl: sizes.radius.xl,

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
