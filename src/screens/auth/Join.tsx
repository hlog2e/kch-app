import React, { useEffect, useState } from "react";
import { StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FirstType from "./JoinStep/FirstType";
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

type UserType = "undergraduate" | "teacher" | "graduate" | "parents/outsider";

interface UserData {
  type: UserType | null;
  name: string | null;
  birthYear: string | null;
  barcode: string | null;
  phoneNumber?: string;
  code?: string;
}

interface JoinScreenProps {
  route: {
    params?: {
      phoneNumber: string;
      code: string;
    };
  };
  navigation: any;
}

export default function JoinScreen({ route, navigation }: JoinScreenProps) {
  const { login } = useUser();
  const alert = useAlert();
  const { phoneNumber, code } = route.params || {
    phoneNumber: "01095645490",
    code: "1234",
  };
  const [step, setStep] = useState<string>("TypeSelect");
  const [userData, setUserData] = useState<UserData>({
    type: null,
    name: null,
    birthYear: null,
    barcode: null,
  });

  const [scannerOpen, setScannerOpen] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    requestCameraPermissions();
  }, []);

  // userData에 phoneNumber, code 병합
  useEffect(() => {
    setUserData((prev) => ({
      ...prev,
      phoneNumber: phoneNumber,
      code: code,
    }));
  }, [route.params]);

  const handleOpenBarcodeScanner = (): void => {
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

  const requestCameraPermissions = async (): Promise<void> => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const handleJoin = async (userData: UserData): Promise<void> => {
    try {
      const response = await postJoin({ ...userData });
      await login({ token: response.token, user: response.user });

      navigation.replace("Main");

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
    <>
      <WrapBarCodeScanner
        barCodeScannerOpen={scannerOpen}
        setBarCodeScannerOpen={setScannerOpen}
        handleBarCodeScanned={({ data }) => {
          setUserData((prev) => ({
            ...prev,
            barcode: data,
          }));
          setScannerOpen(false);
        }}
      />
      <SafeAreaView edges={["top"]} style={styles.container}>
        {step === "TypeSelect" && (
          <FirstType
            onNext={(type: UserType) => {
              setUserData((prev) => ({
                ...prev,
                type: type,
              }));
              setStep("NameAndYear");
            }}
          />
        )}
        {step === "NameAndYear" && (
          <SecondNameAndYearInput
            type={userData.type}
            isNeedYear={userData.type === "undergraduate"}
            onNext={async ({
              name,
              birthYear,
            }: {
              name: string;
              birthYear?: string;
            }) => {
              setUserData((prev) => ({
                ...prev,
                name: name,
                birthYear: birthYear || null,
              }));

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
            onNext={(hiddenCode: string) => {
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
            onNext={(teacherCode: string) => {
              handleJoin({ ...userData, teacherCode: teacherCode });
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
