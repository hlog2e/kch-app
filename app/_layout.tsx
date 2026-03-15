import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { UserProvider } from "../context/UserContext";
import { AlertProvider } from "../context/AlertContext";
import * as Notifications from "expo-notifications";
import * as Updates from "expo-updates";
import Toast, { BaseToast } from "react-native-toast-message";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import { Notification, NotificationResponse } from "expo-notifications";
import { Stack } from "expo-router";
import React, { useEffect, useRef } from "react";
import ErrorBoundary from "react-native-error-boundary";
import ErrorFallback from "../src/components/ErrorBoundary/ErrorFallback";
import NavigationTracker from "../src/components/NavigationTracker";
import ForceUpdateChecker from "../src/components/ForceUpdateChecker";
import { recordError, setCrashlyticsAttribute } from "../utils/firebase";
import moment from "moment";
import "moment/locale/ko";

moment.locale("ko");
import {
  ThemeProvider,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error) => {
        recordError(
          error instanceof Error ? error : new Error(String(error)),
          "ReactQuery mutation error"
        );
      },
    },
  },
});

// Custom light theme based on original RootStack
const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#ffffff",
    text: "black",
    subText: "gray",
    icon: "black",
    border: "#e2e8f0",
    cardBg: "white",
    cardBg2: "#f4f4f4",
    blue: "#3b82f6",
    red: "#CF5858",
  },
};

// Custom dark theme based on original RootStack
const darkTheme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    background: "#000000",
    text: "#ffffff",
    subText: "gray",
    icon: "#ffffff",
    border: "#27272a",
    cardBg: "black",
    cardBg2: "#212121",
    blue: "#3b82f6",
    red: "#CF5858",
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  //for Expo Notification ----
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  //--------------------------

  useEffect(() => {
    //알림이 도착했을때 리스너
    notificationListener.current =
      Notifications.addNotificationReceivedListener(
        (notification: Notification) => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

          Toast.show({
            text1: notification.request.content.title ?? undefined,
            text2: notification.request.content.body ?? undefined,
            onPress: () => {
              const link = notification.request.content.data.link as
                | string
                | undefined;
              if (link) {
                Linking.openURL(link);
              }
            },
          });
        }
      );
    //사용자가 푸쉬알림에 반응했을 때 리스너
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        (response: NotificationResponse) => {
          const link = response.notification.request.content.data.link as
            | string
            | undefined;
          if (link) {
            Linking.openURL(link);
          }
        }
      );

    if (Updates.updateId) {
      setCrashlyticsAttribute("ota_update_id", Updates.updateId);
    }

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: "#0016B2", marginTop: 20 }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 16,
          fontWeight: "600",
        }}
        text2Style={{ fontSize: 14 }}
      />
    ),
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, stack) => {
        console.error("[ErrorBoundary]", error, stack);
        recordError(error, `ErrorBoundary: ${stack}`);
      }}
    >
      <ThemeProvider value={colorScheme === "dark" ? darkTheme : lightTheme}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <AlertProvider>
              <UserProvider>
                <Stack
                  screenOptions={{
                    headerShown: false,
                  }}
                >
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(auth)"
                    options={{ headerShown: false }}
                  />
                </Stack>
                <NavigationTracker />
                <ForceUpdateChecker />
              </UserProvider>
            </AlertProvider>

            <StatusBar />
            <Toast config={toastConfig} />
          </SafeAreaProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
