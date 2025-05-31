import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import moment from "moment";
import LodashArray from "lodash";
import { useTheme } from "@react-navigation/native";
import { getNeisTimetable } from "../../../../../apis/neis/timetable";
import { useEffect, useState } from "react";
import FullScreenLoader from "../../../../components/Overlay/FullScreenLoader";
import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NeisTimetable() {
  const { colors } = useTheme();
  const [gradeClass, setGradeClass] = useState({ grade: 1, class: 1 });
  const [data, setData] = useState();
  const [noData, setNoData] = useState(false);

  const times = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const dayNames = ["월", "화", "수", "목", "금"];

  const todayDay = moment().day();
  const weekFirstDay = moment()
    .startOf("weeks")
    .add(1, "days")
    .format("YYYYMMDD");
  const weekLastDay = moment()
    .endOf("week")
    .subtract(1, "days")
    .format("YYYYMMDD");

  async function getNeisData() {
    const res = await getNeisTimetable(
      gradeClass.grade,
      gradeClass.class,
      weekFirstDay,
      weekLastDay
    );

    if (!res.hisTimetable) {
      setNoData(true);
      setData(null);
      return;
    }

    setNoData(false);
    const rowData = res.hisTimetable[1].row;
    const groupedData = LodashArray.groupBy(rowData, "ALL_TI_YMD");
    const flatedData = Object.values(groupedData);
    const uniqueData = flatedData.reduce((acc, current) => {
      acc.push(LodashArray.uniqBy(current, "PERIO"));
      return acc;
    }, []);
    setData(uniqueData);
  }

  const getStoredGradeClass = async () => {
    const storedGradeClass = await AsyncStorage.getItem("gradeClass");
    if (storedGradeClass) {
      setGradeClass(JSON.parse(storedGradeClass));
    }
  };

  useEffect(() => {
    if (gradeClass.grade && gradeClass.class) {
      getNeisData();
    } else {
      setData(null);
    }
  }, [gradeClass]);

  useEffect(() => {
    getStoredGradeClass();
  }, []);

  const styles = StyleSheet.create({
    container: {
      paddingVertical: 10,
    },
    nullWrap: {
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 20,
    },
    nullText: {
      marginTop: 8,
      fontSize: 12,
      fontWeight: "600",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      paddingVertical: 8,
    },
    headerButton: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 8,
    },
    headerButtonWrap: { flexDirection: "row" },
    headerButtonText: {
      fontWeight: "700",
      color: colors.subText,
    },
    dayHeader: {
      flexDirection: "row",
      height: 45,
      borderBottomWidth: 2,
      borderColor: colors.border,
    },
    dayHeaderItem: {
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      borderRightWidth: 1,
      borderTopWidth: 1,
      borderColor: colors.border,
    },
    dayHeaderItemToday: {
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      borderRightWidth: 1,
      borderTopWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.cardBg2,
    },
    dayHeaderItemText: {
      fontWeight: "700",
      fontSize: 16,
      color: colors.text,
    },
    dayHeaderDummy: {
      width: 40,
      borderRightWidth: 2,
      borderLeftWidth: 1,
      borderTopWidth: 1,
      borderColor: colors.border,
    },
    tableWrap: { flexDirection: "row" },
    dataWrap: { flexDirection: "row", flex: 1 },
    leftSideCol: { marginRight: 0 },
    leftSideColItem: {
      height: 50,
      width: 40,
      alignItems: "center",
      justifyContent: "center",
      borderBottomWidth: 1,
      borderLeftWidth: 1,
      borderRightWidth: 2,
      borderColor: colors.border,
    },
    leftSideColText: {
      fontWeight: "700",
      fontSize: 16,
      color: colors.text,
    },
    dataCol: {
      flex: 1,
      alignItems: "center",
      borderRightWidth: 1,
      borderColor: colors.border,
    },
    dataColToday: {
      flex: 1,
      alignItems: "center",
      borderRightWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.cardBg2,
    },
    dataItem: {
      height: 50,
      width: "100%",
      paddingHorizontal: 4,
      alignItems: "center",
      justifyContent: "center",
      borderBottomWidth: 1,
      borderColor: colors.border,
    },
    dataText: {
      textAlign: "center",
      fontSize: 12,
      color: colors.text,
      fontWeight: "300",
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>이번주 시간표</Text>
        <View style={styles.headerButtonWrap}>
          <RNPickerSelect
            fixAndroidTouchableBug
            style={styles.picker}
            items={[
              { label: "1학년", value: 1 },
              { label: "2학년", value: 2 },
              { label: "3학년", value: 3 },
            ]}
            value={gradeClass.grade}
            onValueChange={(_value) => {
              AsyncStorage.setItem(
                "gradeClass",
                JSON.stringify({ grade: _value, class: gradeClass.class })
              );
              setGradeClass((_prev) => ({ ..._prev, grade: _value }));
            }}
          >
            <TouchableOpacity style={styles.headerButton}>
              <Text style={styles.headerButtonText}>
                {gradeClass.grade}학년
              </Text>
              <Ionicons
                name="caret-down-outline"
                size={12}
                color={colors.subText}
              />
            </TouchableOpacity>
          </RNPickerSelect>

          <RNPickerSelect
            fixAndroidTouchableBug
            style={styles.picker}
            items={[
              { label: "1반", value: 1 },
              { label: "2반", value: 2 },
              { label: "3반", value: 3 },
              { label: "4반", value: 4 },
              { label: "5반", value: 5 },
              { label: "6반", value: 6 },
              { label: "7반", value: 7 },
              { label: "8반", value: 8 },
              { label: "9반", value: 9 },
            ]}
            value={gradeClass.class}
            onValueChange={(_value) => {
              AsyncStorage.setItem(
                "gradeClass",
                JSON.stringify({ grade: gradeClass.grade, class: _value })
              );
              setGradeClass((_prev) => ({ ..._prev, class: _value }));
            }}
          >
            <TouchableOpacity style={styles.headerButton}>
              <Text style={styles.headerButtonText}>{gradeClass.class}반</Text>
              <Ionicons
                name="caret-down-outline"
                size={12}
                color={colors.subText}
              />
            </TouchableOpacity>
          </RNPickerSelect>
        </View>
      </View>

      {noData && (
        <View style={styles.nullWrap}>
          <Text style={[styles.nullText, { color: colors.subText }]}>
            교육청(NEIS)서버에 시간표 정보가 없습니다.
          </Text>
        </View>
      )}

      {data && (
        <>
          <View style={styles.dayHeader}>
            <View style={styles.dayHeaderDummy} />
            {dayNames.map((dayName, i) => (
              <View
                key={dayName}
                style={
                  i + 1 === todayDay
                    ? styles.dayHeaderItemToday
                    : styles.dayHeaderItem
                }
              >
                <Text style={styles.dayHeaderItemText}>{dayName}</Text>
              </View>
            ))}
          </View>
          <View style={styles.tableWrap}>
            <View style={styles.leftSideCol}>
              {times.map((time) => (
                <View key={time} style={styles.leftSideColItem}>
                  <Text style={styles.leftSideColText}>{time}</Text>
                </View>
              ))}
            </View>
            <View style={styles.dataWrap}>
              {dayNames.map((_, idx) => {
                const isToday = todayDay === idx + 1;
                return (
                  <View
                    key={idx}
                    style={isToday ? styles.dataColToday : styles.dataCol}
                  >
                    {data[idx]
                      ? data[idx].map((item) => (
                          <View
                            key={JSON.stringify(item)}
                            style={styles.dataItem}
                          >
                            <Text style={styles.dataText}>
                              {item.ITRT_CNTNT}
                            </Text>
                          </View>
                        ))
                      : null}
                  </View>
                );
              })}
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}
