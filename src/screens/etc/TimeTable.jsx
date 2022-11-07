import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { getTimetable } from "../../../apis/home/timetable";
import moment from "moment/moment";
import { SafeAreaView } from "react-native-safe-area-context";

import OnlyLeftArrowHeader from "../../components/common/OnlyLeftArrowHeader";

export default function TimetableScreen({ navigation }) {
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
    const data = await getTimetable("2", "5", weekFirstDay, dateArray[4]);

    const row = data.hisTimetable[1].row;
    const _timetable = row.reduce((acc, e) => {
      if (!acc[e.ALL_TI_YMD]) acc[e.ALL_TI_YMD] = [];
      acc[e.ALL_TI_YMD].push(e);

      return acc;
    }, {});

    setTimetable(_timetable);
  }

  useEffect(() => {
    getTimetableAndSort();
  }, []);

  return (
    <SafeAreaView>
      <OnlyLeftArrowHeader navigation={navigation} />

      <View style={styles.header_container}>
        <Image
          style={{
            width: 50,
            height: 50,
          }}
          source={require("../../../assets/svgs/timetable.png")}
        />
        <View style={styles.header_text_wrap}>
          <Text style={styles.header_title}>이번주 시간표</Text>
          <Text style={styles.header_desc}>2학년 5반</Text>
        </View>
      </View>

      {timetable ? (
        <View style={styles.table}>
          <View style={styles.table_header}>
            <View style={{ width: 20 }} />
            {dayNames.map((e) => {
              return (
                <View style={styles.table_header_item}>
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
                  <View style={styles.side_item}>
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
      ) : null}
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

  side_column: { backgroundColor: "blue", marginRight: 15 },
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
