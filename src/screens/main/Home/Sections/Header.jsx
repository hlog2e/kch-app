import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../../context/UserContext";
import { useTheme } from "@react-navigation/native";
import moment from "moment";

export default function Header({ navigation }) {
  const nowTime = moment().format("H");
  const { user } = useContext(UserContext);
  const { colors } = useTheme();

  const [grade, setGrade] = useState(null);
  const [alias, setAlias] = useState(null);

  const [greetText, setGreetText] = useState("");
  const grettings = [
    "별이 빛나는 밤입니다:)",
    "안 주무시나요?:)",
    "일찍 일어나셨네요?:)",
    "좋은 아침입니다:)",
    "배고픈 시간이네요..",
    "점심 식사는 하셨나요?",
    "즐거운 오후입니다:)",
    "즐거운 저녁 되세요:)",
    "오늘 하루 수고했어요:)",
    "안녕히 주무세요:)",
  ];

  useEffect(() => {
    if (nowTime >= 0 && nowTime < 3) {
      setGreetText(grettings[0]);
    } else if (nowTime >= 3 && nowTime < 6) {
      setGreetText(grettings[1]);
    } else if (nowTime >= 6 && nowTime < 8) {
      setGreetText(grettings[2]);
    } else if (nowTime >= 8 && nowTime < 10) {
      setGreetText(grettings[3]);
    } else if (nowTime >= 10 && nowTime < 12) {
      setGreetText(grettings[4]);
    } else if (nowTime >= 12 && nowTime < 14) {
      setGreetText(grettings[5]);
    } else if (nowTime >= 14 && nowTime < 17) {
      setGreetText(grettings[6]);
    } else if (nowTime >= 17 && nowTime < 22) {
      setGreetText(grettings[7]);
    } else if (nowTime >= 22 && nowTime < 24) {
      setGreetText(grettings[8]);
    }
  }, []);

  const getAge = (_birthYear) => {
    const today = moment().format("YYYY");
    return today - _birthYear + 1;
  };

  useEffect(() => {
    if (user.type === "undergraduate") {
      const age = getAge(user.birthYear);

      if (age === 17) setGrade("1학년");
      if (age === 18) setGrade("2학년");
      if (age === 19) setGrade("3학년");
    }
    if (user.type === "teacher") {
      setAlias("선생");
    }
  }, []);

  const styles = StyleSheet.create({
    header: {
      marginHorizontal: 14,
      marginTop: 30,
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
    },
    headerName: { fontSize: 18, fontWeight: "200", color: colors.subText },
    headerTitle: {
      fontSize: 22,
      fontWeight: "700",
      marginTop: 2,
      color: colors.text,
    },
    studentIdButton: {
      height: 40,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 15,
      paddingVertical: 2,
      paddingHorizontal: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    studentIdButtonText: {
      fontSize: 10,
      marginLeft: 2,
      color: "gray",
      fontWeight: "600",
    },
  });

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerName}>
          {grade && grade + " "}
          {user.name}
          {alias && " " + alias}님,
        </Text>
        <Text style={styles.headerTitle}>{greetText}</Text>
      </View>
      {user.type === "undergraduate" && (
        <TouchableOpacity
          onPress={() => {
            navigation.push("StudentIDScreen");
          }}
          style={styles.studentIdButton}
        >
          <Ionicons name="barcode-outline" size={24} color={colors.icon} />
          <Text style={styles.studentIdButtonText}>{"모바일 학생증"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
