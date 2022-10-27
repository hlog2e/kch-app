import { useState, useEffect } from "react";
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

export default function JoinFormScreen({ navigation, route }) {
  const [status, setStatus] = useState({
    status: "sucess",
    message: "문자메세지로 인증번호가 전송되었습니다.",
  });
  const [dropDownDone, setDropDownDone] = useState(false);
  const [registerCodeDone, setRegisterCodeDone] = useState(false);

  //DropDown 구분 선택
  const [gradeOpen, setGradeOpen] = useState(false);
  const [gradeItems, setGradeItems] = useState([
    { label: "1학년", value: 1 },
    { label: "2학년", value: 2 },
    { label: "3학년", value: 3 },
    { label: "선생님", value: "teacher" },
  ]);
  const [gradeValue, setGradeValue] = useState(1);
  //DropDown 반 선택
  const [classOpen, setClassOpen] = useState(false);
  const [classItems, setClassItems] = useState([
    { label: "1반", value: 1 },
    { label: "2반", value: 2 },
    { label: "3반", value: 3 },
    { label: "4반", value: 4 },
    { label: "5반", value: 5 },
    { label: "6반", value: 6 },
    { label: "7반", value: 7 },
    { label: "8반", value: 8 },
    { label: "9반", value: 9 },
  ]);
  const [classValue, setClassValue] = useState();
  //DropDown 번호 선택
  const [numOpen, setNumOpen] = useState(false);
  const [numItems, setNumItems] = useState([
    { label: "1번", value: 1 },
    { label: "2번", value: 2 },
    { label: "3번", value: 3 },
    { label: "4번", value: 4 },
    { label: "5번", value: 5 },
    { label: "6번", value: 6 },
    { label: "7번", value: 7 },
    { label: "8번", value: 8 },
    { label: "9번", value: 9 },
    { label: "10번", value: 10 },
    { label: "11번", value: 11 },
    { label: "12번", value: 12 },
    { label: "13번", value: 13 },
    { label: "14번", value: 14 },
    { label: "15번", value: 15 },
    { label: "16번", value: 16 },
    { label: "17번", value: 17 },
    { label: "18번", value: 18 },
    { label: "19번", value: 19 },
    { label: "20번", value: 20 },
    { label: "21번", value: 21 },
    { label: "22번", value: 22 },
    { label: "23번", value: 23 },
    { label: "24번", value: 24 },
    { label: "25번", value: 25 },
    { label: "26번", value: 26 },
    { label: "27번", value: 27 },
    { label: "28번", value: 28 },
    { label: "29번", value: 29 },
    { label: "30번", value: 30 },
  ]);
  const [numValue, setNumValue] = useState();
  //가입코드 state
  const [registerCode, setRegisterCode] = useState("");

  //DropDown 메뉴들 모두다 선택했는지 Validation
  useEffect(() => {
    if (gradeValue && classValue && numValue) {
      setDropDownDone(true);
    } else {
      setDropDownDone(false);
    }
  }, [gradeValue, classValue, numValue]);
  //가입코드 Input 입력 완료 되었는지 Validation
  useEffect(() => {
    if (registerCode.length === 5) {
      setRegisterCodeDone(true);
    } else {
      setRegisterCodeDone(false);
    }
  }, [gradeValue, classValue, numValue]);

  console.log(route.params.phoneNumber);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <OnlyLeftArrowHeader navigation={navigation} />
      <KeyboardAwareScrollView
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
            {status.status === "error" ? <Alert text={status.message} /> : null}
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
                maxLength="5"
                placeholder="가입코드(5자리)"
                returnKeyType="done"
                style={[styles.input, { flex: 1 }]}
              />
              <TouchableOpacity
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

          <View style={{ marginTop: 60, zIndex: -1 }}>
            <ButtonFullWidth
              text="가입하기"
              color={dropDownDone && registerCodeDone ? "#00139B" : "#A1A5C0"}
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
});
