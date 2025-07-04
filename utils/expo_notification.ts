import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform, Alert } from "react-native";
import Constants from "expo-constants";

//
export async function registerForPushNotificationsAsync(): Promise<
  string | undefined
> {
  let token: string | undefined;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert(
        "알림",
        "알림 권한이 비활성화 되어있습니다. 설정에서 알림 권한을 허용해주세요!",
        [{ text: "확인" }]
      );
      return;
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) {
      Alert.alert(
        "설정 오류",
        "프로젝트 설정에서 projectId를 찾을 수 없습니다.",
        [{ text: "확인" }]
      );
      return;
    }

    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: projectId,
      })
    ).data;
  } else {
    Alert.alert(
      "알림",
      "애뮬레이터 기기에서는 푸시 알림을 이용할 수 없습니다.",
      [{ text: "확인" }]
    );
  }

  return token;
}
