import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";
import { Ionicons } from "@expo/vector-icons";
import * as SMS from "expo-sms";
import Dialog from "react-native-dialog";
import { useState } from "react";
import { useTheme } from "@react-navigation/native";

export default function ThirdVerifyUndergraduate({
  openScanner,
  barcode,
  onNext,
}) {
  const { colors } = useTheme();

  const [hiddenCount, setHiddenCount] = useState(0);
  const [hiddenCode, setHiddenCode] = useState(null);

  const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "space-between" },
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
    <View style={styles.container}>
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
          <TouchableOpacity onPress={openScanner} style={styles.scanButton}>
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
            if (barcode) {
              onNext();
            }
            if (hiddenCode) {
              onNext(hiddenCode);
            }
          }}
          style={styles.nextButton}
        >
          <Text style={styles.nextButtonText}>가입하기</Text>
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
    </View>
  );
}
