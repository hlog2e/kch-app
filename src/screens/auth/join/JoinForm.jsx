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

import ButtonFullWidth from "../../../components/common/ButtonFullWidth";
import OnlyLeftArrowHeader from "../../../components/common/OnlyLeftArrowHeader";
import DropDownPicker from "react-native-dropdown-picker";
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
  const { setUser } = useContext(UserContext);

  const [dropDownDone, setDropDownDone] = useState(false); //입력여부 체크
  const [registerCodeDone, setRegisterCodeDone] = useState(false); //입력여부 체크
  const [registerCodeVerified, setRegisterCodeVerified] = useState(false); //가입코드 유효성 체크
  const [registerCodeAlertStatus, setRegisterCodeAlertStatus] = useState({});

  //DropDown 구분 선택
  const [gradeOpen, setGradeOpen] = useState(false);

  const [gradeItems, setGradeItems] = useState([
    ...studentSelectionDataJSON.grade,
    { label: "선생님", value: "teacher" },
  ]);
  const [gradeValue, setGradeValue] = useState(1);
  //DropDown 반 선택
  const [classOpen, setClassOpen] = useState(false);
  const [classItems, setClassItems] = useState(studentSelectionDataJSON.class);
  const [classValue, setClassValue] = useState();
  //DropDown 번호 선택
  const [numOpen, setNumOpen] = useState(false);
  const [numItems, setNumItems] = useState(studentSelectionDataJSON.number);
  const [numValue, setNumValue] = useState();
  //가입코드 state
  const [registerCode, setRegisterCode] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (gradeValue === "teacher") {
      setClassValue("선생님");
      setNumValue("선생님");
    }
  }, [gradeValue]);

  //DropDown 메뉴들 모두다 선택했는지 Validation
  useEffect(() => {
    if (gradeValue && name) {
      setDropDownDone(true);
    } else {
      setDropDownDone(false);
    }
  }, [gradeValue, name]);
  //가입코드 Input 입력 완료 되었는지 Validation
  useEffect(() => {
    if (registerCode.length === 5) {
      setRegisterCodeDone(true);
    } else {
      setRegisterCodeDone(false);
    }
  }, [registerCode]);

  async function handlePostValidateRegisterCode() {
    const { isValidate, message } = await postVerifyRegisterCode(registerCode);
    if (isValidate) {
      setRegisterCodeVerified(true);
      setRegisterCodeAlertStatus({
        status: "sucess",
        message: message,
      });
    } else {
      setRegisterCodeVerified(false);
      setRegisterCodeAlertStatus({
        status: "error",
        message: message,
      });
    }
  }

  async function handlePostJoin() {
    if (dropDownDone && registerCodeDone && registerCodeVerified) {
      try {
        const data = await postJoinUser({
          phoneNumber: route.params.phoneNumber,
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
            console.log(_token);
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
    <SafeAreaView style={{ flex: 1 }}>
      <OnlyLeftArrowHeader navigation={navigation} />
      <KeyboardAwareScrollView
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <Text
          style={{
            fontSize: 40,
            fontWeight: "700",
            marginHorizontal: 25,
            marginTop: 20,
          }}
        >
          회원가입
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
            <Text style={{ fontSize: 14, color: "gray" }}>구분</Text>
            <DropDownPicker
              listMode="SCROLLVIEW"
              zIndex={3000}
              style={styles.dropdown}
              textStyle={styles.dropdown_text}
              dropDownContainerStyle={styles.dropdown_container}
              selectedItemContainerStyle={
                styles.dropdown_selected_item_container
              }
              placeholder="학년"
              open={gradeOpen}
              value={gradeValue}
              items={gradeItems}
              setOpen={setGradeOpen}
              setValue={setGradeValue}
              setItems={setGradeItems}
            />
            {gradeValue !== "teacher" ? (
              <>
                <Text
                  style={{
                    fontSize: 14,
                    color: "gray",

                    marginTop: 20,
                  }}
                >
                  학급
                </Text>
                <DropDownPicker
                  listMode="SCROLLVIEW"
                  zIndex={2000}
                  style={styles.dropdown}
                  textStyle={styles.dropdown_text}
                  dropDownContainerStyle={styles.dropdown_container}
                  selectedItemContainerStyle={
                    styles.dropdown_selected_item_container
                  }
                  placeholder="반"
                  open={classOpen}
                  value={classValue}
                  items={classItems}
                  setOpen={setClassOpen}
                  setValue={setClassValue}
                  setItems={setClassItems}
                />
                <Text
                  style={{
                    fontSize: 14,
                    color: "gray",

                    marginTop: 20,
                  }}
                >
                  번호
                </Text>
                <DropDownPicker
                  listMode="SCROLLVIEW"
                  zIndex={1000}
                  style={styles.dropdown}
                  textStyle={styles.dropdown_text}
                  dropDownContainerStyle={styles.dropdown_container}
                  selectedItemContainerStyle={
                    styles.dropdown_selected_item_container
                  }
                  placeholder="번호"
                  open={numOpen}
                  value={numValue}
                  items={numItems}
                  setOpen={setNumOpen}
                  setValue={setNumValue}
                  setItems={setNumItems}
                />
              </>
            ) : null}
            <View>
              <Text
                style={{
                  fontSize: 14,
                  color: "gray",
                  marginTop: 30,
                  marginBottom: 10,
                }}
              >
                이름
              </Text>
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
            <Text
              style={{
                fontSize: 14,
                color: "gray",

                marginTop: 50,
                marginBottom: 10,
              }}
            >
              가입코드
            </Text>
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
                style={[styles.input, { flex: 1 }]}
              />
              <TouchableOpacity
                onPress={handlePostValidateRegisterCode}
                style={{
                  alignItems: "center",
                  marginLeft: 15,
                  backgroundColor: "black",
                  paddingHorizontal: 10,
                  justifyContent: "center",
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: "white", fontWeight: "700" }}>
                  인증하기
                </Text>
              </TouchableOpacity>
            </View>
          </View>

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
              <Text style={styles.privacy_text}>
                을 동의한 것으로 간주됩니다.
              </Text>
            </View>
          </View>

          {registerCodeAlertStatus.status === "error" ? (
            <AlertError text={registerCodeAlertStatus.message} />
          ) : null}
          {registerCodeAlertStatus.status === "sucess" ? (
            <AlertSucess text={registerCodeAlertStatus.message} />
          ) : null}

          <View style={{ marginTop: 20, zIndex: -1 }}>
            <ButtonFullWidth
              text="가입하기"
              onPress={handlePostJoin}
              color={
                dropDownDone && registerCodeDone && registerCodeVerified
                  ? "#00139B"
                  : "#A1A5C0"
              }
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
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
  dropdown: {
    borderWidth: 0,
    backgroundColor: null,
    borderBottomWidth: 2,
    borderRadius: 0,
    borderColor: "#bdbdbd",
  },
  dropdown_text: { fontSize: 18, fontWeight: "600" },
  dropdown_container: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 15,
    borderWidth: 0,

    overflow: "visible",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  dropdown_selected_item_container: {
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
  },

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
