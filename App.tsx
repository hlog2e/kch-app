import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClientProvider, QueryClient } from "react-query";
import RootStack from "./src/navigations/RootStack";
import { UserProvider } from "./context/UserContext";
import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import Toast, { BaseToast } from "react-native-toast-message";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import { AlertProvider } from "./context/AlertContext";
import { Notification, NotificationResponse } from "expo-notifications";

const queryClient = new QueryClient();

export default function App() {
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

    return () => {
      if (notificationListener.current)
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      if (responseListener.current)
        Notifications.removeNotificationSubscription(responseListener.current);
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
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AlertProvider>
          <UserProvider>
            <RootStack />
          </UserProvider>
        </AlertProvider>

        <StatusBar />
        <Toast config={toastConfig} />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
