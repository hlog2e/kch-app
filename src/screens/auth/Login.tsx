import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FirstRequestCode from "./LoginStep/FirstRequestCode";
import SecondVerifyCode from "./LoginStep/SecondVerifyCode";
import { postRequestCode, postVerifyCode } from "../../../apis/auth/index";
import { useAlert } from "../../../context/AlertContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useUser } from "../../../context/UserContext";

interface LoginData {
  phoneNumber: string;
  code: string;
}

export default function LoginScreen({ navigation }: any) {
  const { login } = useUser();
  const alert = useAlert();

  const [step, setStep] = useState<"RequestCode" | "VerifyCode">("RequestCode");
  const [data, setData] = useState<LoginData>({
    phoneNumber: "",
    code: "",
  });

  const handleRequestCode = async (phoneNumber: string): Promise<void> => {
    try {
      await postRequestCode(phoneNumber);
    } catch (error: any) {
      alert.error(
        error?.response?.data?.message ||
          "인증번호 발송중 오류가 발생하였습니다!"
      );
    }
  };

  const handleVerifyCodeAndLogin = async (
    phoneNumber: string,
    code: string
  ): Promise<void> => {
    try {
      const response = await postVerifyCode(phoneNumber, code);

      if (response.user) {
        // 이미 가입되어있는 경우
        await login({ token: response.token, user: response.user });
        navigation.replace("Main");
      } else {
        //가입되지 않은 경우
        navigation.replace("Join", {
          phoneNumber: phoneNumber,
          code: code,
        });
      }
    } catch (error: any) {
      alert.error(
        error?.response?.data?.message ||
          "인증번호 검증중 오류가 발생하였습니다!"
      );
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      {step === "RequestCode" && (
        <FirstRequestCode
          onNext={async (phoneNumber: string) => {
            setData((prev) => ({
              ...prev,
              phoneNumber: phoneNumber,
            }));
            setStep("VerifyCode");
            await handleRequestCode(phoneNumber);
          }}
        />
      )}

      {step === "VerifyCode" && (
        <SecondVerifyCode
          back={() => setStep("RequestCode")}
          onNext={async (code: string) => {
            setData((prev) => ({ ...prev, code: code }));
            await handleVerifyCodeAndLogin(data.phoneNumber, code);
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginHorizontal: 16 },
});
