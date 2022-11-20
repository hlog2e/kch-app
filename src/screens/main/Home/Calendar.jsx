import { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import moment from "moment/moment";

import { Octicons } from "@expo/vector-icons";
import { useQuery } from "react-query";
import { getSchedule } from "../../../../apis/home/schedule";

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(moment());
  const startDate = moment(selectedDate).startOf("month").format("YYYYMMDD");
  const endDate = moment(selectedDate).endOf("month").format("YYYYMMDD");

  const [schedules, setSchedules] = useState([]);

  const { status } = useQuery(
    ["schedules", startDate, endDate],
    () => {
      return getSchedule(startDate, endDate);
    },
    {
      onSuccess: (data) => {
        if (data.SchoolSchedule) {
          setSchedules(data.SchoolSchedule[1].row);
        } else {
          Alert.alert("오류", "해당 일자에 데이터가 없습니다!", [
            { text: "확인" },
          ]);
          setSchedules([]);
        }
      },
      onError: (err) => {
        Alert.alert("오류", "일시적으로 데이터를 불러올 수 없습니다!", [
          { text: "확인" },
        ]);
      },
    }
  );

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <MonthSelectHeader
        selectedMonth={selectedDate}
        setSelectedMonth={setSelectedDate}
      />
      {status === "success" ? (
        <FlatList data={schedules} renderItem={Item} />
      ) : null}
    </SafeAreaView>
  );
}

function MonthSelectHeader({ selectedMonth, setSelectedMonth }) {
  const styles = StyleSheet.create({
    container: {
      paddingTop: 40,
      marginBottom: 25,
      flexDirection: "row",
      alignItems: "center",
    },
    chevron: { marginHorizontal: 20 },
    text: { fontSize: 40, fontWeight: "600" },
  });

  function subtractMonth() {
    const subtracted = moment(selectedMonth).subtract("1", "M");
    setSelectedMonth(subtracted);
  }

  function addMonth() {
    const added = moment(selectedMonth).add("1", "M");
    setSelectedMonth(added);
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.chevron} onPress={subtractMonth}>
        <Octicons name="chevron-left" size={36} color="gray" />
      </TouchableOpacity>
      <Text style={styles.text}>
        {moment(selectedMonth).format("YY년 M월")}
      </Text>
      <TouchableOpacity style={styles.chevron} onPress={addMonth}>
        <Octicons name="chevron-right" size={36} color="gray" />
      </TouchableOpacity>
    </View>
  );
}

function Item({ item }) {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: "white",
      marginVertical: 7,
      marginHorizontal: 20,
      height: 130,
      borderRadius: 25,
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
    },
    event_name: {
      marginTop: 10,
      fontSize: 16,
    },
    footer: {
      marginTop: 22,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    grade_info: { flexDirection: "row", alignItems: "center" },
    grade_info_text: { color: "gray", marginRight: 5 },
    grade_info_text_black: { marginRight: 5 },
    source_info_text: { color: "#d4d4d4" },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{moment(item.AA_YMD).format("D")}일</Text>
      <Text style={styles.event_name}>{item.EVENT_NM}</Text>
      <View style={styles.footer}>
        <View style={styles.grade_info}>
          <Text style={styles.grade_info_text}>해당학년</Text>
          {item.ONE_GRADE_EVENT_YN === "Y" ? (
            <Text style={styles.grade_info_text_black}>1학년</Text>
          ) : null}
          {item.TW_GRADE_EVENT_YN === "Y" ? (
            <Text style={styles.grade_info_text_black}>2학년</Text>
          ) : null}
          {item.THREE_GRADE_EVENT_YN === "Y" ? (
            <Text style={styles.grade_info_text_black}>3학년</Text>
          ) : null}
        </View>
        <Text style={styles.source_info_text}>NEIS 제공</Text>
      </View>
    </View>
  );
}
