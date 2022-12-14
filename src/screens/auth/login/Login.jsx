import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ButtonOnlyText from "../../../components/common/ButtonOnlyText";
import ButtonFullWidth from "../../../components/common/ButtonFullWidth";

import { numRegexChecker } from "../../../../utils/regex";
import { postRequestCode } from "../../../../apis/auth";
import AlertError from "../../../components/common/AlertError";

export default function LoginScreen({ navigation }) {
  const [error, setError] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (phoneNumber.length === 11) {
      setDone(true);
    } else {
      setDone(false);
    }
  }, [phoneNumber]);

  async function handleRequestCode() {
    await postRequestCode(phoneNumber, "login")
      .then(() => {
        navigation.push("LoginVerify", { phoneNumber: phoneNumber });
      })
      .catch((err) => {
        console.log(err);
        setError({
          message: err.response.data.message,
        });
      });
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Text
          style={{
            fontSize: 40,
            fontWeight: "700",
            marginHorizontal: 25,
            marginTop: 60,
          }}
        >
          로그인
        </Text>

        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            paddingHorizontal: 25,
            paddingTop: 50,
          }}
        >
          <View>
            <Text style={{ fontSize: 14, color: "gray", marginBottom: 5 }}>
              전화번호
            </Text>
            <TextInput
              value={phoneNumber}
              onChangeText={(_data) => {
                if (numRegexChecker(_data)) {
                  setPhoneNumber(_data);
                }
              }}
              placeholder="01012345678"
              keyboardType="phone-pad"
              maxLength={11}
              style={[styles.input, error ? styles.input_red : styles.input]}
            />
            {error ? <AlertError text={error.message} /> : null}
          </View>

          <View>
            <ButtonFullWidth
              onPress={handleRequestCode}
              text="다음"
              color={done ? "#00139B" : "#A1A5C0"}
            />
            <View style={{ alignItems: "center" }}>
              <ButtonOnlyText
                onPress={() => {
                  navigation.replace("Join");
                }}
                text="회원가입"
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderBottomColor: "#bdbdbd",
    borderBottomWidth: 2,
    padding: 5,
    fontSize: 20,
    fontWeight: "600",
  },
  input_red: {
    borderBottomColor: "#fb7185",
  },
});
