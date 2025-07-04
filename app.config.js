module.exports = {
  expo: {
    extra: {
      eas: {
        projectId: "5b77743f-dfb8-4df6-942e-446f6e72ed63",
      },
    },
    name: "금천고등학교",
    scheme: "kch",
    slug: "kch-app",
    version: "2.0.4",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
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
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#ffffff",
          image: "./assets/splash.png",
          imageWidth: 200,
          resizeMode: "contain",
        },
      ],
    ],
    ios: {
      bundleIdentifier: "me.kch-app.kch",
      supportsTablet: true,
      infoPlist: {
        NSCameraUsageDescription:
          "금천고등학교 앱은 학생증의 바코드를 스캔하기 위하여 카메라 권한이 필요합니다.",
      },
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
      bundler: "metro",
    },
  },
};
