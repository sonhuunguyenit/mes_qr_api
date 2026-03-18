import { ExpoConfig, ConfigContext } from "@expo/config";
import { config as loadEnv } from "dotenv";
import path from "path";

const NODE_ENV = process.env.NODE_ENV || "development";
const envPath = path.resolve(__dirname, `.env.${NODE_ENV}`);
const result = loadEnv({ path: envPath, override: true });
const env = result.parsed || {};

export default ({ config }: ConfigContext): ExpoConfig => {
  const APP_VERSION = env.APP_VERSION;

  const expoConfig: ExpoConfig = {
    ...config,
    owner: "ktg-pms",
    name: env.APP_NAME,
    slug: env.APP_SLUG,
    version: APP_VERSION,
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    assetBundlePatterns: ["**/*"],
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
    },
    runtimeVersion: env.APP_RUNTIME_VERSION,
    ios: {
      ...config.ios,
      icon: "./assets/icon.png",
      supportsTablet: false,
      bundleIdentifier: env.IOS_BUNDLE_IDENTIFIER,
      buildNumber: env.IOS_BUILD_NUMBER,
      entitlements: {
        "aps-environment": "production",
      },
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        UIBackgroundModes: ["remote-notification"],
      },
      // googleServicesFile: env.GOOGLE_SERVICES_FILE_IOS,
    },
    android: {
      ...config.android,
      package: env.ANDROID_PACKAGE,
      versionCode: parseInt(env.ANDROID_VERSION_CODE, 10),
      icon: "./assets/icon.png",
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#ffffff",
      },
      // googleServicesFile: env.GOOGLE_SERVICES_FILE_ANDROID,
      softwareKeyboardLayoutMode: "pan",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      NODE_ENV: NODE_ENV,
      API_URL: env.API_URL,
      APP_NAME: env.APP_NAME,
      APP_SLUG: env.APP_SLUG,
      APP_VERSION: env.APP_VERSION,
      APP_RUNTIME_VERSION: env.APP_RUNTIME_VERSION,
      IOS_BUNDLE_IDENTIFIER: env.IOS_BUNDLE_IDENTIFIER,
      IOS_BUILD_NUMBER: env.IOS_BUILD_NUMBER,
      ANDROID_PACKAGE: env.ANDROID_PACKAGE,
      ANDROID_VERSION_CODE: env.ANDROID_VERSION_CODE,
      ENVIRONMENT: env.environment,
      BUILD_NUMBER: env.BUILD_NUMBER,
      SSO_CLIENT_ID: env.SSO_CLIENT_ID,
      SSO_CLIENT_SECRET: env.SSO_CLIENT_SECRET,
      SSO_REDIRECT_URI: env.SSO_REDIRECT_URI,
      eas: {
        projectId: "e41fa6b5-6fe3-4d3c-bff7-2197c5936019",
      },
    },
    updates: {
      enabled: true,
      checkAutomatically: "ON_LOAD",
      fallbackToCacheTimeout: 15000,
      url: "",
    },
    plugins: [
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
            deploymentTarget: "15.1",
            // firebaseIOSSDKVersion: "10.29.0",
          },
          android: {
            compileSdkVersion: 35,
            targetSdkVersion: 35,
            buildToolsVersion: "35.0.0",
            ndkVersion: "27.1.12297006",
            extraProperties: {
              "android.use16KPageSize": "true",
            },
          },
        },
      ],
      // [
      //   "@react-native-firebase/app",
      //   {
      //     useFrameworks: "static",
      //   },
      // ],
      // "@react-native-firebase/messaging",
      // "@react-native-firebase/crashlytics",
      ["@react-native-community/datetimepicker"],
      [
        "expo-font",
        {
          fonts: [
            "./src/assets/fonts/Inter-Regular.ttf",
            "./src/assets/fonts/Inter-Medium.ttf",
            "./src/assets/fonts/Inter-SemiBold.ttf",
            "./src/assets/fonts/Inter-Bold.ttf",
          ],
        },
      ],
      [
        "expo-file-system",
        {
          supportsOpeningDocumentsInPlace: true,
          enableFileSharing: true,
        },
      ],
    ],
  };

  return expoConfig;
};
