import { useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import * as Animatable from "react-native-animatable";

interface FirstRequestCodeProps {
  onNext: (phoneNumber: string) => void;
}

export default function FirstRequestCode({ onNext }: FirstRequestCodeProps) {
  const { colors } = useTheme();
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (phoneNumber.length === 11) {
      onNext(phoneNumber);
    }
  }, [phoneNumber]);

  const styles = StyleSheet.create({
    textWrap: { marginTop: 32 },
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
  });

  return (
    <View>
      <Animatable.View
        animation="fadeInUp"
        duration={1500}
        style={styles.textWrap}
      >
        <Text style={styles.subTitle}>금천고 앱에 오신것을 환영합니다!</Text>
        <Text style={styles.title}>전화번호를 입력해주세요!</Text>
      </Animatable.View>
      <Animatable.View
        animation="fadeInUp"
        duration={1500}
        delay={500}
        style={styles.inputWrap}
      >
        <TextInput
          inputMode="numeric"
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
          style={styles.input}
          placeholder="전화번호"
          maxLength={11}
        />
      </Animatable.View>
    </View>
  );
}
