import axios from "axios";
import { Alert } from "react-native";

export const apiInstance = axios.create({
  baseURL: "http://192.168.1.182:3001",
});

apiInstance.interceptors.request.use(
  function (config) {
    // 요청이 전달되기 전에 작업 수행
    return config;
  },
  function (error) {
    // 요청 오류가 있는 작업 수행
    return Promise.reject(error);
  }
);

apiInstance.interceptors.response.use(
  function (response) {
    // 2xx 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
    // 응답 데이터가 있는 작업 수행
    return response;
  },
  function (error) {
    // 2xx 외의 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
    // 응답 오류가 있는 작업 수행

    //서버의 응답이 없을때 실행하는 인터셉터
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
