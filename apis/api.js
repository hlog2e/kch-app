import axios from "axios";
import { Alert } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

export const apiInstance = axios.create({
  baseURL: "http://10.0.193.33:3001",
});

export const apiAuthInstance = axios.create({
  baseURL: "http://10.0.193.33:3001",
});

// Auth api 인터셉터
apiAuthInstance.interceptors.request.use(
  async function (config) {
    const token = await AsyncStorage.getItem("token");
    config.headers.Authorization = token;

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
