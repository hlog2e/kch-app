import { Image } from "expo-image";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";

export default function ButtonBar() {
  const { colors } = useTheme();
  const router = useRouter();

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
      borderColor: colors.border,
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

    buttonText: { fontSize: 16, fontWeight: "700", color: colors.text },
    buttonDesc: {
      fontSize: 12,
      marginTop: 2,
      fontWeight: "400",
      color: colors.subText,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          router.push("/home/calendar");
        }}
        style={styles.button}
      >
        <Image
          style={styles.buttonImg}
          source={require("../../../assets/svgs/calendar.png")}
        />

        <View>
          <Text style={styles.buttonText}>학사일정</Text>
          <Text style={styles.buttonDesc}>학사일정 보러가기</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.margin} />
      <TouchableOpacity
        onPress={() => {
          router.push("/home/timetable");
        }}
        style={styles.button}
      >
        <Image
          style={styles.buttonImg}
          source={require("../../../assets/svgs/timetable.png")}
        />

        <View>
          <Text style={styles.buttonText}>시간표</Text>
          <Text style={styles.buttonDesc}>나의 시간표 보러가기</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
