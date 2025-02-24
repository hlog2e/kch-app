import { StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FirstType from "./JoinStep/FirstType";
import { useEffect, useState } from "react";
import SecondNameAndYearInput from "./JoinStep/SecondNameAndYearInput";
import { postJoin } from "../../../apis/auth/index";
import { registerForPushNotificationsAsync } from "../../../utils/expo_notification";
import { registerPushTokenToDB } from "../../../apis/push-noti/index";
import ThirdVerifyUndergraduate from "./JoinStep/ThirdVerifyUndergraduate";
import WrapBarCodeScanner from "../../components/WrapBarCodeScanner";
import ThirdVerifyTeacher from "./JoinStep/ThridVerifyTeacher";
import { Camera } from "expo-camera";
import { useUser } from "../../../context/UserContext";
import { useAlert } from "../../../context/AlertContext";

export default function JoinScreen({ route, navigation }) {
  const { login } = useUser();
  const alert = useAlert();
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

  const [scannerOpen, setScannerOpen] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    requestCameraPermissions();
  }, []);

  // userData에 phoneNumber, code 병합
  useEffect(() => {
    setUserData((_prev) => {
      return { ..._prev, phoneNumber: phoneNumber, code: code };
    });
  }, [route.params]);

  const handleOpenBarcodeScanner = () => {
    if (hasPermission) {
      setScannerOpen(true);
    } else {
      Alert.alert(
        "오류",
        "카메라 권한이 허용되지 않아서 바코드를 스캔할 수 없어요! 설정에서 카메라 권한을 허용해 주세요.",
        [{ text: "확인" }]
      );
    }
  };

  const requestCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const handleJoin = async (_userData) => {
    try {
      const response = await postJoin({ ..._userData });
      await login({ token: response.token, user: response.user });

      navigation.replace("Main");

      const pushToken = await registerForPushNotificationsAsync();
      if (pushToken) {
        await registerPushTokenToDB(pushToken);
      }
    } catch (error) {
      alert.error(
        error.response?.data?.message
          ? error.response.data.message
          : "회원가입 중 오류가 발생하였습니다!"
      );
    }
  };

  return (
    <>
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
      <SafeAreaView edges={["top"]} style={styles.container}>
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
            openScanner={handleOpenBarcodeScanner}
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
