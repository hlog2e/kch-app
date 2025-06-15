import React, {
  createContext,
  useEffect,
  useState,
  useContext,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerForPushNotificationsAsync } from "../utils/expo_notification";
import {
  registerPushTokenToDB,
  unRegisterPushTokenToDB,
} from "../apis/push-noti/index";
import { getExpoPushTokenAsync } from "expo-notifications";
import Constants from "expo-constants";
import * as Device from "expo-device";

interface User {
  _id?: string;
  name: string;
  desc: string;
  profilePhoto?: string;
  email?: string;
  verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  // 추가 속성들을 위한 index signature
  [key: string]: any;
}

interface LoginPayload {
  token: any;
  user: User;
}

interface UpdatePayload {
  user: User;
}

interface UserContextValue {
  user: User | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  update: (payload: UpdatePayload) => Promise<void>;
}

export const UserContext = createContext<UserContextValue>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  update: async () => {},
});

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const initalize = async (): Promise<void> => {
    try {
      const _user = await AsyncStorage.getItem("user");
      if (!_user) {
        setUser(null);
        return;
      }
      const parsedUserData: User = JSON.parse(_user);
      setUser(parsedUserData);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async ({ token, user }: LoginPayload): Promise<void> => {
    await AsyncStorage.setItem("token", JSON.stringify(token));
    await AsyncStorage.setItem("user", JSON.stringify(user));

    const pushToken = await registerForPushNotificationsAsync();
    if (pushToken) {
      await registerPushTokenToDB(pushToken);
    }
    setUser(user);
  };

  const update = async ({ user }: UpdatePayload): Promise<void> => {
    await AsyncStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const logout = async (): Promise<void> => {
    // 실제 디바이스 경우 푸시 토큰을 DB에서 지우는 로직
    if (Device.isDevice) {
      const { data: pushToken } = await getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
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
    <UserContext.Provider value={{ user, isLoading, login, logout, update }}>
      {children}
    </UserContext.Provider>
  );
}
