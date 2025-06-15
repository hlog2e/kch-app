import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import moment from "moment";
import { useTheme } from "@react-navigation/native";
import { getNeisTimetable } from "../../../../apis/neis/timetable";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 타입 정의
interface TimetableItem {
  ITRT_CNTNT: string;
  PERIO: string;
  ALL_TI_YMD: string;
}

interface GradeClass {
  grade: number;
  class: number;
}

interface NeisTimetableResponse {
  hisTimetable?: Array<{
    row: TimetableItem[];
  }>;
}

type TimetableData = TimetableItem[][];

interface SelectorProps {
  value: number;
  onValueChange: (value: number) => void;
}

interface GradeSelectorProps {
  value: number;
  onValueChange: (value: number) => void;
  type: "grade" | "class";
}

interface ClassSelectorProps {
  value: number;
  onValueChange: (value: number) => void;
}

// 학년 선택기 컴포넌트
function GradeSelector({ value, onValueChange }: SelectorProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    headerButton: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 8,
    },
    headerButtonText: {
      fontWeight: "700",
      color: colors.subText,
    },
  });

  return (
    <RNPickerSelect
      fixAndroidTouchableBug
      items={[
        { label: "1학년", value: 1 },
        { label: "2학년", value: 2 },
        { label: "3학년", value: 3 },
      ]}
      value={value}
      onValueChange={onValueChange}
    >
      <TouchableOpacity style={styles.headerButton}>
        <Text style={styles.headerButtonText}>{value}학년</Text>
        <Ionicons name="caret-down-outline" size={12} color={colors.subText} />
      </TouchableOpacity>
    </RNPickerSelect>
  );
}

// 반 선택기 컴포넌트
function ClassSelector({ value, onValueChange }: SelectorProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    headerButton: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 8,
    },
    headerButtonText: {
      fontWeight: "700",
      color: colors.subText,
    },
  });

  return (
    <RNPickerSelect
      fixAndroidTouchableBug
      items={[
        { label: "1반", value: 1 },
        { label: "2반", value: 2 },
        { label: "3반", value: 3 },
        { label: "4반", value: 4 },
        { label: "5반", value: 5 },
        { label: "6반", value: 6 },
        { label: "7반", value: 7 },
        { label: "8반", value: 8 },
        { label: "9반", value: 9 },
      ]}
      value={value}
      onValueChange={onValueChange}
    >
      <TouchableOpacity style={styles.headerButton}>
        <Text style={styles.headerButtonText}>{value}반</Text>
        <Ionicons name="caret-down-outline" size={12} color={colors.subText} />
      </TouchableOpacity>
    </RNPickerSelect>
  );
}

// 시간표 헤더 컴포넌트
function TimetableHeader({
  gradeClass,
  onGradeClassChange,
}: {
  gradeClass: GradeClass;
  onGradeClassChange: (gradeClass: GradeClass) => void;
}) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      paddingVertical: 8,
      color: colors.text,
    },
    headerButtonWrap: {
      flexDirection: "row",
    },
  });

  const handleGradeChange = async (grade: number) => {
    const newGradeClass = { grade, class: gradeClass.class };
    await AsyncStorage.setItem("gradeClass", JSON.stringify(newGradeClass));
    onGradeClassChange(newGradeClass);
  };

  const handleClassChange = async (classNum: number) => {
    const newGradeClass = { grade: gradeClass.grade, class: classNum };
    await AsyncStorage.setItem("gradeClass", JSON.stringify(newGradeClass));
    onGradeClassChange(newGradeClass);
  };

  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>이번주 시간표</Text>
      <View style={styles.headerButtonWrap}>
        <GradeSelector
          value={gradeClass.grade}
          onValueChange={handleGradeChange}
        />
        <ClassSelector
          value={gradeClass.class}
          onValueChange={handleClassChange}
        />
      </View>
    </View>
  );
}

// 요일 헤더 컴포넌트
function DayHeader({
  dayNames,
  todayDay,
}: {
  dayNames: string[];
  todayDay: number;
}) {
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
    dayHeaderItemToday: {
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      borderRightWidth: 1,
      borderTopWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.cardBg2,
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
      {dayNames.map((dayName, index) => (
        <View
          key={dayName}
          style={
            index + 1 === todayDay
              ? styles.dayHeaderItemToday
              : styles.dayHeaderItem
          }
        >
          <Text style={styles.dayHeaderItemText}>{dayName}</Text>
        </View>
      ))}
    </View>
  );
}

// 시간표 시간 컬럼 컴포넌트
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

