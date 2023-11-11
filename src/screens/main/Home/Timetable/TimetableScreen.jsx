import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import OnlyLeftArrowHeader from "../../../../components/common/OnlyLeftArrowHeader";
import NeisTimetable from "./NeisTimetable";
import { useState } from "react";
import { useTheme } from "@react-navigation/native";
import CustomTimetable from "./CustomTimetable";

export default function TimetableScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    header: {
      marginTop: 10,
      marginBottom: 30,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 10,
    },
    headerButton: {
      flex: 1,
      alignItems: "center",
      padding: 15,
      borderBottomWidth: 2,
      borderColor: colors.border,
      marginHorizontal: 5,
    },
    headerButtonSelected: {
      flex: 1,
      alignItems: "center",
      padding: 15,
      borderBottomWidth: 2.5,
      borderColor: colors.blue,
      marginHorizontal: 5,
    },
    headerButtonText: {
      fontWeight: "700",
      fontSize: 16,
      color: colors.subText,
    },
    headerButtonTextSelected: {
      fontWeight: "700",
      fontSize: 16,
      color: colors.blue,
    },

    tableWrap: { flex: 1, paddingHorizontal: 10 },
  });

  const [viewMode, setViewMode] = useState("neis");

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <OnlyLeftArrowHeader navigation={navigation} />

      <View style={styles.header}>
        <TouchableOpacity
          style={
            viewMode === "neis"
              ? styles.headerButtonSelected
              : styles.headerButton
          }
          onPress={() => setViewMode("neis")}
        >
          <Text
            style={
              viewMode === "neis"
                ? styles.headerButtonTextSelected
                : styles.headerButtonText
            }
          >
            NEIS 시간표
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            viewMode === "my"
              ? styles.headerButtonSelected
              : styles.headerButton
          }
          onPress={() => setViewMode("my")}
        >
          <Text
            style={
              viewMode === "my"
                ? styles.headerButtonTextSelected
                : styles.headerButtonText
            }
          >
            나만의 시간표
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tableWrap}>
        {viewMode === "neis" && <NeisTimetable />}
        {viewMode === "my" && <CustomTimetable />}
      </View>
    </SafeAreaView>
  );
}
