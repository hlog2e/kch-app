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

const queryClient = new QueryClient();

export default function App() {
  //for Expo Notification ----
  const notificationListener = useRef();
  const responseListener = useRef();
  //--------------------------

  useEffect(() => {
    //알림이 도착했을때 리스너
    notificationListener.current =
      Notifications.addNotificationReceivedListener((_notification) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        Toast.show({
          text1: _notification.request.content.title,
          text2: _notification.request.content.body,
          onPress: () => {
            if (_notification.request.content.data.link) {
              Linking.openURL(_notification.request.content.data.link);
            }
          },
        });
      });
    //사용자가 푸쉬알림에 반응했을 때 리스너
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((_response) => {
        if (_response.notification.request.content.data.link) {
          Linking.openURL(_response.notification.request.content.data.link);
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const toastConfig = {
    success: (props) => (
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
