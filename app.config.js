import * as dotenv from "dotenv";
dotenv.config();

module.exports = {
  expo: {
    extra: {
      eas: {
        projectId: "5b77743f-dfb8-4df6-942e-446f6e72ed63",
      },
      apiUrl: process.env.API_SERVER,
    },
    name: "kch-app",
    scheme: "kch",
    slug: "kch-app",
    version: "1.0.1",
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
    },
    android: {
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
