import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ButtonFullWidth from "../../../components/common/ButtonFullWidth";
import OnlyLeftArrowHeader from "../../../components/common/OnlyLeftArrowHeader";

import { numRegexChecker } from "../../../../utils/regex";
import AlertSucess from "../../../components/common/AlertSucess";
import AlertError from "../../../components/common/AlertError";
import { postVerifyCode } from "../../../../apis/auth";

export default function JoinVerfiyScreen({ navigation, route }) {
  const NowColorState = useColorScheme();

  const [status, setStatus] = useState("success");
  const [msg, setMsg] = useState("인증번호를 발송했습니다!");
  const [verifyCode, setVerifyCode] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (verifyCode.length === 4) {
      setDone(true);
      setStatus("");
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
        setStatus("error");
        setMsg(message);
      }
    }
  }

  const styles = StyleSheet.create({
    title: {
      fontSize: 40,
      fontWeight: "700",
      marginHorizontal: 25,
      marginVertical: 25,
      color: NowColorState === "light" ? "black" : "white",
    },

    keyboard_view: {
      flex: 1,
      paddingHorizontal: 25,
    },
  });
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <OnlyLeftArrowHeader navigation={navigation} />
      <Text style={styles.title}>인증번호</Text>
      <KeyboardAvoidingView
        style={styles.keyboard_view}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <Input
          verifyCode={verifyCode}
          setVerifyCode={setVerifyCode}
          status={status}
          msg={msg}
        />
        <Footer
          handleRequestValidateCode={handleRequestValidateCode}
          done={done}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Input({ verifyCode, setVerifyCode, status, msg }) {
  const NowColorState = useColorScheme();

  const styles = StyleSheet.create({
    input_wrap: { flex: 1 },
    input_title: {
      fontSize: 14,
      color: NowColorState === "light" ? "gray" : "white",
      marginBottom: 5,
    },
    input: {
      borderBottomColor: "#bdbdbd",
      borderBottomWidth: 2,
      padding: 5,
      fontSize: 20,
      fontWeight: "600",
      color: NowColorState === "light" ? "black" : "white",
    },
    input_red: {
      borderBottomColor: "#fb7185",
    },
  });
  return (
    <View style={styles.input_wrap}>
      <Text style={styles.input_title}>인증번호</Text>
      <TextInput
        value={verifyCode}
        maxLength={4}
        onChangeText={(_data) => {
          if (numRegexChecker(_data)) {
            setVerifyCode(_data);
          }
        }}
        placeholder="인증번호 4자리"
        placeholderTextColor={NowColorState === "dark" ? "gray" : null}
        keyboardType="phone-pad"
        style={[
          styles.input,
          status === "error" ? styles.input_red : styles.input,
        ]}
      />
      {status === "error" ? <AlertError text={msg} /> : null}
      {status === "success" ? <AlertSucess text={msg} /> : null}
    </View>
  );
}

function Footer({ handleRequestValidateCode, done }) {
  return (
    <View>
      <ButtonFullWidth
        onPress={handleRequestValidateCode}
        text="다음"
        disable={!done}
        color={done ? "#00139B" : "#A1A5C0"}
      />
    </View>
  );
}
