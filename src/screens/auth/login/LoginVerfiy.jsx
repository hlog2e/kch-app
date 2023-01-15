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

import ButtonOnlyText from "../../../components/common/ButtonOnlyText";
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
  const [status, setStatus] = useState({
    status: "sucess",
    message: "문자메세지로 인증번호가 전송되었습니다.",
  });
  const [verifyCode, setVerifyCode] = useState("");
  const [done, setDone] = useState(false);

  const { setUser } = useContext(UserContext);

  useEffect(() => {
    if (verifyCode.length === 4) {
      setDone(true);
      setStatus({});
    } else {
      setDone(false);
    }
  }, [verifyCode]);

  async function handlePostLogin() {
    const data = await postLogin(route.params.phoneNumber, verifyCode).catch(
      (err) => {
        setStatus({ status: "error", message: err.response.data.message });
      }
    );
    await AsyncStorage.setItem("token", JSON.stringify(data.token)); //asyncStorage에 토큰 저장
    await AsyncStorage.setItem("user", JSON.stringify(data.user)); //asyncStorage에 유저 정보 저장
    setUser(data.user);

    //Expo Push Token 을 얻은 후 DB에 POST
    registerForPushNotificationsAsync().then((_token) => {
      if (_token) {
        console.log(_token);
        registerPushTokenToDB(_token).catch((err) =>
          alert("푸시알림 서비스 등록을 실패하였습니다.")
        );
      }
    });
    navigation.replace("Main");
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
          인증
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
              onPress={handlePostLogin}
              text="로그인"
              color="#00139B"
            />
            <View style={{ alignItems: "center" }}>
              <ButtonOnlyText
                onPress={() => {
                  navigation.replace("Join");
                }}
                text="회원가입"
                color={done ? "#00139B" : "#A1A5C0"}
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
