// @ts-nocheck
import React, { useState } from "react";
import { useTheme } from "@react-navigation/native";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import * as Animatable from "react-native-animatable";
import * as SMS from "expo-sms";

interface ThridVerifyTeacherProps {
  onNext: (teacherCode: string) => void;
}

export default function ThirdVerifyTeacher({
  onNext,
}: ThridVerifyTeacherProps) {
  const { colors } = useTheme();
  const [teacherCode, setTeacherCode] = useState<string>("");

  const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "space-between" },
    header: { marginTop: 32 },
    subTitle: { fontSize: 14, color: (colors as any).subText },
    title: { fontSize: 28, fontWeight: "700", color: colors.text },

    inputWrap: {
      marginTop: 24,
    },
    input: {
      width: "100%",
      height: 50,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 16,
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },

    helpButton: { alignItems: "center", paddingVertical: 18 },
    helpButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: (colors as any).subText,
    },

    nextButton: {
      width: "100%",
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: (colors as any).blue,
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : undefined}
    >
      <View>
        <Animatable.View
          animation="fadeInUp"
          duration={1500}
          style={styles.header}
        >
          <Text style={styles.subTitle}>선생님 인증을 위한</Text>
          <Text style={styles.title}>가입코드를 입력해 주세요!</Text>
        </Animatable.View>
        <Animatable.View
          animation="fadeInUp"
          duration={1700}
          style={styles.inputWrap}
        >
          <TextInput
            placeholder="선생님 가입코드"
            style={styles.input}
            value={teacherCode}
            onChangeText={setTeacherCode}
          />
        </Animatable.View>
      </View>
      <View>
        <TouchableOpacity
          onPress={async () => {
            Alert.alert("안내", "선생님 가입코드를 모르시는 경우...", [
              {
                text: "연락하기",
                onPress: async () => {
                  await SMS.sendSMSAsync(
                    "01095645490",
                    "[선생님인증 관련 문의]\n"
                  );
                },
              },
              { text: "확인" },
            ]);
          }}
          style={styles.helpButton}
        >
          <Text style={styles.helpButtonText}>가입코드를 모르시나요?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onNext(teacherCode || "")}
          style={styles.nextButton}
        >
          <Text style={styles.nextButtonText}>가입하기</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
