import { DateData } from "react-native-calendars";

export interface DayCalendarEvents<T> {
  events: T[];
  theme: any;
  date: DateData;
}

export interface DayCalendarTheme {
  backgroundColor: string;
  color: string;
  label: string;
}

declare module "*.png" {
  const value: import("react-native").ImageSourcePropType;
  export default value;
}

declare module "*.jpg" {
  const value: import("react-native").ImageSourcePropType;
  export default value;
}
