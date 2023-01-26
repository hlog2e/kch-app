import * as dotenv from "dotenv";
dotenv.config();

module.exports = {
  expo: {
    extra: {
      eas: {
        projectId: "5b77743f-dfb8-4df6-942e-446f6e72ed63",
      },
      apiUrl: process.env.API_SERVER,
      devApiUrl: process.env.DEV_API_SERVER,
    },
    name: "금천고등학교",
    scheme: "kch",
    slug: "kch-app",
    version: "1.0.6",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    updates: {
      url: "https://u.expo.dev/5b77743f-dfb8-4df6-942e-446f6e72ed63",
      fallbackToCacheTimeout: 0,
    },
    runtimeVersion: { policy: "sdkVersion" },
    assetBundlePatterns: ["**/*"],
    ios: {
      bundleIdentifier: "me.kch-app.kch",
      supportsTablet: true,
      infoPlist: {
        NSCameraUsageDescription:
          "금천고등학교 앱은 학생증의 바코드를 스캔하기 위하여 카메라 권한이 필요합니다.",
      },
    },
    android: {
      versionCode: 5,
      googleServicesFile: "./google-services.json",
      package: "me.kch_app.kch",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
  },
};
