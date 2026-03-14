import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { Alert } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { crashlyticsLog, recordError } from "../utils/firebase";

const baseUrl = process.env.EXPO_PUBLIC_API_SERVER;

export const apiInstance = axios.create({
  baseURL: baseUrl,
});

export const apiAuthInstance = axios.create({
  baseURL: baseUrl,
});

// Auth api 인터셉터
apiAuthInstance.interceptors.request.use(
  async function (config: InternalAxiosRequestConfig) {
    const token = await AsyncStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Non-Auth api 인터셉터
apiInstance.interceptors.response.use(
  function (response: AxiosResponse) {
    return response;
  },
  function (error) {
    const url = error?.config?.url ?? "unknown";
    const method = error?.config?.method ?? "unknown";
    const status = error?.response?.status ?? "no_response";
    crashlyticsLog(`API Error: ${method.toUpperCase()} ${url} -> ${status}`);
    recordError(
      error instanceof Error ? error : new Error(String(error)),
      `Axios[apiInstance] ${method} ${url} status=${status}`
    );

    return Promise.reject(error);
  }
);

// Auth api 인터셉터
apiAuthInstance.interceptors.response.use(
  function (response: AxiosResponse) {
    return response;
  },
  async function (error) {
    const url = error?.config?.url ?? "unknown";
    const method = error?.config?.method ?? "unknown";
    const status = error?.response?.status ?? "no_response";

    if (status !== 401) {
      crashlyticsLog(
        `Auth API Error: ${method.toUpperCase()} ${url} -> ${status}`
      );
      recordError(
        error instanceof Error ? error : new Error(String(error)),
        `Axios[apiAuthInstance] ${method} ${url} status=${status}`
      );
    }

    if (error.response && error.response.data?.status === 401) {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");
      Alert.alert(
        "인증 오류",
        "인증이 만료되었습니다. 다시 로그인 해주세요! (401)",
        [{ text: "확인" }]
      );
      router.replace("/login");
    }

    return Promise.reject(error);
  }
);
