import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ButtonFullWidth from "../../../components/common/ButtonFullWidth";
import OnlyLeftArrowHeader from "../../../components/common/OnlyLeftArrowHeader";

import { numRegexChecker } from "../../../../utils/regex";
import AlertSucess from "../../../components/common/AlertSucess";
import { postLogin } from "../../../../apis/auth";
import AlertError from "../../../components/common/AlertError";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../../../../context/UserContext";
import { registerForPushNotificationsAsync } from "../../../../utils/expo_notification";
import { registerPushTokenToDB } from "../../../../apis/push-noti";

export default function LoginVerfiyScreen({ navigation, route }) {
  const [status, setStatus] = useState("success");
  const [msg, setMsg] = useState("인증번호를 발송하였습니다!");
  const [verifyCode, setVerifyCode] = useState("");
  const [done, setDone] = useState(false);

  const { setUser } = useContext(UserContext);

  useEffect(() => {
    if (verifyCode.length === 4) {
      setDone(true);
      setStatus("");
    } else {
      setDone(false);
    }
  }, [verifyCode]);

  async function handlePostLogin() {
    try {
      const data = await postLogin(route.params.phoneNumber, verifyCode);

      await AsyncStorage.setItem("token", JSON.stringify(data.token)); //asyncStorage에 토큰 저장
      await AsyncStorage.setItem("user", JSON.stringify(data.user)); //asyncStorage에 유저 정보 저장
      setUser(data.user);

      //Expo Push Token 을 얻은 후 DB에 POST
      registerForPushNotificationsAsync().then((_token) => {
        if (_token) {
          registerPushTokenToDB(_token).catch((err) =>
            alert("푸시알림 서비스 등록을 실패하였습니다.")
          );
        }
      });
      navigation.replace("Main");
    } catch (err) {
      setStatus("error");
      setMsg(err.response.data.message);
    }
  }

  const styles = StyleSheet.create({
    title: {
      fontSize: 40,
      fontWeight: "700",
      marginHorizontal: 25,
      marginVertical: 25,
    },

    keyboard_view: {
      flex: 1,
      paddingHorizontal: 25,
    },
  });
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <OnlyLeftArrowHeader navigation={navigation} />
      <Text style={styles.title}>인증</Text>
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
        <Footer done={done} handlePostLogin={handlePostLogin} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Input({ verifyCode, setVerifyCode, status, msg }) {
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

function Footer({ handlePostLogin, done }) {
  return (
    <View>
      <ButtonFullWidth
        onPress={handlePostLogin}
        text="로그인"
        color={done ? "#00139B" : "#A1A5C0"}
        disable={!done}
      />
    </View>
  );
}
