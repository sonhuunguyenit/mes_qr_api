import { CALENDAR_THEME } from "~/constants";
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

import { useTheme } from "~/hooks/useTheme";

const PickerCalendar = ({
  range = false,
  onSelectDate,
  onSelectRange,
  initialDate,
  disabledDates = [],
  markerDates = [],
}: Props) => {
  const { colors } = useTheme();
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
        selectedColor: item.color || colors.slate200,
        selectedTextColor: item.textColor || colors.slate600,
      };
    });

    disabledDates.forEach((item) => {
      marks[item.date] = {
        selected: true,
        selectedColor: item.color || colors.slate100,
        selectedTextColor: item.textColor || colors.slate600,
      };
    });

    if (!range && selected) {
      marks[selected] = {
        selected: true,
        selectedColor: colors.primary,
        selectedTextColor: colors.white,
      };
    }

    if (range) {
      if (fromDate) {
        marks[fromDate] = {
          ...marks[fromDate],
          startingDay: true,
          color: colors.primary,
          textColor: colors.white,
        };
      }
      if (toDate) {
        marks[toDate] = {
          ...marks[toDate],
          endingDay: true,
          color: colors.primary,
          textColor: colors.white,
        };
        let start = new Date(fromDate);
        let end = new Date(toDate);
        let curr = new Date(start);
        curr.setDate(curr.getDate() + 1);
        while (curr < end) {
          const d = curr.toISOString().split("T")[0];
          if (!marks[d]) {
            marks[d] = { color: colors.primary, textColor: colors.white as string };
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
        todayTextColor: colors.primary as string,
        arrowColor: colors.primary as string,
        textDisabledColor: colors.neutral300 as string,
        textDayFontWeight: "400",
        textMonthFontWeight: "600",
        textDayHeaderFontWeight: "400",
      }}
      showSixWeeks={true}
    />
  );
};

export default PickerCalendar;
