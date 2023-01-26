import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Platform,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RNPickerSelect from "react-native-picker-select";
import ButtonFullWidth from "../../../components/common/ButtonFullWidth";
import OnlyLeftArrowHeader from "../../../components/common/OnlyLeftArrowHeader";
import { postJoinUser, postVerifyRegisterCode } from "../../../../apis/auth";
import AlertError from "../../../components/common/AlertError";
import AlertSucess from "../../../components/common/AlertSucess";
import {
  engAndNumRegexChecker,
  korAndEngRegexChecker,
} from "../../../../utils/regex";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../../../../context/UserContext";
import { registerForPushNotificationsAsync } from "../../../../utils/expo_notification";
import { registerPushTokenToDB } from "../../../../apis/push-noti";
import studentSelectionDataJSON from "../../../../data/studentSeletionData.json";
import * as Linking from "expo-linking";

export default function JoinFormScreen({ navigation, route }) {
  const [inputDone, setInputDone] = useState(false); //입력여부 체크
  const [codeVerified, setCodeVerified] = useState(false); //가입코드 유효성 체크

  const [gradeValue, setGradeValue] = useState(null);
  const [classValue, setClassValue] = useState(null);
  const [numValue, setNumValue] = useState(null);

  const [name, setName] = useState("");
  const [registerCode, setRegisterCode] = useState("");

  // 선생님을 선택시 반, 번호 "선생님"으로 고정 및 선택 해제시 null 값으로 변경
  useEffect(() => {
    if (gradeValue === "teacher") {
      setClassValue("teacher");
      setNumValue("teacher");
    } else {
      setClassValue(null);
      setNumValue(null);
    }
  }, [gradeValue]);

  // INPUT 을 다 완료 했는지 체킹하는 로직
  useEffect(() => {
    if (gradeValue && classValue && numValue && name !== "") {
      setInputDone(true);
    } else {
      setInputDone(false);
    }
  }, [gradeValue, classValue, numValue, name]);

  const styles = StyleSheet.create({
    header_title: {
      fontSize: 40,
      fontWeight: "700",
      marginHorizontal: 25,
      marginTop: 20,
    },

    wrap: { paddingHorizontal: 25, marginTop: 20 },

    input_wrap: { marginTop: 20 },
    input: {
      borderBottomColor: "#bdbdbd",
      borderBottomWidth: 1,
      paddingVertical: 5,
      marginTop: 8,
      fontSize: 18,
      fontWeight: "300",
    },

    picker_title: { fontSize: 14, fontWeight: "700" },
    picker_wrap: { marginTop: 20 },
    picker: { borderBottomWidth: 1, borderColor: "#b4b4b4", marginTop: 4 },

    divider: { marginTop: 20 },
  });
  const pickerStyle = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      fontWeight: "300",
      paddingVertical: 8,
    },
    inputAndroid: { fontSize: 16, fontWeight: "300", paddingVertical: 8 },
  });
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <OnlyLeftArrowHeader navigation={navigation} />
      <KeyboardAwareScrollView
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <Text style={styles.header_title}>회원가입</Text>

        <View style={styles.wrap}>
          <View style={styles.picker_wrap}>
            <Text style={styles.picker_title}>구분</Text>
            <View style={styles.picker}>
              <RNPickerSelect
                style={pickerStyle}
                placeholder={{ label: "학년을 선택해주세요", value: null }}
                onValueChange={(_value) => {
                  setGradeValue(_value);
                }}
                value={gradeValue}
                items={[
                  ...studentSelectionDataJSON.grade,
                  { label: "선생님", value: "teacher" },
                ]}
              />
            </View>
            {gradeValue !== "teacher" ? (
              <>
                <View style={styles.picker_wrap}>
                  <Text style={styles.picker_title}>학급</Text>
                  <View style={styles.picker}>
                    <RNPickerSelect
                      style={pickerStyle}
                      placeholder={{
                        label: "학급을 선택해주세요",
                        value: null,
                      }}
                      onValueChange={(_value) => {
                        setClassValue(_value);
                      }}
                      value={classValue}
                      items={studentSelectionDataJSON.class}
                    />
                  </View>
                </View>
                <View style={styles.picker_wrap}>
                  <Text style={styles.picker_title}>번호</Text>
                  <View style={styles.picker}>
                    <RNPickerSelect
                      style={pickerStyle}
                      placeholder={{
                        label: "번호를 선택해주세요",
                        value: null,
                      }}
                      onValueChange={(_value) => {
                        setNumValue(_value);
                      }}
                      value={numValue}
                      items={studentSelectionDataJSON.number}
                    />
                  </View>
                </View>
              </>
            ) : null}
            <View style={styles.divider} />
            <View style={styles.input_wrap}>
              <Text style={styles.picker_title}>이름</Text>
              <TextInput
                placeholder="이름"
                returnKeyType="done"
                value={name}
                onChangeText={(value) => {
                  if (korAndEngRegexChecker(value)) {
                    setName(value);
                  }
                }}
                style={styles.input}
              />
            </View>
          </View>

          <VerifyCode
            registerCode={registerCode}
            setRegisterCode={setRegisterCode}
            registerCodeVerified={codeVerified}
            setRegisterCodeVerified={setCodeVerified}
          />
          <Privacy />
          <JoinButton
            navigation={navigation}
            phoneNumber={route.params.phoneNumber}
            name={name}
            gradeValue={gradeValue}
            classValue={classValue}
            numValue={numValue}
            registerCode={registerCode}
            inputDone={inputDone}
            codeVerified={codeVerified}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

