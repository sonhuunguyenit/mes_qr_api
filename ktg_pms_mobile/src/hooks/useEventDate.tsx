import { EventDayType } from "~/app.types";
import { DATE_FORMAT } from "~/constants";
import { colors } from "~/constants/colors";
import { useAuth } from "~/hooks/useAuth";
import { holidayService } from "~/services/holiday/holiday.service";
import { leaveService } from "~/services/leave/leave.service";
import { logger } from "~/utils/logger";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useMemo } from "react";
import { DateData } from "react-native-calendars";

type EventDateMap = Record<
  string,
  {
    events: any[];
    theme: {
      backgroundColor: string;
      color: string;
      label: string;
    };
    date: DateData;
  }
>;

const buildDateItem = (m: moment.Moment): DateData => ({
  year: m.year(),
  month: m.month() + 1,
  day: m.date(),
  timestamp: m.valueOf(),
  dateString: m.format(DATE_FORMAT),
});

const useEventDate = () => {
  const { user } = useAuth();

  const { data: lstHolidayCalendar = [] } = useQuery({
    queryKey: ["getListHolidayCalendar", user?.employeeId],
    queryFn: () =>
      holidayService.getListHolidayCalendar({
        pageIndex: 1,
        pageSize: 10000,
        fromDate: moment().startOf("year").format("YYYY-MM-DD"),
        toDate: moment().endOf("year").format("YYYY-MM-DD"),
      }),
    enabled: !!user?.employeeId,
    select: (res: any) => res?.data ?? [],
  });

  const { data: lstLeaveRequestRegister = [] } = useQuery({
    queryKey: ["getListDayOffRegister", user?.employeeId],
    queryFn: () =>
      leaveService.getListDayOffRegister({
        employeeId: user?.employeeId!,
        fromDate: moment().startOf("year").format("YYYY-MM-DD"),
        toDate: moment().endOf("year").format("YYYY-MM-DD"),
      }),
    enabled: !!user?.employeeId,
    select: (res: any) => res?.data ?? [],
  });

  const lstEventDate = useMemo<EventDateMap>(() => {
    const map: EventDateMap = {};

    // -------- HOLIDAY --------
    for (const h of lstHolidayCalendar) {
      const m = moment(h.date).startOf("day");
      const key = m.format("YYYY-MM-DD");

      if (!map[key]) {
        map[key] = {
          events: [],
          theme: {
            backgroundColor: colors.lredBg,
            color: colors.red,
            label: colors.red,
          },
          date: buildDateItem(m),
        };
      }

      map[key].events.push({
        ...h,
        eventDayType: EventDayType.HOLIDAY,
      });
    }

    // -------- LEAVE --------
    for (const l of lstLeaveRequestRegister) {
      const base = l.dayOff ?? l.startTime;
      if (!base) continue;

      const start = moment(base).startOf("day");
      const end = l.dateTo ? moment(l.dateTo).startOf("day") : start.clone();

      for (
        let cur = start.clone();
        cur.isSameOrBefore(end);
        cur.add(1, "day")
      ) {
        const key = cur.format("YYYY-MM-DD");

        if (!map[key]) {
          map[key] = {
            events: [],
            theme: {
              backgroundColor: colors.lblueBg,
              color: colors.blue,
              label: colors.blue,
            },
            date: buildDateItem(cur),
          };
        }

        map[key].events.push({
          ...l,
          eventDayType: EventDayType.LEAVE,
        });
      }
    }

    return map;
  }, [lstHolidayCalendar, lstLeaveRequestRegister]);

  return { lstEventDate };
};

export default useEventDate;
