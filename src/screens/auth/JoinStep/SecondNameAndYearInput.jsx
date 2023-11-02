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

export default function SecondNameAndYearInput({
  type,
  isNeedYear,
  onNext,
  back,
}) {
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState();
  const thisYear = moment().format("YYYY");
  const [yearArray, setYearArray] = useState([]);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    let tempYearArray = [];
    for (let i = thisYear; i >= 1900; i--) {
      tempYearArray.push({ label: String(i), value: String(i) });
    }
    setYearArray(tempYearArray);
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={!pickerOpen && styles.flexWrap}
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
            onChangeText={(_text) => setName(_text)}
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
            style={styles.inputWrap}
          >
            <RNPickerSelect
              style={styles.picker}
              placeholder={{ label: "태어난 해", value: null }}
              items={yearArray}
              onValueChange={(_value) => setBirthYear(_value)}
              onOpen={() => setPickerOpen(true)}
              onClose={() => setPickerOpen(false)}
            />
          </Animatable.View>
        )}
      </View>

      <View>
        <TouchableOpacity onPress={back} style={styles.backButton}>
          <Text style={styles.backButtonText}>이전 단계</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            if (type !== "undergraduate" && name) {
              onNext({ name });
            }
            if (type === "undergraduate" && name && birthYear) {
              onNext({ name, birthYear: birthYear });
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

const styles = StyleSheet.create({
  flexWrap: { flex: 1, justifyContent: "space-between" },
  textWrap: { marginTop: 32 },

  topItemsWrap: { marginBottom: 20 },
  subTitle: { fontSize: 14, color: "gray" },
  title: { fontSize: 28, fontWeight: "700" },

  inputWrap: {
    marginTop: 24,
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: "600",
  },

  picker: {
    inputAndroid: {
      width: "100%",
      height: 50,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#e2e8f0",
      paddingHorizontal: 16,
      fontSize: 18,
      fontWeight: "600",
    },
    inputIOS: {
      width: "100%",
      height: 50,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#e2e8f0",
      paddingHorizontal: 16,
      fontSize: 18,
      fontWeight: "600",
    },
  },

  backButton: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: { fontSize: 16, fontWeight: "700" },

  nextButton: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3b82f6",
    borderRadius: 15,
    marginBottom: 20,
  },
  nextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});