import { BrandConfig } from "../theme-config";
import { colors as palette } from "~/constants/colors";
import { ThemeType } from "./index";

export const darkTheme: ThemeType = {
  colors: {
    primary: BrandConfig.primary,
    secondary: BrandConfig.secondary,
    tertiary: BrandConfig.tertiary,
    success: palette.green400,
    error: palette.red400,
    warning: palette.orange400,
    info: palette.blue300,

    background: palette.darkBackground,
    surface: palette.darkSurface,
    card: palette.darkSurface,
    block: palette.darkSurface,
    collapse: palette.darkSurface,

    header: palette.white,
    title: palette.white50,
    text: palette.white200,
    label: palette.gray300,
    value: palette.white50,
    placeholder: palette.gray500,
    textOnPrimary: palette.white,

    active: palette.active,
    inactive: palette.gray600,
    disabled: palette.gray700,
    disabledBg: palette.gray800,

    border: "#4a4b50",
    divider: "#323338",

    overlay: "rgba(0,0,0,0.6)",
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
  statusBar: "light-content",
};
