import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { Ionicons } from "@expo/vector-icons";
import * as SMS from "expo-sms";
import Dialog from "react-native-dialog";
import { useEffect, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { Camera } from "expo-camera";
import WrapBarCodeScanner from "../../../components/WrapBarCodeScanner";

export default function VerifyUndergraduateScreen() {
  const { colors } = useTheme();

  const [hiddenCount, setHiddenCount] = useState(0);
  const [hiddenCode, setHiddenCode] = useState(null);

  const [barcode, setBarcode] = useState(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    requestCameraPermissions();
  }, []);

  const requestCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  };

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

  // 실제로 이 화면에서 onNext 로직(서버에 인증 요청 등)을 관리한다면,
  // 상위에서 받아온 Props로 함수를 전달받아 처리하거나,
  // 이 안에서 직접 handle함수를 만들어 처리하시면 됩니다.
  const onNext = (codeVal) => {
    Alert.alert("확인", `인증코드: ${codeVal || barcode}`);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginHorizontal: 10,
      justifyContent: "space-between",
    },
    header: { marginTop: 32 },
    subTitle: { fontSize: 14, color: colors.subText },
    title: { fontSize: 28, fontWeight: "700", color: colors.text },

    scanButton: {
      marginTop: 30,
      borderWidth: 1,
      borderColor: colors.border,
      width: 130,
      paddingVertical: 10,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 15,
    },
    scanButtonText: {
      fontSize: 14,
      color: colors.subText,
      fontWeight: "700",
      marginVertical: 4,
    },

    infoWrap: { marginTop: 12 },
    barcodeText: { fontSize: 16, fontWeight: "200", color: colors.text },

    helpButton: { alignItems: "center", paddingVertical: 18 },
    helpButtonText: { fontSize: 14, fontWeight: "600", color: colors.subText },

    nextButton: {
      width: "100%",
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.blue,
      borderRadius: 15,
      marginBottom: 20,
    },
    nextButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "700",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <WrapBarCodeScanner
        barCodeScannerOpen={scannerOpen}
        setBarCodeScannerOpen={setScannerOpen}
        handleBarCodeScanned={({ data }) => {
          setBarcode(data);
          setScannerOpen(false);
        }}
      />
      <View>
        <Animatable.View
          animation="fadeInUp"
          duration={1500}
          style={styles.header}
        >
          <Text style={styles.subTitle}>재학생 인증을 위해</Text>
          <TouchableOpacity
            onPress={() => setHiddenCount((_prev) => _prev + 1)}
          >
            <Text style={styles.title}>학생증을 준비해 주세요!</Text>
          </TouchableOpacity>
        </Animatable.View>
        <Animatable.View animation="fadeInUp" duration={1500} delay={500}>
          <TouchableOpacity
            onPress={handleOpenBarcodeScanner}
            style={styles.scanButton}
          >
            <Ionicons name="camera-outline" size={24} color="gray" />
            <Text style={styles.scanButtonText}>
              {barcode ? "스캔완료" : "학생증 스캔"}
            </Text>
          </TouchableOpacity>
        </Animatable.View>

        <View style={styles.infoWrap}>
          {barcode && (
            <Text style={styles.barcodeText}>학생 인증코드 : {barcode}</Text>
          )}
          {hiddenCode && (
            <Text style={styles.barcodeText}>학생 인증코드 : {hiddenCode}</Text>
          )}
        </View>
      </View>
      <View>
        <TouchableOpacity
          onPress={async () => {
            await SMS.sendSMSAsync("01095645490", "[학생인증 관련 문의]\n");
          }}
          style={styles.helpButton}
        >
          <Text style={styles.helpButtonText}>
            학생증을 분실했거나, 인증에 문제가 있나요?
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (hiddenCode) {
              onNext(hiddenCode);
            } else if (barcode) {
              onNext();
            }
          }}
          style={styles.nextButton}
        >
          <Text style={styles.nextButtonText}>재학생 인증하기</Text>
        </TouchableOpacity>
      </View>

      {/* -------- 아래는 히든 메뉴 -------- */}
      <Dialog.Container visible={hiddenCount >= 5}>
        <Dialog.Title>히든 메뉴</Dialog.Title>
        <Dialog.Description>
          관리자에게 안내받은 가입코드를 입력해주세요!
        </Dialog.Description>
        <Dialog.Input
          onChangeText={(_value) => {
            setHiddenCode(_value);
          }}
          placeholder="가입코드"
        />
        <Dialog.Button label="취소" onPress={() => setHiddenCount(0)} />
        <Dialog.Button
          label="확인"
          onPress={() => {
            setHiddenCount(0);
          }}
        />
      </Dialog.Container>
    </SafeAreaView>
  );
}
