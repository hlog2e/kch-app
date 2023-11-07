import { SafeAreaView, StyleSheet } from "react-native";
import FirstType from "./JoinStep/FirstType";
import { useEffect, useState, useContext } from "react";
import SecondNameAndYearInput from "./JoinStep/SecondNameAndYearInput";
import CustomAlert from "../../components/common/CustomAlert";
import { postJoin } from "../../../apis/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerForPushNotificationsAsync } from "../../../utils/expo_notification";
import { registerPushTokenToDB } from "../../../apis/push-noti";
import { UserContext } from "../../../context/UserContext";
import ThirdVerifyUndergraduate from "./JoinStep/ThirdVerifyUndergraduate";
import WrapBarCodeScanner from "../../components/common/WrapBarCodeScanner";
import ThirdVerifyTeacher from "./JoinStep/ThridVerifyTeacher";

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
    barcode: null,
  });
  const [alertData, setAlertData] = useState({
    show: false,
    status: null,
    message: "",
  });
  const [scannerOpen, setScannerOpen] = useState(false);

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

      navigation.replace("Main");

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
      <WrapBarCodeScanner
        barCodeScannerOpen={scannerOpen}
        setBarCodeScannerOpen={setScannerOpen}
        handleBarCodeScanned={({ data }) => {
          setUserData((_prev) => {
            return { ..._prev, barcode: data };
          });
          setScannerOpen(false);
        }}
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

              if (userData.type === "undergraduate") {
                setStep("VerifyUndergraduate");
              }
              if (userData.type === "teacher") {
                setStep("VerifyTeacher");
              }
            }}
            back={() => {
              setStep("TypeSelect");
            }}
          />
        )}

        {step === "VerifyUndergraduate" && (
          <ThirdVerifyUndergraduate
            openScanner={() => setScannerOpen(true)}
            barcode={userData.barcode}
            onNext={(hiddenCode) => {
              if (hiddenCode) {
                handleJoin({ ...userData, hiddenCode: hiddenCode });
              } else {
                handleJoin(userData);
              }
            }}
          />
        )}

        {step === "VerifyTeacher" && (
          <ThirdVerifyTeacher
            onNext={(_teacherCode) => {
              handleJoin({ ...userData, teacherCode: _teacherCode });
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
