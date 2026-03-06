import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { useEffect, useState, useRef, useCallback } from "react";
import { CustomTimetableData } from "../../../types/timetable";
import {
  useCustomTimetableQuery,
  useCustomTimetableMutation,
} from "../../../hooks/useCustomTimetable";

interface TimetableCellProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

interface DayColumnProps {
  dayData: (string | null)[];
  dayIndex: number;
  times: string[];
  onUpdateCell: (dayIndex: number, timeIndex: number, value: string) => void;
}

// 시간표 셀 컴포넌트
function TimetableCell({
  value,
  onChangeText,
  placeholder,
}: TimetableCellProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    dataItem: {
      height: 50,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      borderBottomWidth: 1,
      borderColor: colors.border,
    },
    textInput: {
      textAlign: "center",
      textAlignVertical: "center",
      fontSize: 12,
      color: colors.text,
      fontWeight: "300",
      width: "100%",
      height: 50,
      lineHeight: 18,
      paddingVertical: 16,
      paddingHorizontal: 2,
    },
  });

  return (
    <View style={styles.dataItem}>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.subText}
        multiline
      />
    </View>
  );
}

// 요일별 컬럼 컴포넌트
function DayColumn({ dayData, dayIndex, times, onUpdateCell }: DayColumnProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    dataCol: {
      flex: 1,
      alignItems: "center",
      borderRightWidth: 1,
      borderColor: colors.border,
    },
  });

  return (
    <View style={styles.dataCol}>
      {times.map((_, timeIndex) => (
        <TimetableCell
          key={`${dayIndex}-${timeIndex}`}
          value={dayData[timeIndex] ?? ""}
          onChangeText={(text) => onUpdateCell(dayIndex, timeIndex, text)}
          placeholder="과목명"
        />
      ))}
    </View>
  );
}

// 요일 헤더 컴포넌트
function DayHeader({ dayNames }: { dayNames: string[] }) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
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
  });

  return (
    <View style={styles.dayHeader}>
      <View style={styles.dayHeaderDummy} />
      {dayNames.map((dayName) => (
        <View key={dayName} style={styles.dayHeaderItem}>
          <Text style={styles.dayHeaderItemText}>{dayName}</Text>
        </View>
      ))}
    </View>
  );
}

// 시간 컬럼 컴포넌트
function TimeColumn({ times }: { times: string[] }) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    leftSideCol: {
      marginRight: 0,
    },
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
  });

  return (
    <View style={styles.leftSideCol}>
      {times.map((time) => (
        <View key={time} style={styles.leftSideColItem}>
          <Text style={styles.leftSideColText}>{time}</Text>
        </View>
      ))}
    </View>
  );
}

const initializeTimetableData = (): CustomTimetableData =>
  Array.from({ length: 5 }, () => Array(8).fill(""));

export default function CustomTimetable() {
  const { colors } = useTheme();
  const [timetableData, setTimetableData] = useState<CustomTimetableData>(
    initializeTimetableData()
  );
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestDataRef = useRef<CustomTimetableData | null>(null);
  const isInitialized = useRef(false);

  const { data: serverData } = useCustomTimetableQuery();
  const { mutate } = useCustomTimetableMutation();

  const times = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const dayNames = ["월", "화", "수", "목", "금"];

  // 서버 데이터 최초 1회만 로컬 state에 복사
  useEffect(() => {
    if (isInitialized.current) return;
    if (serverData === undefined) return; // 아직 로딩 중

    if (serverData && serverData.length > 0) {
      const padded = serverData.map((day) => {
        const arr = day || [];
        // 8교시까지 패딩, null → "" 변환
        return Array.from({ length: 8 }, (_, i) => arr[i] ?? "");
      });
      // 5요일 미만이면 빈 요일 추가
      while (padded.length < 5) {
        padded.push(Array(8).fill(""));
      }
      setTimetableData(padded);
    } else {
      setTimetableData(initializeTimetableData());
    }
    isInitialized.current = true;
  }, [serverData]);

  // 디바운스 자동저장 (서버 POST)
  const autoSave = useCallback(
    (data: CustomTimetableData) => {
      latestDataRef.current = data;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        mutate(data);
        latestDataRef.current = null;
      }, 500);
    },
    [mutate]
  );

  const updateCell = (dayIndex: number, timeIndex: number, value: string) => {
    setTimetableData((prev) => {
      const next = prev.map((day, di) =>
        di === dayIndex
          ? day.map((cell, ti) => (ti === timeIndex ? value : cell))
          : day
      );
      autoSave(next);
      return next;
    });
  };

  // 화면 이탈 시 미저장 데이터 flush
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (latestDataRef.current) {
        mutate(latestDataRef.current);
      }
    };
  }, [mutate]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: 10,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      paddingVertical: 8,
    },
    tableWrap: {
      flexDirection: "row",
    },
    dataWrap: {
      flexDirection: "row",
      flex: 1,
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>내 시간표</Text>
      <DayHeader dayNames={dayNames} />

      <View style={styles.tableWrap}>
        <TimeColumn times={times} />
        <View style={styles.dataWrap}>
          {dayNames.map((_, dayIndex) => (
            <DayColumn
              key={dayIndex}
              dayData={timetableData[dayIndex] || []}
              dayIndex={dayIndex}
              times={times}
              onUpdateCell={updateCell}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
