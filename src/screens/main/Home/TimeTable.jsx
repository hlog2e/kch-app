import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { getTimetable } from "../../../../apis/home/timetable";
import moment from "moment/moment";
import { SafeAreaView } from "react-native-safe-area-context";

import OnlyLeftArrowHeader from "../../../components/common/OnlyLeftArrowHeader";
import { UserContext } from "../../../../context/UserContext";
import FullScreenLoader from "../../../components/common/FullScreenLoader";

export default function TimetableScreen({ navigation }) {
  const { user } = useContext(UserContext);

  const [timetable, setTimetable] = useState();
  const weekFirstDay = moment() //이번주 월요일날짜
    .startOf("weeks")
    .add(1, "days")
    .format("YYYYMMDD");

  const dateArray = [
    weekFirstDay,
    moment(weekFirstDay).add(1, "days").format("YYYYMMDD"),
    moment(weekFirstDay).add(2, "days").format("YYYYMMDD"),
    moment(weekFirstDay).add(3, "days").format("YYYYMMDD"),
    moment(weekFirstDay).add(4, "days").format("YYYYMMDD"),
  ];
  const dayNames = ["월", "화", "수", "목", "금"];
  const times = ["1", "2", "3", "4", "5", "6", "7"];

  async function getTimetableAndSort() {
    const data = await getTimetable(
      user.grade,
      user.class,
      weekFirstDay,
      dateArray[4]
    );
    console.log(data);

    if (!data.hisTimetable) {
      Alert.alert(
        "오류",
        "교육청(NEIS) 서버에 문제가 발생하였습니다. 나중에 다시 시도하세요.",
        [{ text: "확인" }]
      );
    }

    const row = data.hisTimetable[1].row;
    const _timetable = row.reduce((acc, e) => {
      if (!acc[e.ALL_TI_YMD]) acc[e.ALL_TI_YMD] = [];
      acc[e.ALL_TI_YMD].push(e);

      return acc;
    }, {});

    setTimetable(_timetable);
  }

  useEffect(() => {
    if (user.grade === "teacher") {
      alert("선생님께서는 시간표 서비스를 이용하실 수 없습니다.");
      navigation.goBack();
      return;
    }
    getTimetableAndSort();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <OnlyLeftArrowHeader navigation={navigation} />

      <View style={styles.header_container}>
        <Image
          style={{
            width: 50,
            height: 50,
          }}
          source={require("../../../../assets/svgs/timetable.png")}
        />
        <View style={styles.header_text_wrap}>
          <Text style={styles.header_title}>이번주 시간표</Text>
          <Text style={styles.header_desc}>
            {user.grade}학년 {user.class}반
          </Text>
        </View>
      </View>

      {timetable ? (
        <View style={styles.table}>
          <View style={styles.table_header}>
            <View style={{ width: 20 }} />
            {dayNames.map((e) => {
              return (
                <View key={e} style={styles.table_header_item}>
                  <Text style={styles.table_header_item_text}>{e}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.column_wrap}>
            <View style={styles.side_column}>
              {/* 1교시 ~ 7교시 까지 숫자 렌더링 */}
              {times.map((e) => {
                return (
                  <View key={e} style={styles.side_item}>
                    <Text style={styles.side_item_text}>{e}</Text>
                  </View>
                );
              })}
            </View>
            {/* 월요일 컬럼 */}
            <View style={styles.column}>
              {timetable[dateArray[0]].map((e, i) => {
                return (
                  <View style={styles.item}>
                    <Text style={styles.item_text}>{e.ITRT_CNTNT}</Text>
                  </View>
                );
              })}
            </View>
            {/* 화요일 컬럼 */}
            <View style={styles.column}>
              {timetable[dateArray[1]].map((e, i) => {
                return (
                  <View style={styles.item}>
                    <Text style={styles.item_text}>{e.ITRT_CNTNT}</Text>
                  </View>
                );
              })}
            </View>
            {/* 수요일 컬럼 */}
            <View style={styles.column}>
              {timetable[dateArray[2]].map((e, i) => {
                return (
                  <View style={styles.item}>
                    <Text style={styles.item_text}>{e.ITRT_CNTNT}</Text>
                  </View>
                );
              })}
            </View>
            {/* 목요일 컬럼 */}
            <View style={styles.column}>
              {timetable[dateArray[3]].map((e, i) => {
                return (
                  <View style={styles.item}>
                    <Text style={styles.item_text}>{e.ITRT_CNTNT}</Text>
                  </View>
                );
              })}
            </View>
            {/* 금요일 컬럼 */}
            <View style={styles.column}>
              {timetable[dateArray[4]].map((e, i) => {
                return (
                  <View style={styles.item}>
                    <Text style={styles.item_text}>{e.ITRT_CNTNT}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      ) : (
        <FullScreenLoader />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header_container: {
    paddingVertical: 28,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  header_text_wrap: { paddingHorizontal: 16 },
  header_title: {
    fontSize: 24,
    fontWeight: "700",
  },
  header_desc: { color: "gray" },

  table: { flex: 1, paddingHorizontal: 20 },

  table_header: {
    flexDirection: "row",
    height: 50,
    borderBottomWidth: 0.5,
    borderBottomColor: "#d4d4d4",
  },
  table_header_item: {
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  table_header_item_text: { fontWeight: "700", fontSize: 16 },

  column_wrap: { flexDirection: "row" },

  side_column: { marginRight: 15 },
  side_item: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  side_item_text: { fontWeight: "700", fontSize: 16 },

  column: { flex: 1, alignItems: "center" },
  item: {
    height: 50,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  item_text: { fontSize: 12 },
});
