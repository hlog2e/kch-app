// @ts-nocheck
import React, { useEffect, useState } from "react";
import { StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FirstType from "./JoinStep/FirstType";
import SecondNameAndYearInput from "./JoinStep/SecondNameAndYearInput";
import ThirdVerifyUndergraduate from "./JoinStep/ThirdVerifyUndergraduate";
import ThirdVerifyTeacher from "./JoinStep/ThridVerifyTeacher";
import WrapBarCodeScanner from "../WrapBarCodeScanner";
import { postJoin } from "../../../apis/auth/index";
import { registerForPushNotificationsAsync } from "../../../utils/expo_notification";
import { registerPushTokenToDB } from "../../../apis/push-noti/index";
import { Camera } from "expo-camera";
import { useUser } from "../../../context/UserContext";
import { useAlert } from "../../../context/AlertContext";
import { useLocalSearchParams, useRouter } from "expo-router";

export type UserType =
  | "undergraduate"
  | "teacher"
  | "graduate"
  | "parents/outsider";

interface UserData {
  type: UserType | null;
  name: string | null;
  birthYear: string | null;
  barcode: string | null;
  phoneNumber?: string;
  code?: string;
}

export default function JoinScreen() {
  const { login } = useUser();
  const alert = useAlert();
  const router = useRouter();
  const params = useLocalSearchParams<{
    phoneNumber?: string;
    code?: string;
  }>();

  const { phoneNumber, code } = params || {};
  const [step, setStep] = useState<string>("TypeSelect");
  const [userData, setUserData] = useState<UserData>({
    type: null,
    name: null,
    birthYear: null,
    barcode: null,
    phoneNumber,
    code,
  });
  const [scannerOpen, setScannerOpen] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleJoin = async (data: UserData) => {
    try {
      const response = await postJoin({ ...data });
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
    <>
      <WrapBarCodeScanner
        barCodeScannerOpen={scannerOpen}
        setBarCodeScannerOpen={setScannerOpen}
        handleBarCodeScanned={({ data }) => {
          setUserData((prev) => ({ ...prev, barcode: data }));
          setScannerOpen(false);
        }}
      />
      <SafeAreaView edges={["top"]} style={styles.container}>
        {step === "TypeSelect" && (
          <FirstType
            onNext={(type: UserType) => {
              setUserData((prev) => ({ ...prev, type }));
              setStep("NameAndYear");
            }}
          />
        )}
        {step === "NameAndYear" && (
          <SecondNameAndYearInput
            type={userData.type!}
            isNeedYear={userData.type === "undergraduate"}
            onNext={async ({ name, birthYear }) => {
              const newData = { ...userData, name, birthYear };
              if (
                userData.type === "graduate" ||
                userData.type === "parents/outsider"
              ) {
                await handleJoin(newData as UserData);
              } else if (userData.type === "undergraduate") {
                setStep("VerifyUndergraduate");
              } else if (userData.type === "teacher") {
                setStep("VerifyTeacher");
              }
              setUserData(newData as UserData);
            }}
            back={() => setStep("TypeSelect")}
          />
        )}
        {step === "VerifyUndergraduate" && (
          <ThirdVerifyUndergraduate
            openScanner={() =>
              hasPermission
                ? setScannerOpen(true)
                : alert.alert("카메라 권한 필요")
            }
            barcode={userData.barcode}
            onNext={(hiddenCode) =>
              handleJoin({ ...userData, hiddenCode } as UserData)
            }
          />
        )}
        {step === "VerifyTeacher" && (
          <ThirdVerifyTeacher
            onNext={(teacherCode: string) =>
              handleJoin({ ...userData, teacherCode } as any)
            }
          />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginHorizontal: 16 },
});
