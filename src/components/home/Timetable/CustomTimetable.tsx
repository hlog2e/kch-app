import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

// 타입 정의
interface TimetableData {
  [dayIndex: string]: {
    [timeIndex: string]: string;
  };
}

interface TimetableCellProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

interface DayColumnProps {
  dayData: { [timeIndex: string]: string };
  dayIndex: number;
  times: string[];
  onUpdateCell: (dayIndex: number, timeIndex: number, value: string) => void;
}

// Mock API functions (실제 API 연결 시 교체)
const getCustomTimetable = async (): Promise<TimetableData | null> => {
  try {
    const data = await AsyncStorage.getItem("customTimetable");
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Custom timetable fetch error:", error);
    return null;
  }
};

const postCustomTimetable = async (data: TimetableData): Promise<boolean> => {
  try {
    await AsyncStorage.setItem("customTimetable", JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Custom timetable save error:", error);
    return false;
  }
};

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
      paddingHorizontal: 4,
      alignItems: "center",
      justifyContent: "center",
      borderBottomWidth: 1,
      borderColor: colors.border,
    },
    textInput: {
      textAlign: "center",
      fontSize: 12,
      color: colors.text,
      fontWeight: "300",
      width: "100%",
      height: "100%",
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
        textAlignVertical="center"
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
          value={dayData[timeIndex.toString()] || ""}
          onChangeText={(text) => onUpdateCell(dayIndex, timeIndex, text)}
          placeholder="과목명"
        />
      ))}
    </View>
  );
}

// 시간표 헤더 컴포넌트
function TimetableHeader({ onSave }: { onSave: () => void }) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      paddingVertical: 8,
      color: colors.text,
    },
    saveButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: colors.primary,
      borderRadius: 8,
    },
    saveButtonText: {
      color: "#ffffff",
      fontWeight: "600",
      marginLeft: 4,
    },
  });

  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>내 시간표</Text>
      <TouchableOpacity style={styles.saveButton} onPress={onSave}>
        <Ionicons name="save-outline" size={16} color="#ffffff" />
        <Text style={styles.saveButtonText}>저장</Text>
      </TouchableOpacity>
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

export default function CustomTimetable() {
  const { colors } = useTheme();
  const [timetableData, setTimetableData] = useState<TimetableData>({});

  const times = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const dayNames = ["월", "화", "수", "목", "금"];

  // 시간표 데이터 초기화
  const initializeTimetableData = () => {
    const initialData: TimetableData = {};
    for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
      initialData[dayIndex.toString()] = {};
      for (let timeIndex = 0; timeIndex < 8; timeIndex++) {
        initialData[dayIndex.toString()][timeIndex.toString()] = "";
      }
    }
    return initialData;
  };

  // 시간표 데이터 로드
  const loadTimetableData = async () => {
    try {
      const data = await getCustomTimetable();
      if (data) {
        setTimetableData(data);
      } else {
        setTimetableData(initializeTimetableData());
      }
    } catch (error) {
      console.error("시간표 로드 오류:", error);
      setTimetableData(initializeTimetableData());
    }
  };

  // 셀 업데이트 함수
  const updateCell = (dayIndex: number, timeIndex: number, value: string) => {
    setTimetableData((prev) => ({
      ...prev,
      [dayIndex.toString()]: {
        ...prev[dayIndex.toString()],
        [timeIndex.toString()]: value,
      },
    }));
  };

  // 시간표 저장
  const saveTimetable = async () => {
    try {
      const success = await postCustomTimetable(timetableData);
      if (success) {
        Alert.alert("저장 완료", "시간표가 성공적으로 저장되었습니다.");
      } else {
        Alert.alert("저장 실패", "시간표 저장 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("시간표 저장 오류:", error);
      Alert.alert("저장 실패", "시간표 저장 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    loadTimetableData();
  }, []);

  const styles = StyleSheet.create({
    container: {
      paddingVertical: 10,
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
    <ScrollView style={styles.container}>
      <TimetableHeader onSave={saveTimetable} />
      <DayHeader dayNames={dayNames} />

      <View style={styles.tableWrap}>
        <TimeColumn times={times} />
        <View style={styles.dataWrap}>
          {dayNames.map((_, dayIndex) => (
            <DayColumn
              key={dayIndex}
              dayData={timetableData[dayIndex.toString()] || {}}
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
