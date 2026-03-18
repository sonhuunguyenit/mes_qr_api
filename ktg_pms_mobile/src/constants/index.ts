import { Dimensions, NativeModules, Platform } from "react-native";
import { LocaleConfig } from "react-native-calendars";
import { colors } from "./colors";

const { height, width } = Dimensions.get("window");

export const APP_THEME = "APP_THEME";

export const DEVICE_TIMEZONE =
  Platform.OS === "ios"
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : NativeModules.SettingsManager?.settings?.timeZone ||
      Intl.DateTimeFormat().resolvedOptions().timeZone;

export const DATE_FORMAT = "DD/MM/YYYY";

export const TIME_FORMAT = "HH:mm:ss";

export const DATE_TIME_FORMAT = "YYYY/MM/DD HH:mm:ss";

export const PADDING_HORIZONTAL = Platform.OS === "ios" ? 10 : 5;

export const PADDING_BOTTOM = 50;

export const PADDING_ABOVE_BOTTOM_BAR = 110;

export const SCREEN_HEIGHT = height;

export const SCREEN_WIDTH = width;

export const MODAL_HEIGHT = height * 0.75;

export const MODAL_WIDTH = width - 40;

export const MODAL_STATUS_WIDTH = 320;

export const HEIGHT_PICKER_DATE = 650;

export const BOTTOM_SHEET_HEIGHT = 750;

export const BOTTOM_SHEET_SNAPPOINTS = ["75%"];

export const ITEMS_PER_PAGE = 10;

export const MONTHS = [
  {
    value: 1,
    label: "Tháng 1",
  },
  {
    value: 2,
    label: "Tháng 2",
  },
  {
    value: 3,
    label: "Tháng 3",
  },
  {
    value: 4,
    label: "Tháng 4",
  },
  {
    value: 5,
    label: "Tháng 5",
  },
  {
    value: 6,
    label: "Tháng 6",
  },
  {
    value: 7,
    label: "Tháng 7",
  },
  {
    value: 8,
    label: "Tháng 8",
  },
  {
    value: 9,
    label: "Tháng 9",
  },
  {
    value: 10,
    label: "Tháng 10",
  },
  {
    value: 11,
    label: "Tháng 11",
  },
  {
    value: 12,
    label: "Tháng 12",
  },
];

export const YEARS = [
  {
    value: 2021,
    label: "2021",
  },
  {
    value: 2022,
    label: "2022",
  },
  {
    value: 2023,
    label: "2023",
  },
  {
    value: 2024,
    label: "2024",
  },
  {
    value: 2025,
    label: "2025",
  },
];

export const TIMESHEET_STATUS = {
  VALID: "#4CAF50",
  LATE: "#FF9800",
  EARLY_LEAVE: "#F44336",
  NO_CHECKIN: "#2196F3",
  NO_CHECKOUT: "#9C27B0",
};

export const initCalendarLocale = () => {
  LocaleConfig.locales["vi"] = {
    monthNames: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    monthNamesShort: [
      "Th.1",
      "Th.2",
      "Th.3",
      "Th.4",
      "Th.5",
      "Th.6",
      "Th.7",
      "Th.8",
      "Th.9",
      "Th.10",
      "Th.11",
      "Th.12",
    ],
    dayNames: [
      "Chủ Nhật",
      "Thứ Hai",
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy",
    ],
    dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
    today: "Hôm nay",
  };

  LocaleConfig.defaultLocale = "vi";
};

export const DAY_SIZE = (SCREEN_WIDTH - 120) / 7;

export const CALENDAR_THEME = {
  calendarBackground: "transparent",
  textSectionTitleColor: "#9CA3AF",
  todayTextColor: "#fff",
  dayTextColor: "#1F2937",
  textMonthFontWeight: "900",
  textDayFontWeight: "600",
  textDayHeaderFontWeight: "700",
  textMonthFontSize: 17,
  arrowColor: colors.primary,
  "stylesheet.calendar.main": {
    week: {
      marginTop: 4,
      marginBottom: 4,
      flexDirection: "row",
      justifyContent: "space-around",
    },
  },
} as const;

export const PAGE_SIZE = 1000000;
