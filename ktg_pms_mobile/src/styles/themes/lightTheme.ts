import { BrandConfig } from "../theme-config";
import { colors as palette } from "~/constants/colors";
import { ThemeType } from "./index";

export const lightTheme: ThemeType = {
  colors: {
    primary: BrandConfig.primary,
    secondary: BrandConfig.secondary,
    tertiary: BrandConfig.tertiary,
    success: palette.green500,
    error: palette.red500,
    warning: palette.orange500,
    info: palette.blue500,

    background: palette.gray50,
    surface: palette.white,
    card: palette.white,
    block: palette.white,
    collapse: palette.white,

    header: palette.black,
    title: palette.title,
    text: palette.text,
    label: palette.label,
    value: palette.value,
    placeholder: palette.placeholder,
    textOnPrimary: palette.white,

    active: palette.active,
    inactive: palette.gray400,
    disabled: palette.gray300,
    disabledBg: palette.gray100,

    border: palette.gray200,
    divider: palette.gray100,

    overlay: "rgba(0,0,0,0.4)",
    white: palette.white,
    black: palette.black,

    // Semantic palette
    green: palette.green,
    lgreenBg: palette.lgreenBg,
    lgreenIcon: palette.lgreenIcon,
    blue: palette.blue,
    lblueBg: palette.lblueBg,
    lblueIcon: palette.lblueIcon,
    red: palette.red,
    lredBg: palette.lredBg,
    lredIcon: palette.lredIcon,
    yellow: palette.yellow,
    lyellowBg: palette.lyellowBg,
    lyellowIcon: palette.lyellowIcon,
    gray: palette.gray,
    lgrayBg: palette.lgrayBg,
    lgrayIcon: palette.lgrayIcon,
    space: palette.space,
  },
  spacing: BrandConfig.spacing,
  radius: BrandConfig.radius,
  fonts: BrandConfig.fonts,
  statusBar: "dark-content",
};
