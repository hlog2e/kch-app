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
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import { registerPushTokenToDB } from "./apis/push-noti";

const queryClient = new QueryClient();

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  //for Expo Notification ----
  const [expoPushToken, setExpoPushToken] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();
  //--------------------------

  //async storage 에서 유저 데이터 불러오기
  async function getUserOnAsyncStorage() {
    const _user = await AsyncStorage.getItem("user");
    setUser(_user);
    setIsLoading(false);
  }

  useEffect(() => {
    getUserOnAsyncStorage();
    //Expo Push Token 을 얻은 후 DB에 POST
    registerForPushNotificationsAsync().then((_token) => {
      setExpoPushToken(_token);
      registerPushTokenToDB(_token).catch((err) =>
        alert("푸쉬 알림서비스 등록을 실패하였습니다.")
      );
    });

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
        <UserContext.Provider value={{ user, setUser, isLoading }}>
          <RootStack />
        </UserContext.Provider>
        <StatusBar />
        <Toast config={toastConfig} />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
