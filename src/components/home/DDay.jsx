import {
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import moment from "moment";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function DDay() {
  const NowColorState = useColorScheme();

  const today = moment();
  const goalDay = moment("20231116");
  const [remaining, setRemaining] = useState("");

  const styles = StyleSheet.create({
    container: { paddingHorizontal: 3, alignItems: "flex-end" },
    title: { fontSize: 11, color: "gray", fontWeight: "600" },
    day: {
      fontSize: 15,
      fontWeight: "700",
      color: NowColorState === "light" ? "black" : "white",
    },
  });

  useEffect(() => {
    setRemaining(moment.duration(goalDay.diff(today)).asDays().toFixed(5));
  }, []);

  const refresh = () => {
    const newDate = new moment();
    setRemaining(moment.duration(goalDay.diff(newDate)).asDays().toFixed(5));
  };
  return (
    <TouchableOpacity style={styles.container} onPress={refresh}>
      <Text style={styles.title}>2024 수능까지</Text>
      <Text style={styles.day}>D-{remaining}</Text>
      <Ionicons name="refresh" size={14} color="#c4c4c4" />
    </TouchableOpacity>
  );
}
