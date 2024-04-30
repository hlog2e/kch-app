import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import FirstRequestCode from "./LoginStep/FirstRequestCode";
import SecondVerifyCode from "./LoginStep/SecondVerifyCode";
import { postRequestCode, postVerifyCode } from "../../../apis/auth/index";
import { useAlert } from "../../../context/AlertContext";

import { useUser } from "../../../context/UserContext";

export default function LoginScreen({ navigation }) {
  const { login } = useUser();
  const alert = useAlert();

  const [step, setStep] = useState("RequestCode");
  const [data, setData] = useState({
    phoneNumber: "",
    code: "",
  });

  const handleRequestCode = async (_phoneNumber) => {
    // ------ 인증번호 요청 POST ------
    try {
      await postRequestCode(_phoneNumber);
    } catch (error) {
      alert.error(
        error.response.data.message
          ? error.response.data.message
          : "인증번호 발송중 오류가 발생하였습니다!"
      );
    }
  };
  const handleVerifyCodeAndLogin = async (_phoneNumber, _code) => {
    // ------ 인증번호 검증 POST -------
    try {
      const response = await postVerifyCode(_phoneNumber, _code);

      if (response.user) {
        // 이미 가입되어있는 경우
        await login({ token: response.token, user: response.user });
        navigation.replace("Main");
      } else {
        //가입되지 않은 경우
        navigation.replace("Join", {
          phoneNumber: _phoneNumber,
          code: _code,
        });
      }
    } catch (error) {
      alert.error(
        error.response.data.message
          ? error.response.data.message
          : "인증번호 검증중 오류가 발생하였습니다!"
      );
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      {step === "RequestCode" && (
        <FirstRequestCode
          onNext={async (_phoneNumber) => {
            setData((_prev) => {
              return {
                ..._prev,
                phoneNumber: _phoneNumber,
              };
            });
            setStep("VerifyCode");
            await handleRequestCode(_phoneNumber);
          }}
        />
      )}

      {step === "VerifyCode" && (
        <SecondVerifyCode
          data={data}
          back={() => setStep("RequestCode")}
          onNext={async (_code) => {
            setData((_prev) => {
              return { ..._prev, code: _code };
            });

            await handleVerifyCodeAndLogin(data.phoneNumber, _code);
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginHorizontal: 16 },
});
