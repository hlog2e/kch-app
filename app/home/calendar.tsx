import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { useEffect, useState } from "react";
import moment from "moment";
import { useQuery } from "react-query";
import { getSchedule } from "../../apis/neis/schedule";
import FullScreenLoader from "../../src/components/Overlay/FullScreenLoader";
import uuid from "react-native-uuid";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../src/components/Header/Header";
import { useLocalSearchParams } from "expo-router";

export default function CalendarScreen() {
  const { colors } = useTheme();
  const { selectedDate } = useLocalSearchParams();

  // 쿼리 파라미터에서 받은 날짜가 있으면 사용, 없으면 오늘 날짜
  const initialDate = selectedDate
    ? String(selectedDate)
    : moment().format("YYYY-MM-DD");
  const todayDate = moment().format("YYYY-MM-DD");

  const [selDate, setSelDate] = useState(initialDate);
  const [selDataCount, setSelDataCount] = useState(0);
  const [firstDate, setFistDate] = useState(
    moment().startOf("M").format("YYYYMMDD")
  );
  const [lastDate, setLastDate] = useState(
    moment().endOf("M").format("YYYYMMDD")
  );

  const {
    data,
    isLoading,
    isSuccess,
  }: { data: any; isLoading: boolean; isSuccess: boolean } = useQuery({
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
      schedules.map((_data: any) => {
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
        (data: any) => data.AA_YMD === moment(selDate).format("YYYYMMDD")
      );
      const count = filteredArray.length;

      setSelDataCount(count);
    }
  }, [schedules, selDate]);

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <Header backArrowText="홈" />

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
            onDayPress={(day: any) => {
              setSelDate(day.dateString);
            }}
            markedDates={markedDatesWithSelDate}
            onMonthChange={(month: any) => {
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
                {schedules.map((_data: any) => {
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

function Item({ data }: { data: any }) {
  const { colors } = useTheme();

  const getEventIcon = (eventName: string) => {
    if (eventName.includes("고사") || eventName.includes("시험")) return "📝";
    if (eventName.includes("방학") || eventName.includes("휴업")) return "🏖️";
    if (eventName.includes("개학") || eventName.includes("입학")) return "🎒";
    if (eventName.includes("축제") || eventName.includes("행사")) return "🎉";
    if (eventName.includes("토요") || eventName.includes("휴일")) return "😴";
    return "📅";
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.cardBg,
      borderRadius: 20,
      padding: 16,
      marginHorizontal: 14,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    leftSection: {
      width: 50,
      height: 50,
      borderRadius: 18,
      backgroundColor: "#F2F9FF",
      borderWidth: 1,
      borderColor: "#E0F0FF",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
    },
    eventIcon: {
      fontSize: 20,
    },
    eventContent: {
      flex: 1,
    },
    eventName: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
      lineHeight: 20,
    },
    eventSource: {
      fontSize: 12,
      color: colors.subText,
      fontWeight: "500",
    },
    rightSection: {
      alignItems: "flex-end",
    },
    dateBadge: {
      backgroundColor: "rgba(74, 144, 226, 0.1)",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: "#4A90E2",
    },
    eventDate: {
      fontSize: 11,
      color: "#4A90E2",
      fontWeight: "600",
      textAlign: "center",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.eventIcon}>{getEventIcon(data.EVENT_NM)}</Text>
      </View>

      <View style={styles.eventContent}>
        <Text style={styles.eventName} numberOfLines={2}>
          {data.EVENT_NM}
        </Text>
        <Text style={styles.eventSource}>NEIS 제공</Text>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.dateBadge}>
          <Text style={styles.eventDate}>
            {moment(data.AA_YMD, "YYYYMMDD").format("M/D")}
          </Text>
        </View>
      </View>
    </View>
  );
}
