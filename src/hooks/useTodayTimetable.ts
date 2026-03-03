import { useEffect, useState, useMemo } from "react";
import { useQuery } from "react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { getNeisTimetable } from "../../apis/neis/timetable";
import {
  PERIOD_TIMES,
  LUNCH_TIME,
  LUNCH_AFTER_PERIOD,
} from "../constants/timetable";

export type SlotStatus =
  | "passed"
  | "current"
  | "next"
  | "upcoming"
  | "future";

export interface TimetableSlot {
  period: number;
  subject: string;
  startTime: string;
  endTime: string;
  label: string;
  status: SlotStatus;
  remainingMinutes?: number;
  isLunch?: boolean;
}

interface GradeClass {
  grade: number;
  class: number;
}

function getTargetSchoolDate(): { date: moment.Moment; isToday: boolean } {
  const now = moment();
  const day = now.day(); // 0=일, 1=월, ..., 6=토
  const currentTime = now.format("HH:mm");

  // 평일이고 마지막 교시 종료 전이면 오늘
  if (day >= 1 && day <= 5 && currentTime < "17:20") {
    return { date: now, isToday: true };
  }

  // 그 외: 다음 평일
  const daysUntilMonday =
    day === 0 ? 1 : day === 6 ? 2 : day === 5 && currentTime >= "17:20" ? 3 : 1;
  return {
    date: moment().add(daysUntilMonday, "days"),
    isToday: false,
  };
}

function processNeisResponse(
  response: any,
  targetDateStr: string
): TimetableSlot[] {
  const rows: any[] =
    response?.hisTimetable?.[1]?.row ||
    response?.hisTimetable?.[0]?.row;

  if (!rows || rows.length === 0) {
    return [];
  }

  // 해당 날짜 데이터만 필터링
  const dayRows = rows.filter(
    (item: any) => item.ALL_TI_YMD === targetDateStr
  );

  if (dayRows.length === 0) return [];

  // 정렬 + 중복 제거
  const sorted = dayRows.sort(
    (a: any, b: any) => parseInt(a.PERIO) - parseInt(b.PERIO)
  );
  const unique = sorted.filter(
    (item: any, index: number, self: any[]) =>
      index === self.findIndex((i: any) => i.PERIO === item.PERIO)
  );

  // NEIS 데이터 → TimetableSlot 변환
  const slots: TimetableSlot[] = [];

  for (const item of unique) {
    const periodNum = parseInt(item.PERIO);
    const periodTime = PERIOD_TIMES.find((p) => p.period === periodNum);
    if (!periodTime) continue;

    // 점심 슬롯 삽입 (3교시 다음)
    if (periodNum === LUNCH_AFTER_PERIOD + 1 && slots.length > 0) {
      slots.push({
        period: 0,
        subject: LUNCH_TIME.label,
        startTime: LUNCH_TIME.startTime,
        endTime: LUNCH_TIME.endTime,
        label: LUNCH_TIME.label,
        status: "upcoming",
        isLunch: true,
      });
    }

    slots.push({
      period: periodNum,
      subject: item.ITRT_CNTNT,
      startTime: periodTime.startTime,
      endTime: periodTime.endTime,
      label: periodTime.label,
      status: "upcoming",
    });
  }

  return slots;
}

function calculateStatuses(
  slots: TimetableSlot[],
  isToday: boolean,
  currentTime: string
): { updatedSlots: TimetableSlot[]; currentIndex: number } {
  if (!isToday) {
    return {
      updatedSlots: slots.map((s) => ({ ...s, status: "future" as SlotStatus })),
      currentIndex: 0,
    };
  }

  let currentIndex = 0;
  let foundCurrent = false;
  let foundNext = false;

  const updatedSlots = slots.map((slot, index) => {
    const updated = { ...slot };

    if (currentTime >= slot.endTime) {
      updated.status = "passed";
    } else if (currentTime >= slot.startTime && currentTime < slot.endTime) {
      updated.status = "current";
      currentIndex = index;
      foundCurrent = true;

      // 남은 시간 계산
      const endMoment = moment(slot.endTime, "HH:mm");
      const nowMoment = moment(currentTime, "HH:mm");
      updated.remainingMinutes = endMoment.diff(nowMoment, "minutes");
    } else if (!foundNext && (foundCurrent || currentTime < slot.startTime)) {
      if (foundCurrent) {
        updated.status = "next";
        foundNext = true;

        const startMoment = moment(slot.startTime, "HH:mm");
        const nowMoment = moment(currentTime, "HH:mm");
        updated.remainingMinutes = startMoment.diff(nowMoment, "minutes");
      } else if (!foundCurrent && currentTime < slot.startTime) {
        // 아직 수업 시작 전 → 첫 번째 미래 교시를 next로
        updated.status = "next";
        currentIndex = index;
        foundNext = true;

        const startMoment = moment(slot.startTime, "HH:mm");
        const nowMoment = moment(currentTime, "HH:mm");
        updated.remainingMinutes = startMoment.diff(nowMoment, "minutes");
      }
    } else {
      updated.status = "upcoming";
    }

    return updated;
  });

  return { updatedSlots, currentIndex };
}

export function useTodayTimetable() {
  const [gradeClass, setGradeClass] = useState<GradeClass | null>(null);
  const [currentTime, setCurrentTime] = useState(moment().format("HH:mm"));

  const { date: targetDate, isToday } = useMemo(getTargetSchoolDate, [currentTime]);
  const targetDateStr = targetDate.format("YYYYMMDD");

  // AsyncStorage에서 gradeClass 로드
  useEffect(() => {
    AsyncStorage.getItem("gradeClass").then((stored) => {
      if (stored) {
        setGradeClass(JSON.parse(stored));
      }
    });
  }, []);

  // 1분 간격 타이머
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment().format("HH:mm"));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // NEIS API 호출
  const {
    data: rawData,
    isLoading,
    isError,
  } = useQuery(
    ["todayTimetable", gradeClass?.grade, gradeClass?.class, targetDateStr],
    () =>
      getNeisTimetable(
        gradeClass!.grade,
        gradeClass!.class,
        targetDateStr,
        targetDateStr
      ),
    {
      enabled: !!gradeClass,
      staleTime: 1000 * 60 * 30, // 30분 캐시
    }
  );

  // 데이터 변환
  const rawSlots = useMemo(() => {
    if (!rawData) return [];
    return processNeisResponse(rawData, targetDateStr);
  }, [rawData, targetDateStr]);

  // 상태 계산
  const { updatedSlots: slots, currentIndex } = useMemo(() => {
    if (rawSlots.length === 0) return { updatedSlots: [], currentIndex: 0 };
    return calculateStatuses(rawSlots, isToday, currentTime);
  }, [rawSlots, isToday, currentTime]);

  return {
    slots,
    isLoading,
    isError,
    isToday,
    targetDate,
    currentIndex,
    hasGradeClass: !!gradeClass,
  };
}