function VerifyCode({
  registerCode,
  setRegisterCode,
  registerCodeVerified,
  setRegisterCodeVerified,
}) {
  const [registerCodeAlertStatus, setRegisterCodeAlertStatus] = useState({});

  const handlePostValidateRegisterCode = async () => {
    const { isValidate, message } = await postVerifyRegisterCode(registerCode);
    if (isValidate) {
      setRegisterCodeVerified(true);
      setRegisterCodeAlertStatus({
        status: "success",
        message: message,
      });
    } else {
      setRegisterCodeVerified(false);
      setRegisterCodeAlertStatus({
        status: "error",
        message: message,
      });
    }
  };

  const styles = StyleSheet.create({
    verify_button: {
      alignItems: "center",
      marginLeft: 15,
      paddingHorizontal: 10,
      justifyContent: "center",
      borderRadius: 10,
    },
    verify_button_text: { color: "white", fontWeight: "700" },

    picker_title: { fontSize: 14, fontWeight: "700" },

    input_wrap: { marginTop: 20 },
    input: {
      borderBottomColor: "#bdbdbd",
      borderBottomWidth: 1,
      paddingVertical: 5,
      marginTop: 8,
      fontSize: 18,
      fontWeight: "300",
    },
    input_red: {
      borderBottomColor: "#fb7185",
    },
  });

  return (
    <View>
      <View style={styles.input_wrap}>
        <Text style={styles.picker_title}>가입코드</Text>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            editable={!registerCodeVerified}
            maxLength={5}
            autoCapitalize="characters"
            placeholder="가입코드(5자리)"
            returnKeyType="done"
            value={registerCode}
            onChangeText={(value) => {
              if (engAndNumRegexChecker(value)) {
                setRegisterCode(value);
              }
            }}
            style={[
              styles.input,
              { flex: 1 },
              registerCodeAlertStatus.status === "error"
                ? styles.input_red
                : null,
            ]}
          />
          <TouchableOpacity
            onPress={
              registerCode.length === 5 ? handlePostValidateRegisterCode : null
            }
            style={[
              styles.verify_button,
              registerCode.length === 5
                ? { backgroundColor: "black" }
                : { backgroundColor: "gray" },
            ]}
          >
            <Text style={styles.verify_button_text}>인증하기</Text>
          </TouchableOpacity>
        </View>
      </View>

      {registerCodeAlertStatus.status === "error" ? (
        <AlertError text={registerCodeAlertStatus.message} />
      ) : null}
      {registerCodeAlertStatus.status === "success" ? (
        <AlertSucess text={registerCodeAlertStatus.message} />
      ) : null}
    </View>
  );
}

function Privacy() {
  const styles = StyleSheet.create({
    privacy_container: {
      marginTop: 30,
    },
    privacy_row_text: {
      paddingVertical: 1,
      flexDirection: "row",
      alignItems: "center",
    },
    privacy_text: {
      fontSize: 12,
      fontWeight: "300",
    },
    privacy_link_text: {
      fontSize: 12,
      fontWeight: "700",
    },
  });

  return (
    <View style={styles.privacy_container}>
      <View style={styles.privacy_row_text}>
        <Text style={styles.privacy_text}>회원가입을 진행하면</Text>
      </View>
      <View style={styles.privacy_row_text}>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL("https://static.kch-app.me/privacy.html");
          }}
        >
          <Text style={styles.privacy_link_text}>개인정보처리방침</Text>
        </TouchableOpacity>
        <Text style={styles.privacy_text}>과 </Text>

        <TouchableOpacity
          onPress={() => {
            Linking.openURL("https://terms.kch-app.me");
          }}
        >
          <Text style={styles.privacy_link_text}>이용약관</Text>
        </TouchableOpacity>
        <Text style={styles.privacy_text}>을 동의한 것으로 간주됩니다.</Text>
      </View>
    </View>
  );
}

function JoinButton({
  navigation,
  phoneNumber,
  name,
  gradeValue,
  classValue,
  numValue,
  registerCode,
  inputDone,
  codeVerified,
}) {
  const { setUser } = useContext(UserContext);

  async function handlePostJoin() {
    if (inputDone && codeVerified) {
      try {
        const data = await postJoinUser({
          phoneNumber: phoneNumber,
          name: name,
          grade: gradeValue,
          class: classValue,
          number: numValue,
          registerCode: registerCode,
        }).catch((err) => {
          Alert.alert("회원가입 오류", err.response.data.message, [
            { text: "확인" },
          ]);
        });

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
        console.log(err);
        alert("회원가입 도중 오류가 발생 하였습니다.");
      }
    }
  }

  return (
    <View style={{ marginTop: 20, zIndex: -1 }}>
      <ButtonFullWidth
        text="가입하기"
        onPress={handlePostJoin}
        color={inputDone && codeVerified ? "#00139B" : "#A1A5C0"}
      />
    </View>
  );
}
