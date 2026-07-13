import { ExpoConfig, ConfigContext } from "@expo/config";
import { config as loadEnv } from "dotenv";
import path from "path";

const NODE_ENV = process.env.NODE_ENV || "development";
const envPath = path.resolve(__dirname, `.env.${NODE_ENV}`);
const result = loadEnv({ path: envPath, override: true });
const env = result.parsed || {};

export default ({ config }: ConfigContext): ExpoConfig => {
  const APP_VERSION = env.APP_VERSION || "1.0.0";

  const expoConfig: ExpoConfig = {
    ...config,
    owner: env.EXPO_OWNER || "ktg-pms",
    name: env.APP_NAME || "KTG",
    slug: env.APP_SLUG || "pms",
    scheme: "ktgpms",
    version: APP_VERSION,
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: false,
    assetBundlePatterns: ["**/*"],
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
    },
    notification: {
      icon: "./assets/icon.png",
      color: "#ffffff",
    },
    runtimeVersion: env.APP_RUNTIME_VERSION || "1.0.0",
    ios: {
      ...config.ios,
      icon: "./assets/icon.png",
      supportsTablet: false,
      bundleIdentifier: env.IOS_BUNDLE_IDENTIFIER || "com.ktg.pms.pro",
      associatedDomains: ["applinks:uatadmin-pms.kimtingroup.com"],
      buildNumber: env.IOS_BUILD_NUMBER || "1",
      entitlements: {
        "aps-environment": "production",
      },
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        UIBackgroundModes: ["remote-notification"],
      },
      googleServicesFile:
        env.GOOGLE_SERVICES_FILE_IOS ||
        "./src/@config/ios/production/GoogleService-Info.plist",
    },
    android: {
      ...config.android,
      package: env.ANDROID_PACKAGE || "com.ktg.pms.pro",
      versionCode: parseInt(env.ANDROID_VERSION_CODE || "1", 10),
      icon: "./assets/icon.png",
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#ffffff",
      },
      googleServicesFile:
        env.GOOGLE_SERVICES_FILE_ANDROID ||
        "./src/@config/android/production/google-services.json",
      softwareKeyboardLayoutMode: "pan",
      edgeToEdgeEnabled: true,
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: "https",
              host: "uatadmin-pms.kimtingroup.com",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
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
        projectId: "c1ab6665-2706-4d71-8aae-19548f472996",
      },
    },
    updates: {
      enabled: true,
      checkAutomatically: "ON_LOAD",
      fallbackToCacheTimeout: 15000,
      url: "https://u.expo.dev/c1ab6665-2706-4d71-8aae-19548f472996",
    },
    plugins: [
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
            deploymentTarget: "15.1",
            firebaseIOSSDKVersion: "10.29.0",
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
      [
        "@react-native-firebase/app",
        {
          useFrameworks: "static",
        },
      ],
      "@react-native-firebase/messaging",
      "@react-native-firebase/crashlytics",
      ["@react-native-community/datetimepicker"],
      [
        "expo-font",
        {
          fonts: [
            "./src/assets/fonts/Inter-Regular.ttf",
            "./src/assets/fonts/Inter-Medium.ttf",
            "./src/assets/fonts/Inter-SemiBold.ttf",
            "./src/assets/fonts/Inter-Bold.ttf",
            "./src/assets/fonts/Inter-ExtraBold.ttf",
            "./src/assets/fonts/Inter-Black.ttf",
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
