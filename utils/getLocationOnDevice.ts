import * as Location from "expo-location";
import { Alert } from "react-native";

export default async function getLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    Alert.alert(
      "날씨 오류",
      "앱의 위치 권한이 비활성화 되어있어 날씨를 불러올 수 없습니다. 휴대전화 설정에서 위치 권한을 허용해주세요!",
      [{ text: "확인" }]
    );
    return;
  }
  return await Location.getCurrentPositionAsync({});
}
