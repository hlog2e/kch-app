import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClientProvider, QueryClient } from "react-query";
import RootStack from "./src/navigations/RootStack";
import { UserContext } from "./context/UserContext";
import { useEffect, useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerForPushNotificationsAsync } from "./utils/expo_notification";
import * as Notifications from "expo-notifications";
import Toast, { BaseToast } from "react-native-toast-message";

const queryClient = new QueryClient();

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  //for Expo Notification
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  //async storage 에서 유저 데이터 불러오기
  async function getUserOnAsyncStorage() {
    const _user = await AsyncStorage.getItem("user");
    setUser(_user);
    setIsLoading(false);
  }

  useEffect(() => {
    getUserOnAsyncStorage();
    registerForPushNotificationsAsync().then((_token) => {
      setExpoPushToken(_token);
    });

    //알림이 도착했을때 리스너
    notificationListener.current =
      Notifications.addNotificationReceivedListener((_notification) => {
        setNotification(_notification);
        console.log(_notification);
        Toast.show({
          text1: _notification.request.content.title,
          text2: _notification.request.content.body,
        });
      });
    //사용자가 푸쉬알림에 반응했을 때 리스너
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((_response) => {
        console.log("리스폰스", _response);
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
        <UserContext.Provider value={{ user, setUser, isLoading }}>
          <RootStack />
        </UserContext.Provider>
        <StatusBar />
        <Toast config={toastConfig} />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
