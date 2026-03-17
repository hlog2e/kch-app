module.exports = {
  expo: {
    extra: {
      eas: {
        projectId: "5b77743f-dfb8-4df6-942e-446f6e72ed63",
      },
      forceUpdate: process.env.FORCE_UPDATE,
    },
    name: "금천고등학교",
    scheme: "kch",
    slug: "kch-app",
    version: "3.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    updates: {
      url: "https://u.expo.dev/5b77743f-dfb8-4df6-942e-446f6e72ed63",
      fallbackToCacheTimeout: 0,
    },
    runtimeVersion: { policy: "appVersion" },
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    plugins: [
      "expo-router",
      "@react-native-firebase/app",
      "@react-native-firebase/crashlytics",
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
            forceStaticLinking: ["RNFBApp", "RNFBAnalytics", "RNFBCrashlytics"],
          },
        },
      ],
    ],
    ios: {
      icon: "./assets/ios-icon.icon",
      bundleIdentifier: "me.kch-app.kch",
      supportsTablet: true,
      googleServicesFile: "./GoogleService-Info.plist",
      infoPlist: {
        NSCameraUsageDescription:
          "금천고등학교 앱은 학생증의 바코드를 스캔하기 위하여 카메라 권한이 필요합니다.",
        ITSAppUsesNonExemptEncryption: false,
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
