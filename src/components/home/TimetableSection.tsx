import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import moment from "moment";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
} from "react-native-reanimated";

// 목 데이터
const mockTimetable = [
  {
    period: 1,
    subject: "국어",
    teacher: "김국어 선생님",
    room: "1-1",
    time: "09:00~09:50",
  },
  {
    period: 2,
    subject: "수학",
    teacher: "이수학 선생님",
    room: "1-1",
    time: "10:00~10:50",
  },
  {
    period: 3,
    subject: "영어",
    teacher: "박영어 선생님",
    room: "영어실",
    time: "11:00~11:50",
  },
  {
    period: 4,
    subject: "과학",
    teacher: "최과학 선생님",
    room: "과학실",
    time: "12:00~12:50",
  },
  {
    period: 5,
    subject: "점심시간",
    teacher: "",
    room: "",
    time: "12:50~13:50",
  },
  {
    period: 6,
    subject: "체육",
    teacher: "강체육 선생님",
    room: "체육관",
    time: "13:50~14:40",
  },
];

export default function TimetableSection() {
  const { colors } = useTheme();
  const router = useRouter();
  const screenWidth = Dimensions.get("window").width;

  // 애니메이션 값
  const translateX = useSharedValue(screenWidth);

  // 컴포넌트 마운트 후 애니메이션 시작
  useEffect(() => {
    translateX.value = withDelay(
      800, // 800ms 지연
      withSpring(0, {
        damping: 20,
        stiffness: 90,
        mass: 1,
      })
    );
  }, []);

  // 애니메이션 스타일
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const getCurrentPeriod = () => {
    const now = moment();
    const currentTime = now.format("HH:mm");

    // 현재 시간 기준으로 다음 수업 찾기
    for (let i = 0; i < mockTimetable.length; i++) {
      const period = mockTimetable[i];
      const startTime = period.time.split("~")[0];

      if (currentTime < startTime) {
        return period;
      }
    }

    return null; // 모든 수업 종료
  };

  const currentPeriod = getCurrentPeriod();

  const styles = StyleSheet.create({
    container: {
      marginTop: 18,
      marginHorizontal: 14,
    },
    card: {
      backgroundColor: "#F2F9FF",
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: "#E0F0FF",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    finishedCard: {
      backgroundColor: colors.cardBg,
      borderColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 16,
    },
    leftContent: {
      flex: 1,
      justifyContent: "space-between",
    },
    topRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 6,
    },
    rightContent: {
      alignItems: "flex-end",
      justifyContent: "center",
    },
    badge: {
      backgroundColor: "#4A90E2",
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
      marginRight: 8,
    },
    finishedBadge: {
      backgroundColor: "#6C757D",
    },
    badgeText: {
      color: "white",
      fontSize: 12,
      fontWeight: "700",
    },
    subjectRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    subjectText: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginRight: 8,
    },
    roomText: {
      color: colors.subText,
      fontSize: 12,
      fontWeight: "600",
    },
    timeText: {
      fontSize: 13,
      fontWeight: "600",
      color: "#4A90E2",
    },

    nextBadge: {
      backgroundColor: "#E0F0FF",
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
      marginBottom: 4,
      alignSelf: "flex-end",
    },
    nextBadgeText: {
      color: "#4A90E2",
      fontSize: 12,
      fontWeight: "700",
    },
    nextSubjectRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    nextSubject: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.text,
      textAlign: "right",
    },
    nextRoomText: {
      color: colors.subText,
      fontSize: 11,
      fontWeight: "600",
      marginLeft: 2,
    },

    finishedText: {
      fontSize: 14,
      color: colors.subText,
      textAlign: "center",
    },
  });

  if (!currentPeriod) {
    return (
      <Animated.View style={[styles.container, animatedStyle]}>
        <TouchableOpacity
          style={[styles.card, styles.finishedCard]}
          onPress={() => router.push("/home/timetable")}
          activeOpacity={0.7}
        >
          <View style={[styles.badge, styles.finishedBadge]}>
            <Text style={styles.badgeText}>수업 종료</Text>
          </View>
          <Text style={styles.finishedText}>
            오늘 모든 수업이 끝났습니다 🎉
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/home/timetable")}
        activeOpacity={0.7}
      >
        <View style={styles.leftContent}>
          <View style={styles.topRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {currentPeriod.subject === "점심시간"
                  ? "점심시간"
                  : `${currentPeriod.period}교시`}
              </Text>
            </View>
            <Text style={styles.timeText}>
              {currentPeriod.time}
              {(() => {
                const now = moment();
                const startTime = moment(
                  currentPeriod.time.split("~")[0],
                  "HH:mm"
                );
                const diffMinutes = startTime.diff(now, "minutes");

                if (diffMinutes > 0) {
                  return diffMinutes < 60
                    ? ` (${diffMinutes}분 후)`
                    : ` (${Math.floor(diffMinutes / 60)}시간 후)`;
                }
                return "";
              })()}
            </Text>
          </View>

          <View style={styles.subjectRow}>
            <Text style={styles.subjectText}>{currentPeriod.subject}</Text>
            {currentPeriod.room && (
              <Text style={styles.roomText}>📍 {currentPeriod.room}</Text>
            )}
          </View>
        </View>

        <View style={styles.rightContent}>
          {(() => {
            const currentIndex = mockTimetable.findIndex(
              (p) => p.period === currentPeriod.period
            );
            const nextPeriod =
              currentIndex >= 0 && currentIndex < mockTimetable.length - 1
                ? mockTimetable[currentIndex + 1]
                : null;

            if (nextPeriod) {
              return (
                <>
                  <View style={styles.nextBadge}>
                    <Text style={styles.nextBadgeText}>
                      {nextPeriod.subject === "점심시간"
                        ? "점심시간"
                        : `${nextPeriod.period}교시`}{" "}
                      {nextPeriod.time.split("~")[0]}
                    </Text>
                  </View>
                  <View style={styles.nextSubjectRow}>
                    <Text style={styles.nextSubject}>{nextPeriod.subject}</Text>
                    {nextPeriod.room && (
                      <Text style={styles.nextRoomText}>
                        📍 {nextPeriod.room}
                      </Text>
                    )}
                  </View>
                </>
              );
            }
            return null;
          })()}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
