import { CALENDAR_THEME } from "~/constants";
import { colors } from "~/constants/colors";
import React, { useState } from "react";
import { Alert } from "react-native";
import { Calendar, DateData } from "react-native-calendars";

export type CalendarDateItem = {
  date: string;
  reason?: string;
  color?: string;
  textColor?: string;
};

type Props = {
  range?: boolean;
  onSelectDate?: (date: string) => void;
  onSelectRange?: (range: { from: string; to: string | null }) => void;
  initialDate?: string;
  disabledDates?: CalendarDateItem[];
  markerDates?: CalendarDateItem[];
};

const PickerCalendar = ({
  range = false,
  onSelectDate,
  onSelectRange,
  initialDate,
  disabledDates = [],
  markerDates = [],
}: Props) => {
  const [selected, setSelected] = useState(initialDate || "");
  const [fromDate, setFromDate] = useState<string>(initialDate || "");
  const [toDate, setToDate] = useState<string | null>(null);

  const handleDayPress = (day: DateData) => {
    const dateString = day.dateString;

    const specialDay = disabledDates.find((item) => item.date === dateString);
    if (specialDay) {
      Alert.alert("Thông tin ngày", specialDay.reason);
      return;
    }

    if (!range) {
      setSelected(dateString);
      if (onSelectDate) onSelectDate(dateString);
      return;
    }

    if (!fromDate || (fromDate && toDate)) {
      setFromDate(dateString);
      setToDate(null);
      if (onSelectRange) onSelectRange({ from: dateString, to: null });
    } else {
      if (dateString < fromDate) {
        setToDate(fromDate);
        setFromDate(dateString);
        if (onSelectRange) onSelectRange({ from: dateString, to: fromDate });
      } else {
        setToDate(dateString);
        if (onSelectRange) onSelectRange({ from: fromDate, to: dateString });
      }
    }
  };

  const getMarkedDates = () => {
    let marks: any = {};

    markerDates.forEach((item) => {
      marks[item.date] = {
        selected: true,
        selectedColor: item.color || "#E2E8F0",
        selectedTextColor: item.textColor || "#475569",
      };
    });

    disabledDates.forEach((item) => {
      marks[item.date] = {
        selected: true,
        selectedColor: item.color || "#F1F5F9",
        selectedTextColor: item.textColor || "#475569",
      };
    });

    if (!range && selected) {
      marks[selected] = {
        selected: true,
        selectedColor: colors.primary,
        selectedTextColor: "#ffffff",
      };
    }

    if (range) {
      if (fromDate) {
        marks[fromDate] = {
          ...marks[fromDate],
          startingDay: true,
          color: colors.primary,
          textColor: "#ffffff",
        };
      }
      if (toDate) {
        marks[toDate] = {
          ...marks[toDate],
          endingDay: true,
          color: colors.primary,
          textColor: "#ffffff",
        };
        let start = new Date(fromDate);
        let end = new Date(toDate);
        let curr = new Date(start);
        curr.setDate(curr.getDate() + 1);
        while (curr < end) {
          const d = curr.toISOString().split("T")[0];
          if (!marks[d]) {
            marks[d] = { color: colors.primary, textColor: "#ffffff" };
          }
          curr.setDate(curr.getDate() + 1);
        }
      }
    }

    return marks;
  };

  return (
    <Calendar
      current={selected || fromDate || new Date().toISOString().split("T")[0]}
      onDayPress={handleDayPress}
      markingType={range ? "period" : "dot"}
      markedDates={getMarkedDates()}
      theme={{
        ...CALENDAR_THEME,
        todayTextColor: colors.primary,
        arrowColor: colors.primary,
        textDisabledColor: "#D1D5DB",
        textDayFontWeight: "400",
        textMonthFontWeight: "600",
        textDayHeaderFontWeight: "400",
      }}
      showSixWeeks={true}
    />
  );
};

export default PickerCalendar;
