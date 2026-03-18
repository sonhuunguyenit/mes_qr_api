const NumberHelper = {
  toFixed: (num: number, decimals: number = 2): string => {
    return num.toFixed(decimals);
  },

  toCurrency: (num: number, currencySymbol: string = "$"): string => {
    return `${currencySymbol}${num.toLocaleString()}`;
  },

  toVND: (str: string | number, currency: string = "VND"): string => {
    let value = str ? str.toString() : "";
    let preValue = value.indexOf("-") !== -1 ? "-" : "";

    if (value.length > 0) {
      if (value.indexOf("0") === 0 && value.length > 1) value = value.slice(1);
      if (value.indexOf(",") !== -1) {
        value = value.replace(",", "");
      }

      return `${preValue} ${value
        .replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")} ${currency}`;
    }

    return "";
  },

  toNumber: (str: string): number => {
    const num = Number(str);
    return isNaN(num) ? NaN : num;
  },

  round: (num: number): number => {
    return Math.round(num);
  },

  floor: (num: number): number => {
    return Math.floor(num);
  },

  ceil: (num: number): number => {
    return Math.ceil(num);
  },

  randomInRange: (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  add: (num1: number, num2: number): number => {
    return isNaN(num1) || isNaN(num2) ? NaN : num1 + num2;
  },

  subtract: (num1: number, num2: number): number => {
    return isNaN(num1) || isNaN(num2) ? NaN : num1 - num2;
  },

  multiply: (num1: number, num2: number): number => {
    return isNaN(num1) || isNaN(num2) ? NaN : num1 * num2;
  },

  divide: (num1: number, num2: number): number => {
    if (isNaN(num1) || isNaN(num2) || num2 === 0) return NaN;
    return num1 / num2;
  },

  clamp: (num: number, min: number, max: number): number => {
    return Math.min(Math.max(num, min), max);
  },

  toPercentage: (num: number): string => {
    return `${(num * 100).toFixed(2)}%`;
  },

  isInteger: (num: number): boolean => {
    return Number.isInteger(num);
  },

  isFloat: (num: number): boolean => {
    return !Number.isInteger(num);
  },

  isPositive: (num: number): boolean => {
    return num > 0;
  },

  isNegative: (num: number): boolean => {
    return num < 0;
  },

  isEven: (num: number): boolean => {
    return num % 2 === 0;
  },

  isOdd: (num: number): boolean => {
    return num % 2 !== 0;
  },

  factorial: (num: number): number => {
    if (num < 0) return NaN;
    if (num === 0 || num === 1) return 1;
    return num * NumberHelper.factorial(num - 1);
  },

  power: (base: number, exponent: number): number => {
    return Math.pow(base, exponent);
  },

  sqrt: (num: number): number => {
    return Math.sqrt(num);
  },

  abs: (num: number): number => {
    return Math.abs(num);
  },

  toFixedString: (num: number, decimals: number): string => {
    return num.toFixed(decimals);
  },

  parseNumber: (str: string): number => {
    const parsed = parseFloat(str);
    return isNaN(parsed) ? 0 : parsed;
  },
  getDistance: (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    unit: "km" | "m" = "km"
  ): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return unit === "m" ? distance * 1000 : distance;
  },
};

export default NumberHelper;
