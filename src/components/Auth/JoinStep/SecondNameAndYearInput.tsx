// @ts-nocheck
import React from "react";
import { useTheme } from "@react-navigation/native";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import * as Animatable from "react-native-animatable";
import RNPickerSelect from "react-native-picker-select";

interface PickerItem {
  label: string;
  value: string;
}

interface SecondNameAndYearInputProps {
  type: "undergraduate" | "graduate" | "teacher" | "parents/outsider";
  isNeedYear: boolean;
  onNext: (data: { name: string; birthYear?: string }) => void;
  back: () => void;
}

export default function SecondNameAndYearInput({
  type,
  isNeedYear,
  onNext,
  back,
}: SecondNameAndYearInputProps) {
  const { colors } = useTheme();

  const [name, setName] = useState<string>("");
  const [birthYear, setBirthYear] = useState<string>();
  const thisYear = moment().format("YYYY");
  const [yearArray, setYearArray] = useState<PickerItem[]>([]);
  const [pickerOpen, setPickerOpen] = useState<boolean>(false);

  useEffect(() => {
    const tempYearArray: PickerItem[] = [];
    for (let i = parseInt(thisYear); i >= 1900; i--) {
      tempYearArray.push({ label: String(i), value: String(i) });
    }
    setYearArray(tempYearArray);
  }, [thisYear]);

  const styles = StyleSheet.create({
    flexWrap: { flex: 1, justifyContent: "space-between" },
    textWrap: { marginTop: 32 },

    topItemsWrap: { marginBottom: 20 },
    subTitle: { fontSize: 14, color: (colors as any).subText },
    title: { fontSize: 28, fontWeight: "700", color: colors.text },

    inputWrap: { marginTop: 24 },
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

    pickerWrap: {
      width: "100%",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      marginTop: 24,
    },

    backButton: {
      width: "100%",
      height: 50,
      justifyContent: "center",
      alignItems: "center",
    },
    backButtonText: {
      fontSize: 16,
      fontWeight: "700",
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
      style={!pickerOpen ? styles.flexWrap : undefined}
    >
      <View style={styles.topItemsWrap}>
        <Animatable.View
          animation="fadeInUp"
          duration={1500}
          style={styles.textWrap}
        >
          <Text style={styles.subTitle}>회원가입을 위해</Text>
          <Text style={styles.title}>몇 가지 정보를 확인할게요!</Text>
        </Animatable.View>
        <Animatable.View
          animation="fadeInUp"
          duration={1500}
          delay={500}
          style={styles.inputWrap}
        >
          <TextInput
            value={name}
            onChangeText={(text) => setName(text)}
            style={styles.input}
            placeholder={
              type === "parents/outsider" ? "이름 (ex. OOO 학부모)" : "이름"
            }
            maxLength={10}
          />
        </Animatable.View>
        {isNeedYear && (
          <Animatable.View
            animation="fadeInUp"
            duration={1500}
            delay={700}
            style={styles.pickerWrap}
          >
            <RNPickerSelect
              onValueChange={(value) => setBirthYear(value)}
              onOpen={() => setPickerOpen(true)}
              onClose={() => setPickerOpen(false)}
              items={yearArray}
            />
          </Animatable.View>
        )}
      </View>

      <View>
        <TouchableOpacity onPress={back} style={styles.backButton}>
          <Text style={styles.backButtonText}>이전 단계</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (type !== "undergraduate" && name) {
              onNext({ name });
            }
            if (type === "undergraduate" && name && birthYear) {
              onNext({ name, birthYear });
            }
          }}
          style={styles.nextButton}
        >
          <Text style={styles.nextButtonText}>
            {type === "graduate" || type === "parents/outsider"
              ? "가입하기"
              : "다음"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
