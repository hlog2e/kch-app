import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { useEffect, useState } from "react";
import moment from "moment";
import { useQuery } from "react-query";
import { getSchedule } from "../../../../apis/home/schedule";
import FullScreenLoader from "../../../components/Overlay/FullScreenLoader";
import uuid from "react-native-uuid";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../../components/Header/Header";

export default function CalendarScreen({ navigation }) {
  const { colors } = useTheme();
  const todayDate = moment().format("YYYY-MM-DD");

  const [selDate, setSelDate] = useState(todayDate);
  const [selDataCount, setSelDataCount] = useState(0);
  const [firstDate, setFistDate] = useState(
    moment().startOf("M").format("YYYYMMDD")
  );
  const [lastDate, setLastDate] = useState(
    moment().endOf("M").format("YYYYMMDD")
  );

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["NewCalendar", firstDate, lastDate],
    queryFn: () => {
      return getSchedule(firstDate, lastDate);
    },
  });

  // 만약 data가 존재하고, data.SchoolSchedule이 존재 할때만 리턴 | 아니면 null
  const schedules = data
    ? data.SchoolSchedule
      ? data.SchoolSchedule[1].row
      : []
    : null;

  const [markedDates, setMarkedDates] = useState({});

  // 날짜별로 marked 하는 로직
  useEffect(() => {
    if (schedules) {
      schedules.map((_data) => {
        setMarkedDates((_prevState) => {
          let willUpdateNewItem = {};
          if (_data.EVENT_NM === "토요휴업일") {
            willUpdateNewItem = {
              [moment(_data.AA_YMD).format("YYYY-MM-DD")]: {
                marked: true,
                dotColor: "pink",
              },
            };
          } else {
            willUpdateNewItem = {
              [moment(_data.AA_YMD).format("YYYY-MM-DD")]: { marked: true },
            };
          }

          return { ..._prevState, ...willUpdateNewItem };
        });
      });
    }
  }, [data]);

  const markedDatesWithSelDate = {
    ...markedDates,
    [selDate]: { selected: true, selectedColor: "#60a5fa" },
  };

  useEffect(() => {
    setFistDate(moment(selDate).startOf("M").format("YYYYMMDD"));
    setLastDate(moment(selDate).endOf("M").format("YYYYMMDD"));
  }, [selDate]);

  LocaleConfig.locales["kr"] = {
    monthNames: [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ],
    monthNamesShort: [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ],
    dayNames: [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ],
    dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
  };
  LocaleConfig.defaultLocale = "kr";

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      flex: 1,
    },

    calendar: { marginTop: 18 },
    month_title: { padding: 18, fontSize: 20, fontWeight: "700" },
    scroll_wrap: { flex: 1, paddingTop: 20 },

    nullWrap: {
      marginTop: 24,
      justifyContent: "center",
      alignItems: "center",
    },
    nullText: {
      marginTop: 6,
      fontWeight: "700",
      color: colors.subText,
    },
  });

  useEffect(() => {
    if (schedules) {
      const filteredArray = schedules.filter(
        (data) => data.AA_YMD === moment(selDate).format("YYYYMMDD")
      );
      const count = filteredArray.length;

      setSelDataCount(count);
    }
  }, [schedules, selDate]);

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <Header navigation={navigation} />

      {isLoading && <FullScreenLoader />}
      {isSuccess && (
        <>
          <Calendar
            initialDate={selDate}
            style={styles.calendar}
            theme={{
              arrowColor: colors.text,
              calendarBackground: colors.background,
              dayTextColor: colors.text,
              textDisabledColor: colors.subText,
              monthTextColor: colors.text,
            }}
            enableSwipeMonths={true}
            onDayPress={(day) => {
              setSelDate(day.dateString);
            }}
            markedDates={markedDatesWithSelDate}
            onMonthChange={(month) => {
              setSelDate(month.dateString);
            }}
          />
          {selDataCount === 0 ? (
            <View style={styles.nullWrap}>
              <Ionicons name="alert-circle" size={24} color={colors.subText} />
              <Text style={styles.nullText}>
                선택한 날짜에 데이터가 없습니다.
              </Text>
            </View>
          ) : null}
          <View style={styles.scroll_wrap}>
            {schedules && (
              <ScrollView>
                {schedules.map((_data) => {
                  if (_data.AA_YMD === moment(selDate).format("YYYYMMDD")) {
                    return <Item key={uuid.v4()} data={_data} />;
                  }
                })}
              </ScrollView>
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

function Item({ data }) {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: colors.border,
      marginHorizontal: 20,
      padding: 14,
      borderRadius: 15,
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    event_name: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    desc: {
      fontSize: 12,
      fontWeight: "400",
      color: "gray",
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.event_name}>{data.EVENT_NM}</Text>
      <Text style={styles.desc}>NEIS 제공</Text>
    </View>
  );
}
