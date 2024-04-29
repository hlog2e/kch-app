import { useTheme } from "@react-navigation/native";
import { View, Text, StyleSheet, TextInput } from "react-native";
import moment from "moment";
import { useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useMutation, useQuery } from "react-query";
import {
  getCustomTimetable,
  postCustomTimetable,
} from "../../../../../apis/home/timetable";

export default function CustomTimetable() {
  const alert = useAlert();
  const times = ["1", "2", "3", "4", "5", "6", "7"];
  const dayNames = ["월", "화", "수", "목", "금"];
  const todayDay = moment().day();

  const { data: serverData } = useQuery("CustomTimetable", getCustomTimetable);
  const { mutate } = useMutation(postCustomTimetable);

  const [data, setData] = useState([
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
  ]);

  useEffect(() => {
    if (serverData && serverData.length !== 0) {
      setData(serverData);
    }
  }, [serverData]);

  const handleEditingEnd = async () => {
    mutate(data, {
      onError: () => {
        alert.error(
          "나만의 시간표 서버가 응답하지 않습니다.\n(시간표를 수정하더라도 반영되지 않을 수 있습니다.)"
        );
      },
    });
  };

  const { colors } = useTheme();
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
      textAlignVertical: "center",
      fontSize: 12,
      color: colors.text,
      fontWeight: "300",
      width: "100%",
      height: "100%",
    },
  });

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>나만의 시간표</Text>
      </View>

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
          <View style={todayDay === 1 ? styles.dataColToday : styles.dataCol}>
            {data[0]
              ? data[0].map((e, i) => {
                  return (
                    <View key={"0," + i} style={styles.dataItem}>
                      <TextInput
                        value={e}
                        onEndEditing={handleEditingEnd}
                        onChangeText={(_value) =>
                          setData((_prev) => {
                            const newData = [..._prev];
                            newData[0][i] = _value;
                            return newData;
                          })
                        }
                        style={styles.dataText}
                      />
                    </View>
                  );
                })
              : null}
          </View>
          {/* 화요일 컬럼 */}
          <View style={todayDay === 2 ? styles.dataColToday : styles.dataCol}>
            {data[1]
              ? data[1].map((e, i) => {
                  return (
                    <View key={"1," + i} style={styles.dataItem}>
                      <TextInput
                        value={e}
                        onEndEditing={handleEditingEnd}
                        onChangeText={(_value) =>
                          setData((_prev) => {
                            const newData = [..._prev];
                            newData[1][i] = _value;
                            return newData;
                          })
                        }
                        style={styles.dataText}
                      />
                    </View>
                  );
                })
              : null}
          </View>
          {/* 수요일 컬럼 */}
          <View style={todayDay === 3 ? styles.dataColToday : styles.dataCol}>
            {data[2]
              ? data[2].map((e, i) => {
                  return (
                    <View key={"2," + i} style={styles.dataItem}>
                      <TextInput
                        value={e}
                        onEndEditing={handleEditingEnd}
                        onChangeText={(_value) =>
                          setData((_prev) => {
                            const newData = [..._prev];
                            newData[2][i] = _value;
                            return newData;
                          })
                        }
                        style={styles.dataText}
                      />
                    </View>
                  );
                })
              : null}
          </View>
          {/* 목요일 컬럼 */}
          <View style={todayDay === 4 ? styles.dataColToday : styles.dataCol}>
            {data[3]
              ? data[3].map((e, i) => {
                  return (
                    <View key={"3," + i} style={styles.dataItem}>
                      <TextInput
                        value={e}
                        onEndEditing={handleEditingEnd}
                        onChangeText={(_value) =>
                          setData((_prev) => {
                            const newData = [..._prev];
                            newData[3][i] = _value;
                            return newData;
                          })
                        }
                        style={styles.dataText}
                      />
                    </View>
                  );
                })
              : null}
          </View>
          {/* 금요일 컬럼 */}
          <View style={todayDay === 5 ? styles.dataColToday : styles.dataCol}>
            {data[4]
              ? data[4].map((e, i) => {
                  return (
                    <View key={"4," + i} style={styles.dataItem}>
                      <TextInput
                        value={e}
                        onEndEditing={handleEditingEnd}
                        onChangeText={(_value) =>
                          setData((_prev) => {
                            const newData = [..._prev];
                            newData[4][i] = _value;
                            return newData;
                          })
                        }
                        style={styles.dataText}
                      />
                    </View>
                  );
                })
              : null}
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
