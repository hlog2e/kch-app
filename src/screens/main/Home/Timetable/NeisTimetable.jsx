import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import moment from "moment";
import LodashArray from "lodash";
import { useTheme } from "@react-navigation/native";
import { getTimetable } from "../../../../../apis/home/timetable";
import { useEffect, useState } from "react";
import FullScreenLoader from "../../../../components/common/FullScreenLoader";
import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NeisTimetable() {
  const { colors } = useTheme();
  const [gradeClass, setGradeClass] = useState({ grade: 1, class: 1 });

  const [data, setData] = useState();
  const [times, setTimes] = useState([]);

  const dayNames = ["월", "화", "수", "목", "금"];

  const todayDay = moment().day();

  const weekFirstDay = moment() //이번주 월요일날짜
    .startOf("weeks")
    .add(1, "days")
    .format("YYYYMMDD");

  const weekLastDay = moment()
    .endOf("week")
    .subtract(1, "days")
    .format("YYYYMMDD");

  async function getNeisTimetable() {
    const res = await getTimetable(
      gradeClass.grade,
      gradeClass.class,
      weekFirstDay,
      weekLastDay
    );

    if (!res.hisTimetable) {
      Alert.alert(
        "오류",
        "교육청(NEIS)서버에 시간표 정보가 없거나, 서버가 응답하지 않습니다.",
        [{ text: "확인" }]
      );
    }

    const rowData = res.hisTimetable[1].row;
    const groupedData = LodashArray.groupBy(rowData, "ALL_TI_YMD");
    const flatedData = Object.values(groupedData);

    const uniqueData = flatedData.reduce((acc, current) => {
      acc.push(LodashArray.uniqBy(current, "PERIO"));
      return acc;
    }, []);

    const colMaxLength = uniqueData.reduce((acc, current) => {
      current.length > 0 ? (acc = current.length) : acc;
      return acc;
    }, 0);

    let timesArray = [];
    for (let i = 1; i <= colMaxLength; i++) {
      timesArray.push(i);
    }

    setTimes(timesArray);
    setData(uniqueData);
  }

  const getStoredGradeClass = async () => {
    const storedGradeClass = await AsyncStorage.getItem("gradeClass");

    if (storedGradeClass) {
      const parsed = JSON.parse(storedGradeClass);
      setGradeClass(parsed);
    }
  };

  useEffect(() => {
    if (gradeClass.grade && gradeClass.class) {
      getNeisTimetable();
    }

    if (!gradeClass.grade || !gradeClass.class) {
      setData(null);
    }
  }, [gradeClass]);

  useEffect(() => {
    getStoredGradeClass();
  }, []);

  const styles = StyleSheet.create({
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
    <View style={styles.container}>
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
              setGradeClass((_prev) => {
                return { ..._prev, grade: _value };
              });
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
              setGradeClass((_prev) => {
                return { ..._prev, class: _value };
              });
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

      {data ? (
        <>
          <View style={styles.dayHeader}>
            <View style={styles.dayHeaderDummy} />
            {dayNames.map((e, i) => {
              return (
                <View
                  key={e}
                  style={
                    i + 1 === todayDay
                      ? styles.dayHeaderItemToday
                      : styles.dayHeaderItem
                  }
                >
                  <Text style={styles.dayHeaderItemText}>{e}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.tableWrap}>
            <View style={styles.leftSideCol}>
              {/* 1교시 ~ 7교시 까지 숫자 렌더링 */}
              {times.map((e) => {
                return (
                  <View key={e} style={styles.leftSideColItem}>
                    <Text style={styles.leftSideColText}>{e}</Text>
                  </View>
                );
              })}
            </View>
            <View style={styles.dataWrap}>
              {/* 월요일 컬럼 */}
              <View
                style={todayDay === 1 ? styles.dataColToday : styles.dataCol}
              >
                {data[0]
                  ? data[0].map((e) => {
                      return (
                        <View key={JSON.stringify(e)} style={styles.dataItem}>
                          <Text style={styles.dataText}>{e.ITRT_CNTNT}</Text>
                        </View>
                      );
                    })
                  : null}
              </View>
              {/* 화요일 컬럼 */}
              <View
                style={todayDay === 2 ? styles.dataColToday : styles.dataCol}
              >
                {data[1]
                  ? data[1].map((e) => {
                      return (
                        <View key={JSON.stringify(e)} style={styles.dataItem}>
                          <Text style={styles.dataText}>{e.ITRT_CNTNT}</Text>
                        </View>
                      );
                    })
                  : null}
              </View>
              {/* 수요일 컬럼 */}
              <View
                style={todayDay === 3 ? styles.dataColToday : styles.dataCol}
              >
                {data[2]
                  ? data[2].map((e) => {
                      return (
                        <View key={JSON.stringify(e)} style={styles.dataItem}>
                          <Text style={styles.dataText}>{e.ITRT_CNTNT}</Text>
                        </View>
                      );
                    })
                  : null}
              </View>
              {/* 목요일 컬럼 */}
              <View
                style={todayDay === 4 ? styles.dataColToday : styles.dataCol}
              >
                {data[3]
                  ? data[3].map((e) => {
                      return (
                        <View key={JSON.stringify(e)} style={styles.dataItem}>
                          <Text style={styles.dataText}>{e.ITRT_CNTNT}</Text>
                        </View>
                      );
                    })
                  : null}
              </View>
              {/* 금요일 컬럼 */}
              <View
                style={todayDay === 5 ? styles.dataColToday : styles.dataCol}
              >
                {data[4]
                  ? data[4].map((e, i) => {
                      return (
                        <View key={JSON.stringify(e)} style={styles.dataItem}>
                          <Text style={styles.dataText}>{e.ITRT_CNTNT}</Text>
                        </View>
                      );
                    })
                  : null}
              </View>
            </View>
          </View>
        </>
      ) : (
        <FullScreenLoader />
      )}
    </View>
  );
}
