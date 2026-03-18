import {
  DarkTheme as DefaultDarkTheme,
  DefaultTheme as DefaultLightTheme,
} from "@react-navigation/native";
import { ColorSchemeName, ColorValue } from "react-native";
import { darkTheme } from "./darkTheme";
import { lightTheme } from "./lightTheme";

export interface ThemeColors {
  primary: ColorValue;
  secondary: ColorValue;
  tertiary: ColorValue;
  success: ColorValue;
  error: ColorValue;
  warning: ColorValue;
  info: ColorValue;

  background: ColorValue;
  surface: ColorValue;
  block: ColorValue;
  card: ColorValue;
  collapse: ColorValue;

  header: ColorValue;
  title: ColorValue;
  text: ColorValue;
  label: ColorValue;
  value: ColorValue;
  placeholder: ColorValue;
  textOnPrimary: ColorValue; // Thêm màu chữ trên nền primary

  active: ColorValue;
  inactive: ColorValue;
  disabled: ColorValue;
  disabledBg: ColorValue;

  border: ColorValue;
  divider: ColorValue;
  overlay: ColorValue;

  white: ColorValue; // White cố định
  black: ColorValue; // Black cố định

  // Semantic palette
  green: ColorValue;
  lgreenBg: ColorValue;
  lgreenIcon: ColorValue;
  blue: ColorValue;
  lblueBg: ColorValue;
  lblueIcon: ColorValue;
  red: ColorValue;
  lredBg: ColorValue;
  lredIcon: ColorValue;
  yellow: ColorValue;
  lyellowBg: ColorValue;
  lyellowIcon: ColorValue;
  gray: ColorValue;
  lgrayBg: ColorValue;
  lgrayIcon: ColorValue;
  space: ColorValue;
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
