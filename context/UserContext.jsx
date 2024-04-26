import { createContext, useEffect, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerForPushNotificationsAsync } from "../utils/expo_notification";
import {
  registerPushTokenToDB,
  unRegisterPushTokenToDB,
} from "../apis/push-noti";
import { getExpoPushTokenAsync } from "expo-notifications";
import Constants from "expo-constants";
import * as Device from "expo-device";

export const UserContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  update: () => {},
});

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const initalize = async () => {
    const _user = await AsyncStorage.getItem("user");

    if (!_user) return setUser(null);
    const parsedUserData = JSON.parse(_user);
    setUser(parsedUserData);
  };

  const login = async ({ token, user }) => {
    await AsyncStorage.setItem("token", JSON.stringify(token));
    await AsyncStorage.setItem("user", JSON.stringify(user));

    const pushToken = await registerForPushNotificationsAsync();
    if (pushToken) {
      await registerPushTokenToDB(pushToken);
    }
    setUser(user);
  };

  const update = async ({ user }) => {
    await AsyncStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const logout = async () => {
    // 실제 디바이스 경우 푸시 토큰을 DB에서 지우는 로직
    if (Device.isDevice) {
      const { data: pushToken } = await getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      });
      await unRegisterPushTokenToDB(pushToken);
    }

    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    initalize();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        update,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
