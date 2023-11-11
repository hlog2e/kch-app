import axios from "axios";
import { Alert } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate } from "../src/navigations/RootNavigation";

const baseUrl = process.env.EXPO_PUBLIC_API_SERVER;

export const apiInstance = axios.create({
  baseURL: baseUrl,
});

export const apiAuthInstance = axios.create({
  baseURL: baseUrl,
});

// Auth api 인터셉터
apiAuthInstance.interceptors.request.use(
  async function (config) {
    const token = await AsyncStorage.getItem("token");
    config.headers.Authorization = `Bearer ${JSON.parse(token)}`;

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Non-Auth api 인터셉터
apiInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (!error.response) {
      Alert.alert(
        "오류",
        "서버와의 연결이 불안정합니다. 나중에 다시 시도해 주세요. (503)",
        [{ text: "확인" }]
      );
    }

    return Promise.reject(error);
  }
);

// Auth api 인터셉터
apiAuthInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    if (error.response.data.status === 401) {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");
      Alert.alert(
        "인증 오류",
        "인증이 만료되었습니다. 다시 로그인 해주세요! (401)",
        [{ text: "확인" }]
      );
      navigate("Auth");
    }
    if (!error.response) {
      Alert.alert(
        "오류",
        "서버와의 연결이 불안정합니다. 나중에 다시 시도해 주세요. (503)",
        [{ text: "확인" }]
      );
    }

    return Promise.reject(error);
  }
);
