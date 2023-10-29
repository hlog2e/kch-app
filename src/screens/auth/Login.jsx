import { SafeAreaView, StyleSheet, Text } from "react-native";
import { useContext, useState } from "react";
import FirstRequestCode from "./\bLoginStep/FirstRequestCode";
import SecondVerifyCode from "./\bLoginStep/SecondVerifyCode";
import { postRequestCode, postVerifyCode } from "../../../apis/auth";
import CustomAlert from "../../components/common/CustomAlert";
import { UserContext } from "../../../context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerForPushNotificationsAsync } from "../../../utils/expo_notification";
import { registerPushTokenToDB } from "../../../apis/push-noti";

export default function LoginScreen({ navigation }) {
  const [step, setStep] = useState("RequestCode");
  const [data, setData] = useState({
    phoneNumber: "",
    code: "",
  });
  const [alertData, setAlertData] = useState({
    show: false,
    status: null,
    message: "",
  });

  const { setUser } = useContext(UserContext);
  return (
    <>
      <CustomAlert
        show={alertData.show}
        status={alertData.status}
        message={alertData.message}
        onClose={() =>
          setAlertData({
            show: false,
            status: null,
            message: "",
          })
        }
      />
      <SafeAreaView style={styles.container}>
        {step === "RequestCode" && (
          <FirstRequestCode
            onNext={async (_phoneNumber) => {
              setData((_prev) => {
                return {
                  ..._prev,
                  phoneNumber: _phoneNumber,
                };
              });

              // ------ 인증번호 요청 POST ------
              try {
                await postRequestCode(_phoneNumber);
                setStep("VerifyCode");
              } catch (err) {
                setAlertData({
                  status: "error",
                  message: err.response.data.message
                    ? err.response.data.message
                    : "인증번호 발송중 오류가 발생하였습니다!",
                });
              }
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

              // ------ 인증번호 검증 POST -------
              try {
                const response = await postVerifyCode(data.phoneNumber, _code);

                if (response.user) {
                  // 이미 가입되어있는 경우
                  await AsyncStorage.setItem(
                    "token",
                    JSON.stringify(response.token)
                  );
                  await AsyncStorage.setItem(
                    "user",
                    JSON.stringify(response.user)
                  );
                  setUser(response.user);

                  const pushToken = await registerForPushNotificationsAsync();
                  if (pushToken) {
                    await registerPushTokenToDB(pushToken);
                  }
                } else {
                  //가입되지 않은 경우
                  navigation.replace("Join");
                }
              } catch (err) {
                setAlertData({
                  show: true,
                  status: "error",
                  message: err.response.data.message
                    ? err.response.data.message
                    : "인증번호 검증중 오류가 발생하였습니다!",
                });
              }
            }}
          />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginHorizontal: 16 },
});
