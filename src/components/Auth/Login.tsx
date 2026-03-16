import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import FirstRequestCode from "./LoginStep/FirstRequestCode";
import SecondVerifyCode from "./LoginStep/SecondVerifyCode";
import { postRequestCode, postVerifyCode } from "../../../apis/auth/index";
import { useAlert } from "../../../context/AlertContext";
import { useUser } from "../../../context/UserContext";
import { useRouter } from "expo-router";
import { logLogin, logSignUp } from "../../../utils/firebase";

interface LoginData {
  phoneNumber: string;
  code: string;
}

export default function LoginScreen() {
  const { login } = useUser();
  const { colors } = useTheme();
  const alert = useAlert();
  const router = useRouter();

  const [step, setStep] = useState<"RequestCode" | "VerifyCode">("RequestCode");
  const [data, setData] = useState<LoginData>({ phoneNumber: "", code: "" });
  const [verifyStatus, setVerifyStatus] = useState<
    "idle" | "verifying" | "success" | "error"
  >("idle");

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
    setVerifyStatus("verifying");
    try {
      const response = await postVerifyCode(phoneNumber, code);
      setVerifyStatus("success");

      // success 애니메이션이 보이도록 딜레이
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (response.user) {
        // 이미 가입된 경우
        await logLogin("phone_otp");
        await login({ token: response.token, user: response.user });
        router.replace("/home");
      } else {
        // 가입되지 않은 경우
        await logSignUp("phone_otp");
        router.push({
          pathname: "./join",
          params: { phoneNumber, code },
        });
      }
    } catch (error: any) {
      setVerifyStatus("error");
      alert.error(
        error?.response?.data?.message ||
          "인증번호 검증중 오류가 발생하였습니다!"
      );
      setTimeout(() => setVerifyStatus("idle"), 600);
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={[styles.container, { backgroundColor: colors.background }]}>
      {step === "RequestCode" && (
        <FirstRequestCode
          onNext={async (phoneNumber: string) => {
            setData((prev) => ({ ...prev, phoneNumber }));
            setStep("VerifyCode");
            await handleRequestCode(phoneNumber);
          }}
        />
      )}

      {step === "VerifyCode" && (
        <SecondVerifyCode
          phoneNumber={data.phoneNumber}
          verifyStatus={verifyStatus}
          back={() => setStep("RequestCode")}
          onNext={async (code: string) => {
            setData((prev) => ({ ...prev, code }));
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
