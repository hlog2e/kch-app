// @ts-nocheck
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import SecondNameAndYearInput from "./JoinStep/SecondNameAndYearInput";
import { postJoin } from "../../../apis/auth/index";
import { registerForPushNotificationsAsync } from "../../../utils/expo_notification";
import { registerPushTokenToDB } from "../../../apis/push-noti/index";
import { useUser } from "../../../context/UserContext";
import { useAlert } from "../../../context/AlertContext";
import { useLocalSearchParams, useRouter } from "expo-router";

export type UserType =
  | "undergraduate"
  | "teacher"
  | "graduate"
  | "parents/outsider";

export default function JoinScreen() {
  const { login } = useUser();
  const { colors } = useTheme();
  const alert = useAlert();
  const router = useRouter();
  const params = useLocalSearchParams<{
    phoneNumber?: string;
    code?: string;
  }>();

  const { phoneNumber, code } = params || {};

  const handleJoin = async (name: string) => {
    try {
      const response = await postJoin({
        phoneNumber: phoneNumber ?? "",
        code: code ?? "",
        type: "parents/outsider",
        name,
      });
      await login({ token: response.token, user: response.user });
      router.replace("/home");
      const pushToken = await registerForPushNotificationsAsync();
      if (pushToken) {
        await registerPushTokenToDB(pushToken);
      }
    } catch (error: any) {
      alert.error(
        error?.response?.data?.message || "회원가입 중 오류가 발생하였습니다!"
      );
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={[styles.container, { backgroundColor: colors.background }]}>
      <SecondNameAndYearInput
        type="parents/outsider"
        isNeedYear={false}
        onNext={async ({ name }) => {
          await handleJoin(name);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginHorizontal: 16 },
});
