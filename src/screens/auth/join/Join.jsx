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

export default function JoinScreen({ navigation }) {
  const [status, setStatus] = useState("");
  const [msg, setMsg] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (phoneNumber.length === 11) {
      setDone(true);
    } else {
      setDone(false);
    }
  }, [phoneNumber]);

  async function handleRequestVerifyCode() {
    if (done) {
      //전화번호 입력이 완료되었을 때
      await postRequestCode(phoneNumber, "join")
        .then((data) => {
          navigation.push("JoinVerify", {
            phoneNumber: phoneNumber,
          });
        })
        .catch((err) => {
          console.log(err);
          setStatus("error");
          setMsg(err.response.data.message);
        });
    }
  }

  const styles = StyleSheet.create({
    title: {
      fontSize: 40,
      fontWeight: "700",
      marginHorizontal: 25,
      marginTop: 60,
      marginBottom: 25,
    },

    keyboard_view: {
      flex: 1,
      paddingHorizontal: 25,
    },
  });
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text style={styles.title}>회원가입</Text>
      <KeyboardAvoidingView
        style={styles.keyboard_view}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <Input
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          status={status}
          msg={msg}
        />
        <Footer
          handleRequestVerifyCode={handleRequestVerifyCode}
          done={done}
          navigation={navigation}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Input({ phoneNumber, setPhoneNumber, status, msg }) {
  const styles = StyleSheet.create({
    input_wrap: { flex: 1 },
    input_title: { fontSize: 14, color: "gray", marginBottom: 5 },
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
  return (
    <View style={styles.input_wrap}>
      <Text style={styles.input_title}>전화번호</Text>
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
        style={[
          styles.input,
          status === "error" ? styles.input_red : styles.input,
        ]}
      />
      {status === "error" ? <AlertError text={msg} /> : null}
    </View>
  );
}

function Footer({ handleRequestVerifyCode, done, navigation }) {
  return (
    <View>
      <ButtonFullWidth
        onPress={handleRequestVerifyCode}
        text="다음"
        disable={!done}
        color={done ? "#00139B" : "#A1A5C0"}
      />
      <View style={{ alignItems: "center" }}>
        <ButtonOnlyText
          onPress={() => {
            navigation.replace("Login");
          }}
          text="로그인"
        />
      </View>
    </View>
  );
}