// 시간표 데이터 컬럼 컴포넌트
function TimetableDataColumns({
  data,
  dayNames,
  todayDay,
}: {
  data: TimetableData;
  dayNames: string[];
  todayDay: number;
}) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    dataWrap: {
      flexDirection: "row",
      flex: 1,
    },
    dataCol: {
      flex: 1,
      alignItems: "center",
      borderRightWidth: 1,
      borderColor: colors.border,
    },
    dataColToday: {
      flex: 1,
      alignItems: "center",
      borderRightWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.cardBg2,
    },
    dataItem: {
      height: 50,
      width: "100%",
      paddingHorizontal: 4,
      alignItems: "center",
      justifyContent: "center",
      borderBottomWidth: 1,
      borderColor: colors.border,
    },
    dataText: {
      textAlign: "center",
      fontSize: 12,
      color: colors.text,
      fontWeight: "300",
    },
  });

  return (
    <View style={styles.dataWrap}>
      {dayNames.map((_, dayIndex) => {
        const isToday = todayDay === dayIndex + 1;
        const dayData = data[dayIndex] || [];

        return (
          <View
            key={dayIndex}
            style={isToday ? styles.dataColToday : styles.dataCol}
          >
            {dayData.map((item, itemIndex) => (
              <View key={`${dayIndex}-${itemIndex}`} style={styles.dataItem}>
                <Text style={styles.dataText}>{item.ITRT_CNTNT}</Text>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
}

// 데이터 없음 표시 컴포넌트
function NoDataMessage() {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    nullWrap: {
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 20,
    },
    nullText: {
      marginTop: 8,
      fontSize: 12,
      fontWeight: "600",
      color: colors.subText,
    },
  });

  return (
    <View style={styles.nullWrap}>
      <Text style={styles.nullText}>
        교육청(NEIS)서버에 시간표 정보가 없습니다.
      </Text>
    </View>
  );
}

export default function NeisTimetable() {
  const { colors } = useTheme();
  const [gradeClass, setGradeClass] = useState<GradeClass>({
    grade: 1,
    class: 1,
  });
  const [data, setData] = useState<TimetableData>([]);
  const [noData, setNoData] = useState(false);

  const times = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const dayNames = ["월", "화", "수", "목", "금"];

  const todayDay = moment().day();
  const weekFirstDay = moment()
    .startOf("weeks")
    .add(1, "days")
    .format("YYYYMMDD");
  const weekLastDay = moment()
    .endOf("week")
    .subtract(1, "days")
    .format("YYYYMMDD");

  // 그룹화 및 중복 제거 함수
  const processNeisData = (rowData: TimetableItem[]): TimetableData => {
    const groupedData: { [key: string]: TimetableItem[] } = {};

    rowData.forEach((item) => {
      if (!groupedData[item.ALL_TI_YMD]) {
        groupedData[item.ALL_TI_YMD] = [];
      }
      groupedData[item.ALL_TI_YMD].push(item);
    });

    return Object.values(groupedData).map((dayItems) => {
      const uniqueItems = dayItems.filter(
        (item, index, self) =>
          index === self.findIndex((i) => i.PERIO === item.PERIO)
      );
      return uniqueItems.sort((a, b) => parseInt(a.PERIO) - parseInt(b.PERIO));
    });
  };

  const getNeisData = async () => {
    try {
      const response: any = await getNeisTimetable(
        gradeClass.grade,
        gradeClass.class,
        weekFirstDay,
        weekLastDay
      );

      if (response && !response.hisTimetable) {
        setNoData(true);
        setData([]);
        return;
      }

      setNoData(false);
      const rowData = response.hisTimetable[0]?.row || [];
      const processedData = processNeisData(rowData);
      setData(processedData);
    } catch (error) {
      console.error("NEIS 시간표 조회 오류:", error);
      setNoData(true);
      setData([]);
    }
  };

  const getStoredGradeClass = async () => {
    try {
      const storedGradeClass = await AsyncStorage.getItem("gradeClass");
      if (storedGradeClass) {
        setGradeClass(JSON.parse(storedGradeClass));
      }
    } catch (error) {
      console.error("저장된 학년/반 정보 조회 오류:", error);
    }
  };

  useEffect(() => {
    if (gradeClass.grade && gradeClass.class) {
      getNeisData();
    } else {
      setData([]);
    }
  }, [gradeClass, weekFirstDay, weekLastDay]);

  useEffect(() => {
    getStoredGradeClass();
  }, []);

  const styles = StyleSheet.create({
    container: {
      paddingVertical: 10,
    },
    tableWrap: {
      flexDirection: "row",
    },
  });

  return (
    <ScrollView style={styles.container}>
      <TimetableHeader
        gradeClass={gradeClass}
        onGradeClassChange={setGradeClass}
      />

      {noData ? (
        <NoDataMessage />
      ) : (
        data.length > 0 && (
          <>
            <DayHeader dayNames={dayNames} todayDay={todayDay} />
            <View style={styles.tableWrap}>
              <TimeColumn times={times} />
              <TimetableDataColumns
                data={data}
                dayNames={dayNames}
                todayDay={todayDay}
              />
            </View>
          </>
        )
      )}
    </ScrollView>
  );
}
