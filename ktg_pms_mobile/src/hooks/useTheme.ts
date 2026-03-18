import { useContext } from "react";
import { AppThemeContext } from "~/contexts/ThemeContext";
import { Themes } from "~/styles/themes";

/**
 * Trái tim của hệ thống UI Kit.
 * Tất cả component chỉ được lấy style từ hook này.
 */
export const useTheme = () => {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  const { appTheme, setAppTheme } = context;

  // appTheme lấy từ Storage (không dùng scheme máy)
  const theme = Themes[appTheme] || Themes.light;

  return {
    ...theme,
    appTheme,
    setAppTheme,
    isDark: appTheme === "dark",
  };
};
