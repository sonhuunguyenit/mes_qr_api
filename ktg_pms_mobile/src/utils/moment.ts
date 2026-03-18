import moment from "moment-timezone";

const DEFAULT_TZ = "Asia/Ho_Chi_Minh";

moment.tz.setDefault(DEFAULT_TZ);

moment.locale("vi");

export const timezone = (...args: any) => {
  if (args.length > 0) {
    return moment(...args).tz(DEFAULT_TZ);
  }
  return moment().tz(DEFAULT_TZ);
};
