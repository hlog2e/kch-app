import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as Animatable from "react-native-animatable";

export default function SecondVerifyCode({ onNext, back, data }) {
  const [code, setCode] = useState("");
  useEffect(() => {
    if (code.length === 4) {
      onNext(code);
    }
  }, [code]);
  return (
    <View style={styles.container}>
      <View>
        <Animatable.View
          animation="fadeInUp"
          duration={1500}
          style={styles.textWrap}
        >
          <Text style={styles.subTitle}>문자로 인증번호를 보내드렸습니다.</Text>
          <Text style={styles.title}>인증번호 입력해주세요!</Text>
        </Animatable.View>
        <Animatable.View
          animation="fadeInUp"
          duration={1500}
          delay={500}
          style={styles.inputWrap}
        >
          <TextInput
            inputMode="numeric"
            value={code}
            onChangeText={(_text) => setCode(_text)}
            style={styles.input}
            placeholder="인증번호 (4자리)"
            maxLength={4}
          />
        </Animatable.View>
      </View>
      <TouchableOpacity onPress={back} style={styles.button}>
        <Text style={styles.buttonText}>이전 단계</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-between" },
  textWrap: { marginTop: 32 },
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

  button: {
    width: "100%",
    height: 40,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "gray",
  },
});
