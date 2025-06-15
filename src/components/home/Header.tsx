import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import moment from "moment";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

// 목 데이터
const mockTimetable = [
  {
    period: 1,
    subject: "국어",
    room: "1-1",
    time: "09:00~09:50",
  },
  {
    period: 2,
    subject: "수학",
    room: "1-1",
    time: "10:00~10:50",
  },
  {
    period: 3,
    subject: "영어",
    room: "영어실",
    time: "11:00~11:50",
  },
  {
    period: 4,
    subject: "과학",
    room: "과학실",
    time: "12:00~12:50",
  },
  {
    period: 5,
    subject: "점심시간",
    room: "",
    time: "12:50~13:50",
  },
  {
    period: 6,
    subject: "체육",
    room: "체육관",
    time: "13:50~14:40",
  },
];

export default function Header() {
  const nowTime = parseInt(moment().format("H"));
  const { user } = useUser();
  const { colors } = useTheme();
  const router = useRouter();
  const screenWidth = Dimensions.get("window").width;

  const [grade, setGrade] = useState<string | null>(null);
  const [alias, setAlias] = useState<string | null>(null);
  const [nextPeriod, setNextPeriod] = useState<any>(null);

  const [greetText, setGreetText] = useState<string>("");

  // 애니메이션 값들
  const nameOpacity = useSharedValue(0);
  const nameRotateX = useSharedValue(90);
  const greetOpacity = useSharedValue(0);
  const greetRotateX = useSharedValue(90);
  const timetableTranslateX = useSharedValue(screenWidth);
  const grettings = [
    "별이 빛나는 밤입니다:)",
    "안 주무시나요?:)",
    "일찍 일어나셨네요?:)",
    "좋은 아침입니다:)",
    "배고픈 시간이네요..",
    "점심 식사는 하셨나요?",
    "즐거운 오후입니다:)",
    "즐거운 저녁 되세요:)",
    "오늘 하루 수고했어요:)",
    "안녕히 주무세요:)",
  ];

  useEffect(() => {
    if (nowTime >= 0 && nowTime < 3) {
      setGreetText(grettings[0]);
    } else if (nowTime >= 3 && nowTime < 6) {
      setGreetText(grettings[1]);
    } else if (nowTime >= 6 && nowTime < 8) {
      setGreetText(grettings[2]);
    } else if (nowTime >= 8 && nowTime < 10) {
      setGreetText(grettings[3]);
    } else if (nowTime >= 10 && nowTime < 12) {
      setGreetText(grettings[4]);
    } else if (nowTime >= 12 && nowTime < 14) {
      setGreetText(grettings[5]);
    } else if (nowTime >= 14 && nowTime < 17) {
      setGreetText(grettings[6]);
    } else if (nowTime >= 17 && nowTime < 22) {
      setGreetText(grettings[7]);
    } else if (nowTime >= 22 && nowTime < 24) {
      setGreetText(grettings[8]);
    }
  }, []);

  const getAge = (_birthYear: number): number => {
    const today = moment().format("YYYY");
    return parseInt(today) - _birthYear + 1;
  };

  const getCurrentPeriod = () => {
    const now = moment();
    const currentTime = now.format("HH:mm");

    for (let i = 0; i < mockTimetable.length; i++) {
      const period = mockTimetable[i];
      const startTime = period.time.split("~")[0];

      if (currentTime < startTime) {
        return period;
      }
    }
    return null;
  };

  useEffect(() => {
    if (user?.type === "undergraduate") {
      const age = getAge(user.birthYear);

      if (age === 17) setGrade("1학년");
      if (age === 18) setGrade("2학년");
      if (age === 19) setGrade("3학년");
    }
    if (user?.type === "teacher") {
      setAlias("선생");
    }

    // 목업 데이터로 강제 설정 (항상 1교시 국어를 다음 수업으로 표시)
    setNextPeriod(mockTimetable[0]);

    // 애니메이션 시작
    // 이름 텍스트 플립
    nameOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));
    nameRotateX.value = withDelay(
      500,
      withSpring(0, { damping: 20, stiffness: 100 })
    );

    // 인사 텍스트 플립
    greetOpacity.value = withDelay(700, withTiming(1, { duration: 600 }));
    greetRotateX.value = withDelay(
      700,
      withSpring(0, { damping: 20, stiffness: 100 })
    );

    // 시간표 슬라이드인
    timetableTranslateX.value = withDelay(
      900,
      withSpring(0, { damping: 25, stiffness: 90 })
    );
  }, [user]);

  // 애니메이션 스타일들
  const nameAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: nameOpacity.value,
      transform: [
        {
          rotateX: `${nameRotateX.value}deg`,
        },
      ],
    };
  });

  const greetAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: greetOpacity.value,
      transform: [
        {
          rotateX: `${greetRotateX.value}deg`,
        },
      ],
    };
  });

  const timetableAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: timetableTranslateX.value,
        },
      ],
    };
  });

  const styles = StyleSheet.create({
    header: {
      marginHorizontal: 14,
      marginTop: 14,
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
    },
    headerName: { fontSize: 18, fontWeight: "200", color: colors.subText },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      marginTop: 2,
      color: colors.text,
    },
    studentIdButton: {
      height: 40,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 15,
      paddingVertical: 2,
      paddingHorizontal: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    studentIdButtonText: {
      fontSize: 10,
      marginLeft: 2,
      color: "gray",
      fontWeight: "600",
    },
    rightSection: {
      alignItems: "flex-end",
    },
    nextClassContainer: {
      backgroundColor: "#F2F9FF",
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: "#E0F0FF",
    },
    nextClassTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6,
    },
    nextClassBadge: {
      backgroundColor: "#4A90E2",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 8,
      marginRight: 8,
    },
    nextClassBadgeText: {
      fontSize: 10,
      color: "white",
      fontWeight: "700",
    },
    nextSubjectRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    nextSubjectText: {
      fontSize: 14,
      color: colors.text,
      fontWeight: "700",
      marginRight: 6,
    },
    nextRoomText: {
      fontSize: 11,
      color: colors.subText,
      fontWeight: "600",
    },
    nextClassTime: {
      fontSize: 10,
      color: "#4A90E2",
      fontWeight: "600",
    },
  });

  return (
    <View style={styles.header}>
      <View>
        <Animated.Text style={[styles.headerName, nameAnimatedStyle]}>
          {grade && grade + " "}
          {user?.name}
          {alias && " " + alias}님,
        </Animated.Text>
        <Animated.Text style={[styles.headerTitle, greetAnimatedStyle]}>
          {greetText}
        </Animated.Text>
      </View>
      <Animated.View style={[styles.rightSection, timetableAnimatedStyle]}>
        {/* 다음 수업 정보 */}
        <TouchableOpacity
          style={styles.nextClassContainer}
          onPress={() => router.push("/home/timetable")}
          activeOpacity={0.7}
        >
          <View style={styles.nextClassTop}>
            <View style={styles.nextClassBadge}>
              <Text style={styles.nextClassBadgeText}>1교시</Text>
            </View>
            <Text style={styles.nextClassTime}>09:00</Text>
          </View>
          <View style={styles.nextSubjectRow}>
            <Text style={styles.nextSubjectText}>국어</Text>
            <Text style={styles.nextRoomText}>📍 1-1</Text>
          </View>
        </TouchableOpacity>

        {user?.type === "undergraduate" && (
          <TouchableOpacity
            onPress={() => {
              router.push("/home/student-id");
            }}
            style={styles.studentIdButton}
          >
            <Ionicons name="barcode-outline" size={24} color={colors.icon} />
            <Text style={styles.studentIdButtonText}>{"모바일 학생증"}</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
}
