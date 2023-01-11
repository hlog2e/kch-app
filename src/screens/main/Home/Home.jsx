import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Weather from "../../../components/home/Weather";
import { Ionicons } from "@expo/vector-icons";
import Banner from "../../../components/home/Banner";

export default function HomeScreen({ navigation }) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 25,
      paddingTop: 35,
      paddingBottom: 15,
    },
    header_text: { fontSize: 45, fontWeight: "700" },

    card_container: {
      height: 200,
      flexDirection: "row",
      paddingHorizontal: 15,
    },
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
    desc: {
      fontSize: 12,
      fontWeight: "500",
      color: "gray",
      marginTop: 10,
      lineHeight: 16,
    },
    card_image: {
      position: "absolute",
      bottom: 20,
      right: 20,
      width: 40,
      height: 40,
    },

    small_card: {
      flex: 1,
      margin: 10,
      borderRadius: 20,
      backgroundColor: "white",
      paddingVertical: 17,
      alignItems: "center",
      justifyContent: "space-between",
    },
    small_card_title: {
      color: "black",
      fontWeight: "700",
      fontSize: 12,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.header_text}>홈</Text>
          <Weather />
        </View>

        <Banner />

        <View style={styles.card_container}>
          <TouchableOpacity
            onPress={() => {
              navigation.push("MealScreen");
            }}
            style={styles.card_item}
          >
            <View>
              <Text style={styles.card_title}>급식</Text>
              <Text style={styles.desc}>{"이번주 급식\n메뉴 보러가기"}</Text>
            </View>

            <Image
              source={require("../../../../assets/svgs/rice.png")}
              style={styles.card_image}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.push("TimetableScreen");
            }}
            style={styles.card_item}
          >
            <View>
              <Text style={styles.card_title}>시간표</Text>
              <Text style={styles.desc}>{"이번주 시간표\n보러가기"}</Text>
            </View>

            <Image
              source={require("../../../../assets/svgs/timetable.png")}
              style={styles.card_image}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.card_container}>
          <TouchableOpacity
            style={styles.card_item}
            onPress={() => {
              navigation.push("CalendarScreen");
            }}
          >
            <View>
              <Text style={styles.card_title}>학사일정</Text>
              <Text style={styles.desc}>{"이번달 학사일정\n보러가기"}</Text>
            </View>

            <Image
              source={require("../../../../assets/svgs/calendar.png")}
              style={styles.card_image}
            />
          </TouchableOpacity>

          <View style={{ flex: 0.6 }}>
            <TouchableOpacity
              style={styles.small_card}
              onPress={() => navigation.push("NotificationScreen")}
            >
              <Ionicons name="notifications-outline" size={22} color="gray" />
              <Text style={styles.small_card_title}>공지사항</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.small_card}>
              <Ionicons name="newspaper-outline" size={22} color="gray" />
              <Text style={styles.small_card_title}>패치노트</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
