const StringHelper = {
  trim: (str: string): string => {
    return str.trim();
  },

  toUpperCase: (str: string): string => {
    return str.toUpperCase();
  },

  toLowerCase: (str: string): string => {
    return str.toLowerCase();
  },

  capitalizeWords: (str: string): string => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  },

  capitalizeFirstLetter: (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  replaceAll: (str: string, target: string, replacement: string): string => {
    return str.split(target).join(replacement);
  },

  contains: (str: string, search: string): boolean => {
    return str.toLowerCase().includes(search.toLowerCase());
  },

  isEmpty: (str: string): boolean => {
    return !str || str.trim().length === 0;
  },

  toSlug: (str: string): string => {
    return str
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");
  },

  toTitleCase: (str: string): string => {
    return str.toLowerCase().replace(/\b(\w)/g, (char) => char.toUpperCase());
  },

  reverse: (str: string): string => {
    return str.split("").reverse().join("");
  },

  padWithZeroes: (str: string, length: number): string => {
    return str.padStart(length, "0");
  },

  format: (str: string, values: Record<string, string>): string => {
    return str.replace(/{(.*?)}/g, (_, key) => values[key] || "");
  },

  toCamelCase: (str: string): string => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
        index === 0 ? match.toLowerCase() : match.toUpperCase(),
      )
      .replace(/\s+/g, "");
  },

  toSnakeCase: (str: string): string => {
    return str.replace(/\s+/g, "_").toLowerCase();
  },

  isValidEmail: (str: string): boolean => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(str);
  },

  toNumber: (str: string): number => {
    const num = Number(str);
    return isNaN(num) ? NaN : num;
  },

  randomString: (length: number): string => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  },
};

export default StringHelper;
