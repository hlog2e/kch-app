import { useEffect, useState } from "react";
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

import ButtonOnlyText from "../../../components/common/ButtonOnlyText";
import ButtonFullWidth from "../../../components/common/ButtonFullWidth";

import { numRegexChecker } from "../../../../utils/regex";
import { postRequestCode } from "../../../../apis/auth";
import AlertError from "../../../components/common/AlertError";

export default function LoginScreen({ navigation }) {
  const NowColorState = useColorScheme();

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

  async function handleRequestCode() {
    await postRequestCode(phoneNumber, "login")
      .then(() => {
        navigation.push("LoginVerify", { phoneNumber: phoneNumber });
      })
      .catch((err) => {
        console.log(err);
        setStatus("error");
        setMsg(err.response.data.message);
      });
  }

  const styles = StyleSheet.create({
    title: {
      fontSize: 40,
      fontWeight: "700",
      marginHorizontal: 25,
      marginTop: 60,
      marginBottom: 25,
      color: NowColorState === "light" ? "black" : "white",
    },
    keyboard_view: {
      flex: 1,
      paddingHorizontal: 25,
    },
  });
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text style={styles.title}>로그인</Text>
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
          navigation={navigation}
          done={done}
          handleRequestCode={handleRequestCode}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Input({ phoneNumber, setPhoneNumber, status, msg }) {
  const NowColorState = useColorScheme();

  const styles = StyleSheet.create({
    input_wrap: { flex: 1 },
    input_title: {
      fontSize: 14,
      color: NowColorState === "light" ? "gray" : "white",
      marginBottom: 5,
    },
    input: {
      color: NowColorState === "light" ? "black" : "white",
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
        placeholderTextColor={NowColorState === "dark" ? "gray" : null}
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

function Footer({ navigation, handleRequestCode, done }) {
  const NowColorState = useColorScheme();

  return (
    <View>
      <ButtonFullWidth
        onPress={handleRequestCode}
        text="다음"
        color={done ? "#00139B" : "#A1A5C0"}
        disable={!done}
      />
      <View style={{ alignItems: "center" }}>
        <ButtonOnlyText
          onPress={() => {
            navigation.replace("Join");
          }}
          text="회원가입"
          color={NowColorState === "light" ? "black" : "white"}
        />
      </View>
    </View>
  );
}
