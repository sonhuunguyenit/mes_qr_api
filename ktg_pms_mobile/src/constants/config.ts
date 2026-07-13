import Constants from "expo-constants";

const expo: any = Constants.expoConfig?.extra ?? {};

export const CONFIG = {
  NODE_ENV: expo.NODE_ENV ?? "development",

  API_URL: "https://uat-pms.kimtingroup.com:8081", // http://192.168.2.96:3400 https://uat-pms.kimtingroup.com:8081

  APP_NAME: expo.APP_NAME ?? "",

  APP_SLUG: expo.APP_SLUG ?? "",

  APP_VERSION: expo.APP_VERSION ?? "1.0.0",

  IOS_BUNDLE_IDENTIFIER: expo.IOS_BUNDLE_IDENTIFIER ?? "",

  IOS_BUILD_NUMBER: expo.IOS_BUILD_NUMBER ?? "1",

  ANDROID_PACKAGE: expo.ANDROID_PACKAGE ?? "",

  ANDROID_VERSION_CODE: expo.ANDROID_VERSION_CODE ?? "1",

  ENVIRONMENT: expo.environment ?? "development",

  BUILD_NUMBER: expo.BUILD_NUMBER ?? "1",

  IS_SIMULATOR:
    Constants.executionEnvironment === "storeClient" ||
    Constants.executionEnvironment === "standalone"
      ? false
      : true,
};
