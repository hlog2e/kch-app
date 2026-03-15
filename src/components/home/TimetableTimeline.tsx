import React, { useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { GalleryHorizontal } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import {
  useTodayTimetable,
  TimetableSlot,
} from "../../hooks/useTodayTimetable";
import { useTimetableMode } from "../../hooks/useTimetableMode";
import { useCustomTodayTimetable } from "../../hooks/useCustomTodayTimetable";
import { CUSTOM_TIMETABLE_QUERY_KEY } from "../../hooks/useCustomTimetable";

const CARD_WIDTH = 110;
const CARD_MARGIN = 10;

export default function TimetableTimeline() {
  const { colors } = useTheme();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const queryClient = useQueryClient();
  const { mode, refresh: refreshMode } = useTimetableMode();

  const neis = useTodayTimetable();
  const custom = useCustomTodayTimetable();

  // 화면 복귀 시 모드 새로고침 + 커스텀 시간표 refetch
  useFocusEffect(
    useCallback(() => {
      refreshMode();
      queryClient.invalidateQueries({ queryKey: [CUSTOM_TIMETABLE_QUERY_KEY] });
    }, [refreshMode, queryClient]),
  );

  // 모드에 따라 데이터 선택
  const isCustomMode = mode === "custom";
  const slots = isCustomMode ? custom.slots : neis.slots;
  const isLoading = isCustomMode ? custom.isLoading : neis.isLoading;
  const isError = isCustomMode ? false : neis.isError;
  const isToday = isCustomMode ? custom.isToday : neis.isToday;
  const targetDate = isCustomMode ? custom.targetDate : neis.targetDate;
  const currentIndex = isCustomMode ? custom.currentIndex : neis.currentIndex;
  const hasGradeClass = neis.hasGradeClass;

  // 애니메이션
  const translateY = useSharedValue(40);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      400,
      withSpring(0, { damping: 15, stiffness: 120 }),
    );
    opacity.value = withDelay(
      400,
      withSpring(1, { damping: 15, stiffness: 120 }),
    );
  }, []);

  // 현재 교시로 자동 스크롤
  useEffect(() => {
    if (slots.length > 0 && currentIndex > 0) {
      const timer = setTimeout(() => {
        scrollRef.current?.scrollTo({
          x: currentIndex * (CARD_WIDTH + CARD_MARGIN) - 14,
          animated: true,
        });
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [slots, currentIndex]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const headerTitle = isToday
    ? "오늘의 시간표"
    : `${targetDate.format("M월 D일")} ${["일", "월", "화", "수", "목", "금", "토"][targetDate.day()]} 시간표`;

  const styles = StyleSheet.create({
    container: {
      marginTop: 16,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 14,
      marginBottom: 6,
    },
    titleRow: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 6,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    modeBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 999,
      backgroundColor: "rgba(74, 144, 226, 0.10)",
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },
    modeBadgeText: {
      fontSize: 10,
      fontWeight: "600",
      color: "#4A90E2",
    },
    viewAllButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: colors.cardBg2,
    },
    viewAllText: {
      fontSize: 11,
      fontWeight: "600",
      color: colors.subText,
      marginRight: 3,
    },
    scrollContent: {
      paddingLeft: 14,
      paddingRight: 4,
      paddingVertical: 8,
    },
    emptyContainer: {
      marginHorizontal: 14,
      paddingVertical: 24,
      alignItems: "center",
      backgroundColor: colors.cardBg,
      borderRadius: 16,
    },
    emptyText: {
      fontSize: 13,
      color: colors.subText,
      fontWeight: "500",
      marginTop: 8,
    },
  });

  // 학년/반 미설정 (커스텀 모드면 바이패스)
  if (!isCustomMode && !hasGradeClass) {
    return (
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.headerRow}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>오늘의 시간표</Text>
            <View style={styles.modeBadge}>
              <Text style={styles.modeBadgeText}>
                {isCustomMode ? "커스텀" : "NEIS"}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => router.push("/home/timetable")}
          >
            <Text style={styles.viewAllText}>더보기</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.subText} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.emptyContainer}
          onPress={() => router.push("/home/timetable")}
          activeOpacity={0.7}
        >
          <Text style={styles.emptyText}>
            학년/반을 설정하면 시간표를 볼 수 있어요
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  if (isLoading || isError || slots.length === 0) {
    const emptyMessage = isCustomMode
      ? "나만의 시간표를 등록해보세요"
      : "NEIS 시간표 정보가 없습니다";

    return (
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.headerRow}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{headerTitle}</Text>
            <View style={styles.modeBadge}>
              <Text style={styles.modeBadgeText}>
                {isCustomMode ? "커스텀" : "NEIS"}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => router.push("/home/timetable")}
          >
            <Text style={styles.viewAllText}>더보기</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.subText} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.emptyContainer}
          onPress={() => router.push("/home/timetable")}
          activeOpacity={0.7}
        >
          <GalleryHorizontal
            size={28}
            color={colors.subText}
            strokeWidth={1.5}
          />
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{headerTitle}</Text>
          <View style={styles.modeBadge}>
            <Text style={styles.modeBadgeText}>
              {isCustomMode ? "커스텀" : "NEIS"}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => router.push("/home/timetable")}
        >
          <Text style={styles.viewAllText}>더보기</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.subText} />
        </TouchableOpacity>
      </View>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {slots.map((slot, index) => (
          <SlotCard key={`${slot.period}-${index}`} slot={slot} />
        ))}
      </ScrollView>
    </Animated.View>
  );
}

function SlotCard({ slot }: { slot: TimetableSlot }) {
  const { colors } = useTheme();

  const isCurrent = slot.status === "current";
  const isPassed = slot.status === "passed";

  const cardBg = isCurrent ? "#F2F9FF" : colors.cardBg;
  const cardBorder = isCurrent ? "#E0F0FF" : colors.border;

  const styles = StyleSheet.create({
    card: {
      width: CARD_WIDTH,
      height: 80,
      borderRadius: 16,
      padding: 12,
      marginRight: CARD_MARGIN,
      backgroundColor: cardBg,
      borderWidth: 1,
      borderColor: cardBorder,
      opacity: isPassed ? 0.45 : 1,
      justifyContent: "space-between",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    label: {
      fontSize: 11,
      fontWeight: "600",
      color: colors.subText,
    },
    indicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#4A90E2",
    },
    subject: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      marginTop: 4,
    },
    bottomRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    time: {
      fontSize: 10,
      fontWeight: "500",
      color: colors.subText,
    },
    badge: {
      fontSize: 10,
      fontWeight: "700",
      color: "#4A90E2",
    },
  });

  const badgeText =
    isCurrent && slot.remainingMinutes !== undefined
      ? `${slot.remainingMinutes}분 남음`
      : "";

  return (
    <View style={styles.card}>
      <View>
        <View style={styles.topRow}>
          <Text style={styles.label}>{slot.label}</Text>
          {isCurrent && <View style={styles.indicator} />}
        </View>
        <Text style={styles.subject} numberOfLines={1}>
          {slot.isLunch ? "🍚 점심" : slot.subject}
        </Text>
      </View>
      <View style={styles.bottomRow}>
        <Text style={styles.time}>{slot.startTime}</Text>
        {badgeText ? <Text style={styles.badge}>{badgeText}</Text> : null}
      </View>
    </View>
  );
}
