import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import OnlyLeftArrowHeader from "../../../components/common/OnlyLeftArrowHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import RNPickerSelect from "react-native-picker-select";

import studentSelectionData from "../../../../data/studentSeletionData.json";
import ButtonFullWidth from "../../../components/common/ButtonFullWidth";
import { useMutation } from "react-query";
import { postModifyUserInfo } from "../../../../apis/more/more";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ModifyUserInfoScreen({ navigation }) {
  const { user, setUser } = useContext(UserContext);

  const [isChanged, setIsChanged] = useState(false);

  const [gradeValue, setGradeValue] = useState(Number(user.grade));
  const [classValue, setClassValue] = useState(Number(user.class));
  const [numValue, setNumValue] = useState(Number(user.number));

  const { mutate } = useMutation(postModifyUserInfo);

  const styles = StyleSheet.create({
    container: { flex: 1 },

    wrap: { flex: 1, paddingHorizontal: 18 },
    header_title: { fontSize: 32, fontWeight: "700", marginTop: 16 },
    picker_section: { paddingVertical: 28 },
    picker_wrap: { paddingVertical: 14 },
    title: { fontSize: 20, fontWeight: "600" },

    picker: { borderBottomWidth: 1, borderColor: "#b4b4b4", marginTop: 8 },
  });

  const pickerStyle = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      fontWeight: "300",
      paddingVertical: 8,
    },
    inputAndroid: {},
  });

  const handleModifyUserInfo = async () => {
    mutate(
      { grade: gradeValue, class: classValue, number: numValue },
      {
        onSuccess: async () => {
          const newUserData = {
            ...user,
            grade: String(gradeValue),
            class: String(classValue),
            number: String(numValue),
          };

          await AsyncStorage.setItem("user", JSON.stringify(newUserData));
          setUser(newUserData);

          navigation.goBack();
        },
        onError: (_err) => {
          console.log(_err);
          alert("정보 수정 중 오류가 발생하였습니다!");
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnlyLeftArrowHeader navigation={navigation} />
      <View style={styles.wrap}>
        <Text style={styles.header_title}>내 정보 수정</Text>
        <View style={styles.picker_section}>
          <View style={styles.picker_wrap}>
            <Text style={styles.title}>학년</Text>
            <View style={styles.picker}>
              <RNPickerSelect
                style={pickerStyle}
                onValueChange={(_value) => {
                  setIsChanged(true);
                  setGradeValue(_value);
                }}
                value={gradeValue}
                items={studentSelectionData.grade}
              />
            </View>
          </View>
          <View style={styles.picker_wrap}>
            <Text style={styles.title}>반</Text>
            <View style={styles.picker}>
              <RNPickerSelect
                style={pickerStyle}
                onValueChange={(_value) => {
                  setIsChanged(true);
                  setClassValue(_value);
                }}
                value={classValue}
                items={studentSelectionData.class}
              />
            </View>
          </View>
          <View style={styles.picker_wrap}>
            <Text style={styles.title}>번호</Text>
            <View style={styles.picker}>
              <RNPickerSelect
                style={pickerStyle}
                onValueChange={(_value) => {
                  setIsChanged(true);
                  setNumValue(_value);
                }}
                value={numValue}
                items={studentSelectionData.number}
              />
            </View>
          </View>
        </View>
        <ButtonFullWidth
          disable={!isChanged}
          onPress={handleModifyUserInfo}
          color={isChanged ? "#00139B" : "#A1A5C0"}
          text={"수정 완료"}
        />
      </View>
    </SafeAreaView>
  );
}
