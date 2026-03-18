import * as FileSystem from "expo-file-system";
import moment from "moment";

export const logger = (...data: any[]) => {
  let alias: string | undefined;
  let logData: any[];

  if (typeof data[0] === "string" && data.length > 1) {
    alias = data[0];
    logData = data.slice(1);
  } else {
    logData = data;
  }

  let jsonOutput: string;
  try {
    if (
      logData.length === 1 &&
      typeof logData[0] === "object" &&
      logData[0] !== null
    ) {
      jsonOutput = JSON.stringify(logData[0], null, 2);
    } else {
      jsonOutput = JSON.stringify(logData, null, 2);
    }
  } catch (e) {
    jsonOutput = String(logData);
  }

  if (alias) {
    console.log(`===Logger ${alias}===\n${jsonOutput}`);
  } else {
    console.log(jsonOutput);
  }
};

export const logFile = async (
  fileName: string,
  clearOld: boolean = true,
  ...data: any[]
): Promise<void> => {
  if (!__DEV__) return;

  let alias: string | undefined;
  let logData: any[];

  if (typeof data[0] === "string" && data.length > 1) {
    alias = data[0];
    logData = data.slice(1);
  } else {
    logData = data;
  }

  let jsonOutput: string;
  try {
    if (
      logData.length === 1 &&
      typeof logData[0] === "object" &&
      logData[0] !== null
    ) {
      jsonOutput = JSON.stringify(logData[0], null, 2);
    } else {
      jsonOutput = JSON.stringify(logData, null, 2);
    }
  } catch (e) {
    jsonOutput = String(logData);
  }

  const formattedOutput = alias
    ? `===Logger ${alias}===\n${jsonOutput}`
    : jsonOutput;
  const timestamp = moment.utc().format("YYYY-MM-DD HH:mm:ss [UTC]");
  const logEntry = `\n\n\n${"═".repeat(50)}\n[${timestamp}]\n${formattedOutput}\n\n\n`;

  const resolvedPath = `${FileSystem.documentDirectory}${
    fileName.endsWith(".txt") ? fileName : `${fileName}.txt`
  }`;

  try {
    if (clearOld) {
      await FileSystem.writeAsStringAsync(resolvedPath, logEntry);
    } else {
      const fileInfo = await FileSystem.getInfoAsync(resolvedPath);
      if (fileInfo.exists) {
        const existing = await FileSystem.readAsStringAsync(resolvedPath);
        await FileSystem.writeAsStringAsync(resolvedPath, existing + logEntry);
      } else {
        await FileSystem.writeAsStringAsync(resolvedPath, logEntry);
      }
    }

    console.log(`logFile saved: ${resolvedPath}`);
  } catch (e) {
    console.error("logFile error:", e);
  }
};

export const getLogPath = (fileName: string) => {
  const path = `${FileSystem.documentDirectory}${
    fileName.endsWith(".txt") ? fileName : `${fileName}.txt`
  }`;
  console.log("Log path:", path);
  return path;
};
