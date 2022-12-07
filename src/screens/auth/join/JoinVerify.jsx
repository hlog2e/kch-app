import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ButtonFullWidth from "../../../components/common/ButtonFullWidth";
import OnlyLeftArrowHeader from "../../../components/common/OnlyLeftArrowHeader";

import { numRegexChecker } from "../../../../utils/regex";
import AlertSucess from "../../../components/common/AlertSucess";
import AlertError from "../../../components/common/AlertError";
import { postValidateVerifyCode, postVerifyCode } from "../../../../apis/auth";

export default function JoinVerfiyScreen({ navigation, route }) {
  const [status, setStatus] = useState({
    status: "sucess",
    message: "문자메세지로 인증번호가 전송되었습니다.",
  });
  const [verifyCode, setVerifyCode] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (verifyCode.length === 4) {
      setDone(true);
      setStatus({});
    } else {
      setDone(false);
    }
  }, [verifyCode]);

  async function handleRequestValidateCode() {
    if (done) {
      const { isValidate, message } = await postVerifyCode(
        route.params.phoneNumber,
        verifyCode
      );

      if (isValidate) {
        navigation.push("JoinForm", {
          phoneNumber: route.params.phoneNumber,
        });
      } else {
        setStatus({ status: "error", message: message });
      }
    }
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <OnlyLeftArrowHeader navigation={navigation} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Text
          style={{
            fontSize: 40,
            fontWeight: "700",
            marginHorizontal: 25,
            marginTop: 20,
          }}
        >
          인증번호
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
              인증번호
            </Text>
            <TextInput
              value={verifyCode}
              maxLength={4}
              onChangeText={(_data) => {
                if (numRegexChecker(_data)) {
                  setVerifyCode(_data);
                }
              }}
              placeholder="인증번호 4자리"
              keyboardType="phone-pad"
              style={[
                styles.input,
                status.status === "error" ? styles.input_red : styles.input,
              ]}
            />
            {status.status === "error" ? (
              <AlertError text={status.message} />
            ) : null}
            {status.status === "sucess" ? (
              <AlertSucess text={status.message} />
            ) : null}
          </View>

          <View>
            <ButtonFullWidth
              onPress={handleRequestValidateCode}
              text="다음"
              color={done ? "#00139B" : "#A1A5C0"}
            />
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
