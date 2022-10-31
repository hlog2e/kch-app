import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Weather from "../../components/home/Weather";

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.header_text}>홈</Text>
          <Weather />
        </View>

        <View style={styles.card_container}>
          <TouchableOpacity
            onPress={() => {
              navigation.push("MealScreen");
            }}
            style={styles.card_item}
          >
            <View>
              <Text style={styles.card_title}>급식</Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "500",
                  color: "gray",
                  marginTop: 10,
                  lineHeight: 16,
                }}
              >
                {"이번주 급식\n메뉴 보러가기"}
              </Text>
            </View>

            <Image
              source={require("../../../assets/svgs/rice.png")}
              style={{
                width: 50,
                height: 50,
                position: "absolute",
                bottom: 20,
                right: 20,
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.card_item}>
            <View>
              <Text style={styles.card_title}>시간표</Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "500",
                  color: "gray",
                  marginTop: 10,
                  lineHeight: 16,
                }}
              >
                {"이번주 시간표\n보러가기"}
              </Text>
            </View>

            <Image
              source={require("../../../assets/svgs/timetable.png")}
              style={{
                width: 40,
                height: 40,
                position: "absolute",
                bottom: 20,
                right: 20,
              }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.card_container}>
          <TouchableOpacity style={styles.card_item}>
            <View>
              <Text style={styles.card_title}>학사일정</Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "500",
                  color: "gray",
                  marginTop: 10,
                  lineHeight: 16,
                }}
              >
                {"이번달 학사일정\n보러가기"}
              </Text>
            </View>

            <Image
              source={require("../../../assets/svgs/calendar.png")}
              style={{
                width: 40,
                height: 40,
                position: "absolute",
                bottom: 20,
                right: 20,
              }}
            />
          </TouchableOpacity>
          <View style={{ flex: 0.8 }}>
            <TouchableOpacity style={styles.card_item}></TouchableOpacity>
            <TouchableOpacity style={styles.card_item}></TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 35,
    paddingHorizontal: 25,
  },
  header_text: { fontSize: 45, fontWeight: "700" },

  card_container: { height: 200, flexDirection: "row", paddingHorizontal: 15 },
  card_item: {
    flex: 1,
    margin: 10,
    borderRadius: 20,
    backgroundColor: "white",
    padding: 20,
  },
  card_title: {
    fontSize: 24,
    fontWeight: "700",
  },
});
