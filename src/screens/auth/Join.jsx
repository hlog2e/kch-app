import { SafeAreaView, View, StyleSheet } from "react-native";
import FirstType from "./JoinStep/FirstType";
import { useEffect, useState, useContext } from "react";
import SecondNameAndYearInput from "./JoinStep/SecondNameAndYearInput";
import CustomAlert from "../../components/common/CustomAlert";
import { postJoin } from "../../../apis/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerForPushNotificationsAsync } from "../../../utils/expo_notification";
import { registerPushTokenToDB } from "../../../apis/push-noti";
import { UserContext } from "../../../context/UserContext";

export default function JoinScreen({ route, navigation }) {
  const { setUser } = useContext(UserContext);
  const { phoneNumber, code } = route.params || {
    phoneNumber: "01095645490",
    code: "1234",
  };
  const [step, setStep] = useState("TypeSelect");
  const [userData, setUserData] = useState({
    type: null,
    name: null,
    birthYear: null,
  });
  const [alertData, setAlertData] = useState({
    show: false,
    status: null,
    message: "",
  });

  // userData에 phoneNumber, code 병합
  useEffect(() => {
    setUserData((_prev) => {
      return { ..._prev, phoneNumber: phoneNumber, code: code };
    });
  }, [route.params]);

  const handleJoin = async (_userData) => {
    try {
      const response = await postJoin({ ..._userData });

      await AsyncStorage.setItem("token", JSON.stringify(response.token));
      await AsyncStorage.setItem("user", JSON.stringify(response.user));
      setUser(response.user);

      const pushToken = await registerForPushNotificationsAsync();
      if (pushToken) {
        await registerPushTokenToDB(pushToken);
      }
    } catch (error) {
      setAlertData({
        show: true,
        status: "error",
        message: error.response.data.message
          ? error.response.data.message
          : "회원가입 중 오류가 발생하였습니다!",
      });
    }
  };
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
        {step === "TypeSelect" && (
          <FirstType
            onNext={(_type) => {
              setUserData((_prev) => {
                return { ..._prev, type: _type };
              });
              setStep("NameAndYear");
            }}
          />
        )}
        {step === "NameAndYear" && (
          <SecondNameAndYearInput
            type={userData.type}
            isNeedYear={userData.type === "undergraduate"}
            onNext={async ({ name, birthYear }) => {
              setUserData((_prev) => {
                return { ..._prev, name: name, birthYear: birthYear };
              });

              if (
                userData.type === "graduate" ||
                userData.type === "parents/outsider"
              ) {
                await handleJoin({ ...userData, name });
              }
            }}
            back={() => {
              setStep("TypeSelect");
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
