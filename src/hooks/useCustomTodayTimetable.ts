import { useEffect, useState, useMemo } from "react";
import moment from "moment";
import {
  PERIOD_TIMES,
  LUNCH_TIME,
  LUNCH_AFTER_PERIOD,
} from "../constants/timetable";
import {
  TimetableSlot,
  getTargetSchoolDate,
  calculateStatuses,
} from "./useTodayTimetable";
import { useCustomTimetableQuery } from "./useCustomTimetable";

export function useCustomTodayTimetable() {
  const { data: customData, isLoading } = useCustomTimetableQuery();
  // TODO: 스크린샷용 임시 코드 - 되돌려야 함
  const [currentTime, setCurrentTime] = useState("09:00");

  const { date: targetDate, isToday } = useMemo(
    () => getTargetSchoolDate(),
    [currentTime]
  );

  // 1분 간격 타이머
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment().format("HH:mm"));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // 커스텀 데이터 → TimetableSlot[] 변환
  const rawSlots = useMemo(() => {
    if (!customData) return [];

    // moment.day(): 0=일, 1=월, ..., 6=토
    // customData의 dayIndex: 0=월, 1=화, ..., 4=금
    const dayOfWeek = targetDate.day();
    const dayIndex = dayOfWeek - 1; // 월(0) ~ 금(4)

    if (dayIndex < 0 || dayIndex > 4) return [];

    const dayData = customData[dayIndex];
    if (!dayData) return [];

    const slots: TimetableSlot[] = [];

    for (let timeIndex = 0; timeIndex < 8; timeIndex++) {
      const raw = dayData[timeIndex];
      const subject = typeof raw === "string" ? raw.trim() : "";
      if (!subject) continue;

      const periodNum = timeIndex + 1;
      const periodTime = PERIOD_TIMES.find((p) => p.period === periodNum);
      if (!periodTime) continue;

      // 3교시 이후 점심 슬롯 삽입
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
        subject,
        startTime: periodTime.startTime,
        endTime: periodTime.endTime,
        label: periodTime.label,
        status: "upcoming",
      });
    }

    return slots;
  }, [customData, targetDate]);

  // 상태 계산
  const { updatedSlots: slots, currentIndex } = useMemo(() => {
    if (rawSlots.length === 0) return { updatedSlots: [], currentIndex: 0 };
    return calculateStatuses(rawSlots, isToday, currentTime);
  }, [rawSlots, isToday, currentTime]);

  return {
    slots,
    isLoading,
    isToday,
    targetDate,
    currentIndex,
  };
}
