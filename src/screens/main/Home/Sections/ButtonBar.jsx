import { Image } from "expo-image";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

export default function ButtonBar({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.push("CalendarScreen");
        }}
        style={styles.button}
      >
        <Image
          style={styles.buttonImg}
          source={require("../../../../../assets/svgs/calendar.png")}
        />

        <View>
          <Text style={styles.buttonText}>학사일정</Text>
          <Text style={styles.buttonDesc}>학사일정 보러가기</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.margin} />
      <TouchableOpacity
        onPress={() => {
          navigation.push("TimetableScreen");
        }}
        style={styles.button}
      >
        <Image
          style={styles.buttonImg}
          source={require("../../../../../assets/svgs/timetable.png")}
        />

        <View>
          <Text style={styles.buttonText}>시간표</Text>
          <Text style={styles.buttonDesc}>나의 시간표 보러가기</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
  },
  margin: { marginLeft: 10 },

  button: {
    flex: 1,
    height: 60,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonImg: {
    width: 30,
    height: 30,
    marginRight: 16,
  },

  buttonText: { fontSize: 16, fontWeight: "700" },
  buttonDesc: { fontSize: 12, marginTop: 2, fontWeight: "400", color: "gray" },
});
