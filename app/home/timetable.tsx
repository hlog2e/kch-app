import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NeisTimetable from "../../src/components/home/Timetable/NeisTimetable";
import { useTheme } from "@react-navigation/native";
import CustomTimetable from "../../src/components/home/Timetable/CustomTimetable";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AnimatedToggle from "../../src/components/common/AnimatedToggle";
import { useTimetableMode } from "../../src/hooks/useTimetableMode";

// Simple Header Component for Timetable
function TimetableHeader() {
  const { colors } = useTheme();
  const router = useRouter();

  const styles = StyleSheet.create({
    header: {
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "row",
    },
    backButton: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: 16,
      marginBottom: 6,
    },
    backButtonText: {
      paddingHorizontal: 10,
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
  });

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={30} color={colors.text} />
        <Text style={styles.backButtonText}>뒤로</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function TimetableScreen() {
  const styles = StyleSheet.create({
    toggleWrap: {
      marginTop: 10,
      paddingHorizontal: 16,
    },
    tableWrap: { flex: 1, paddingHorizontal: 10 },
  });

  const { mode, setMode, isLoading } = useTimetableMode();

  const selectedIndex = mode === "neis" ? 0 : 1;
  const handleToggle = (index: 0 | 1) => {
    setMode(index === 0 ? "neis" : "custom");
  };

  if (isLoading) return null;

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <TimetableHeader />

      <View style={styles.toggleWrap}>
        <AnimatedToggle
          options={["NEIS 시간표", "나만의 시간표"]}
          selectedIndex={selectedIndex as 0 | 1}
          onToggle={handleToggle}
        />
      </View>

      <View style={styles.tableWrap}>
        {mode === "neis" && <NeisTimetable />}
        {mode === "custom" && <CustomTimetable />}
      </View>
    </SafeAreaView>
  );
}
