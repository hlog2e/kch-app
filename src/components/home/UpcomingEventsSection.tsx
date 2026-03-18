import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { getSchedule } from "../../../apis/neis/schedule";
import { useResponsiveScale } from "../../hooks/useResponsiveScale";

export default function UpcomingEventsSection() {
  const { colors } = useTheme();
  const router = useRouter();
  const { s } = useResponsiveScale();

  // 애니메이션 설정
  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // 200ms 지연 후 아래에서 위로 슬라이드인
    translateY.value = withDelay(
      200,
      withSpring(0, { damping: 15, stiffness: 120 })
    );
    opacity.value = withDelay(
      200,
      withSpring(1, { damping: 15, stiffness: 120 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  // 이번 달과 다음 달 데이터 가져오기
  const firstDate = moment().format("YYYYMMDD");
  const lastDate = moment().add(2, "months").endOf("month").format("YYYYMMDD");

  const { data }: { data: any } = useQuery({
    queryKey: ["UpcomingEvents", firstDate, lastDate],
    queryFn: () => getSchedule(firstDate, lastDate),
  });

  // 스케줄 데이터 처리
  const schedules = data?.SchoolSchedule?.[1]?.row || [];

  // 오늘 이후 일정만 필터링하고 토요 휴업일 제외
  const filteredEvents = schedules
    .filter(
      (event: any) =>
        moment(event.AA_YMD, "YYYYMMDD").isAfter(moment(), "day") &&
        !event.EVENT_NM.includes("토요휴업일")
    )
    .sort((a: any, b: any) =>
      moment(a.AA_YMD, "YYYYMMDD").diff(moment(b.AA_YMD, "YYYYMMDD"))
    );

  // 연속된 같은 이벤트 그룹화
  const groupConsecutiveEvents = (events: any[]) => {
    const grouped: any[] = [];
    let currentGroup: any = null;

    events.forEach((event) => {
      if (!currentGroup) {
        currentGroup = {
          ...event,
          startDate: event.AA_YMD,
          endDate: event.AA_YMD,
        };
      } else if (
        currentGroup.EVENT_NM === event.EVENT_NM &&
        moment(event.AA_YMD, "YYYYMMDD").diff(
          moment(currentGroup.endDate, "YYYYMMDD"),
          "days"
        ) === 1
      ) {
        // 연속된 같은 이벤트면 종료일 업데이트
        currentGroup.endDate = event.AA_YMD;
      } else {
        // 다른 이벤트이거나 연속되지 않으면 그룹 완료
        grouped.push(currentGroup);
        currentGroup = {
          ...event,
          startDate: event.AA_YMD,
          endDate: event.AA_YMD,
        };
      }
    });

    if (currentGroup) {
      grouped.push(currentGroup);
    }

    return grouped;
  };

  const upcomingEvents = groupConsecutiveEvents(filteredEvents).slice(0, 10);

  const getEventIcon = (eventName: string) => {
    if (eventName.includes("고사") || eventName.includes("시험")) return "📝";
    if (eventName.includes("방학") || eventName.includes("휴업")) return "🏖️";
    if (eventName.includes("개학") || eventName.includes("입학")) return "🎒";
    if (eventName.includes("축제") || eventName.includes("행사")) return "🎉";
    if (eventName.includes("토요") || eventName.includes("휴일")) return "😴";
    return "📅";
  };

  const getDDay = (startDate: string) => {
    const eventDate = moment(startDate, "YYYYMMDD").startOf("day");
    const today = moment().startOf("day");
    const diff = eventDate.diff(today, "days");

    if (diff === 0) return "D-Day";
    if (diff === 1) return "내일";
    return `D-${diff}`;
  };

  const getDateDisplay = (startDate: string, endDate: string) => {
    const start = moment(startDate, "YYYYMMDD");
    const end = moment(endDate, "YYYYMMDD");

    if (startDate === endDate) {
      return {
        shortDate: start.format("M/D"),
        fullDate: start.format("M월 D일 (ddd)"),
      };
    } else {
      return {
        shortDate: `${start.format("M/D")}~${end.format("M/D")}`,
        fullDate: `${start.format("M월 D일")} ~ ${end.format("M월 D일")}`,
      };
    }
  };

  const styles = StyleSheet.create({
    container: {
      marginTop: 20,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: s(14),
      marginBottom: 4,
    },
    title: {
      fontSize: s(16),
      fontWeight: "600",
      color: colors.text,
    },
    viewAllButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: s(12),
      backgroundColor: colors.cardBg2,
    },
    viewAllText: {
      fontSize: 11,
      fontWeight: "600",
      color: colors.subText,
      marginRight: 3,
    },
    scrollView: {
      paddingLeft: s(14),
      paddingVertical: 12,
    },
    noEventsContainer: {
      alignItems: "center",
      paddingVertical: 32,
      paddingHorizontal: 14,
    },
    noEventsText: {
      fontSize: 14,
      color: colors.subText,
      marginTop: 8,
    },
  });

  if (upcomingEvents.length === 0) {
    return (
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>다가오는 학사일정</Text>
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => {
              router.push("/home/calendar");
            }}
          >
            <Text style={styles.viewAllText}>더보기</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.subText} />
          </TouchableOpacity>
        </View>
        <View style={styles.noEventsContainer}>
          <Ionicons name="calendar-outline" size={32} color={colors.subText} />
          <Text style={styles.noEventsText}>예정된 학사일정이 없습니다</Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>다가오는 학사일정</Text>
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => {
            router.push("/home/calendar");
          }}
        >
          <Text style={styles.viewAllText}>더보기</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.subText} />
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={{ paddingRight: 14 }}
      >
        {upcomingEvents.map((event: any) => (
          <EventCard
            key={`${event.startDate}-${event.EVENT_NM}`}
            event={event}
            getDDay={getDDay}
            getDateDisplay={getDateDisplay}
            getEventIcon={getEventIcon}
            s={s}
            onPress={() => {
              const selectedDate = moment(event.startDate, "YYYYMMDD").format(
                "YYYY-MM-DD"
              );
              router.push(`/home/calendar?selectedDate=${selectedDate}`);
            }}
          />
        ))}
      </ScrollView>
    </Animated.View>
  );
}

