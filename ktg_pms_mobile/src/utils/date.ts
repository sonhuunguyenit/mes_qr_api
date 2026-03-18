import { DATE_TIME_FORMAT, DATE_FORMAT } from "~/constants";
import moment from "moment-timezone";

const DateHelper = {
  currentDate: (format?: string) => {
    return moment().format(format ?? DATE_FORMAT);
  },
  formatDate: (date: string, format?: string) => {
    return moment(date).format(format ?? DATE_FORMAT);
  },
  detailDate: (date?: string, format?: string) => {
    const parsed = date ? moment(date, format ?? DATE_TIME_FORMAT) : moment();

    return {
      day: parsed.date(),
      month: parsed.month() + 1,
      year: parsed.year(),
      hour: parsed.hour(),
      minute: parsed.minute(),
      second: parsed.second(),
    };
  },
  getNearYears: (date?: string, number?: number) => {
    let years = [];
    const parsed = date ? moment(date) : moment();

    let gap = number ?? 1;

    const current = String(parsed.year());

    years.push({
      label: current,
      value: current,
    });

    for (let i = 1; i <= gap; i++) {
      const past = String(parsed.year() - i);
      years.unshift({
        label: past,
        value: past,
      });
      const future = String(parsed.year() + i);
      years.push({
        label: future,
        value: future,
      });
    }

    return years;
  },
};

export default DateHelper;
