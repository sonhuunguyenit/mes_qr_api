import {
  DarkTheme as DefaultDarkTheme,
  DefaultTheme as DefaultLightTheme,
} from "@react-navigation/native";
import { ColorSchemeName, ColorValue } from "react-native";
import { darkTheme } from "./darkTheme";
import { lightTheme } from "./lightTheme";

export interface ThemeColors {
  active: ColorValue;
  accentRed: ColorValue;
  amber400: ColorValue;
  amber500: ColorValue;
  amber600: ColorValue;
  background: ColorValue;
  badgeRed: ColorValue;
  black: ColorValue;
  blackAlpha3: ColorValue;
  blackAlpha8: ColorValue;
  blackOpacity20: ColorValue;
  blackOpacity25: ColorValue;
  blackOpacity45: ColorValue;
  block: ColorValue;
  blue: ColorValue;
  blue1: ColorValue;
  blue50: ColorValue;
  blue100: ColorValue;
  blue200: ColorValue;
  blue300: ColorValue;
  blue400: ColorValue;
  blue500: ColorValue;
  blue600: ColorValue;
  blue700: ColorValue;
  blue800: ColorValue;
  blue900: ColorValue;
  blueAlpha10: ColorValue;
  brandBlue: ColorValue;
  brandOrange: ColorValue;
  border: ColorValue;
  card: ColorValue;
  disabled: ColorValue;
  disabledBg: ColorValue;
  divider: ColorValue;
  error: ColorValue;
  goldCream: ColorValue;
  goldLight: ColorValue;
  goldPrimary: ColorValue;
  goldShadow: ColorValue;
  goldShape: ColorValue;
  gray: ColorValue;
  gray100: ColorValue;
  gray200: ColorValue;
  gray300: ColorValue;
  gray400: ColorValue;
  gray800: ColorValue;
  gray900: ColorValue;
  graySlate: ColorValue;
  grayDark: ColorValue;
  green: ColorValue;
  green1: ColorValue;
  header: ColorValue;
  inactive: ColorValue;
  info: ColorValue;
  label: ColorValue;
  lblueBg: ColorValue;
  lblueIcon: ColorValue;
  lgrayBg: ColorValue;
  lgrayIcon: ColorValue;
  lgreenBg: ColorValue;
  lgreenIcon: ColorValue;
  lpinkBg: ColorValue;
  lpinkIcon: ColorValue;
  lpurpleBg: ColorValue;
  lpurpleIcon: ColorValue;
  lredBg: ColorValue;
  lredIcon: ColorValue;
  lyellowBg: ColorValue;
  lyellowIcon: ColorValue;
  neutral5: ColorValue;
  neutral15: ColorValue;
  neutral25: ColorValue;
  neutral30: ColorValue;
  neutral50: ColorValue;
  neutral100: ColorValue;
  neutral150: ColorValue;
  neutral200: ColorValue;
  neutral300: ColorValue;
  neutral400: ColorValue;
  neutral500: ColorValue;
  neutral600: ColorValue;
  neutral700: ColorValue;
  neutral700Alt: ColorValue;
  neutral750: ColorValue;
  neutral800: ColorValue;
  neutral900: ColorValue;
  orangeHeader: ColorValue;
  overlay: ColorValue;
  pink: ColorValue;
  placeholder: ColorValue;
  primary: ColorValue;
  purple: ColorValue;
  red: ColorValue;
  red1: ColorValue;
  rose50: ColorValue;
  rose500: ColorValue;
  secondary: ColorValue;
  slate50: ColorValue;
  slate100: ColorValue;
  slate200: ColorValue;
  slate300: ColorValue;
  slate400: ColorValue;
  slate500: ColorValue;
  slate600: ColorValue;
  slate700: ColorValue;
  slate800: ColorValue;
  slate900: ColorValue;
  slate950: ColorValue;
  space: ColorValue;
  statusError: ColorValue;
  statusErrorBg: ColorValue;
  statusErrorBorder: ColorValue;
  statusErrorDark: ColorValue;
  statusErrorTitle: ColorValue;
  statusInfo: ColorValue;
  statusInfoBg: ColorValue;
  statusInfoBorder: ColorValue;
  statusInfoTitle: ColorValue;
  statusMessage: ColorValue;
  statusSuccess: ColorValue;
  statusSuccessBg: ColorValue;
  statusSuccessBorder: ColorValue;
  statusSuccessDark: ColorValue;
  statusSuccessTitle: ColorValue;
  statusWarning: ColorValue;
  statusWarningBg: ColorValue;
  statusWarningBorder: ColorValue;
  statusWarningTitle: ColorValue;
  success: ColorValue;
  surface: ColorValue;
  tabs: ColorValue;
  tertiary: ColorValue;
  text: ColorValue;
  title: ColorValue;
  value: ColorValue;
  warning: ColorValue;
  white: ColorValue;
  whiteAlpha0: ColorValue;
  whiteAlpha5: ColorValue;
  whiteAlpha15: ColorValue;
  whiteAlpha40: ColorValue;
  whiteAlpha80: ColorValue;
  yellow: ColorValue;
  yellow1: ColorValue;
}

export interface ThemeType {
  colors: ThemeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    card: number;
    button: number;
    input: number;
    block: number;
  };
  fonts: {
    regular: string;
    medium: string;
    semibold: string;
    bold: string;
    extraBold: string;
    black: string;
  };
  statusBar: "light-content" | "dark-content";
}

export const getTheme = (theme: ColorSchemeName) => {
  if (theme === "dark") {
    return {
      ...DefaultDarkTheme,
      ...darkTheme,
    };
  }
  return {
    ...DefaultLightTheme,
    ...lightTheme,
  };
};

export { darkTheme, lightTheme };

export const Themes: Record<"light" | "dark", ThemeType> = {
  light: lightTheme,
  dark: darkTheme,
};