interface EventCardProps {
  event: any;
  getDDay: (startDate: string) => string;
  getDateDisplay: (
    startDate: string,
    endDate: string
  ) => { shortDate: string; fullDate: string };
  getEventIcon: (eventName: string) => string;
  s: (size: number) => number;
  onPress: () => void;
}

function EventCard({
  event,
  getDDay,
  getDateDisplay,
  getEventIcon,
  s,
  onPress,
}: EventCardProps) {
  const { colors } = useTheme();
  const dateDisplay = getDateDisplay(event.startDate, event.endDate);

  const diff = moment(event.startDate, "YYYYMMDD").diff(moment(), "days");
  const isHighlight = diff <= 1;

  const styles = StyleSheet.create({
    card: {
      width: s(170),
      height: s(80),
      backgroundColor: isHighlight ? colors.accentBlueBg : colors.cardBg,
      borderRadius: s(16),
      marginRight: 12,
      padding: s(12),
      borderWidth: 1,
      borderColor: isHighlight ? colors.accentBlueBorder : colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
      flexDirection: "column",
      justifyContent: "space-between",
    },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 4,
    },
    dDayText: {
      fontSize: s(15),
      fontWeight: "700",
      color: colors.accentBlue,
    },
    eventIcon: {
      fontSize: 18,
    },
    eventContent: {
      flex: 1,
    },
    eventDate: {
      fontSize: 10,
      color: colors.subText,
      marginBottom: 2,
    },
    eventName: {
      fontSize: s(13),
      fontWeight: "600",
      color: colors.text,
      lineHeight: s(16),
    },
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.topRow}>
        <Text style={styles.dDayText}>{getDDay(event.startDate)}</Text>
        <Text style={styles.eventIcon}>{getEventIcon(event.EVENT_NM)}</Text>
      </View>

      <View style={styles.eventContent}>
        <Text style={styles.eventDate}>{dateDisplay.fullDate}</Text>
        <Text
          style={styles.eventName}
          numberOfLines={2}
          ellipsizeMode="tail"
          adjustsFontSizeToFit={true}
          minimumFontScale={0.75}
        >
          {event.EVENT_NM}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
