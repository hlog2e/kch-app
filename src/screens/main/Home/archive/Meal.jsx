import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Dimensions,
  Alert,
  useColorScheme,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "react-query";
import OnlyLeftArrowHeader from "../../../components/common/OnlyLeftArrowHeader";

import uuid from "react-native-uuid";
import { getMeals } from "../../../../apis/home/meal";
import moment from "moment";

import * as Linking from "expo-linking";

export default function MealScreen({ navigation }) {
  const NowColorState = useColorScheme();

  const { status, data, error } = useQuery("meals", getMeals, {
    onError: () => {
      Alert.alert("오류", "급식 데이터를 가져오는데 오류가 발생하였습니다.", [
        { text: "확인" },
      ]);
    },
  });

  const styles = StyleSheet.create({
    container: { flex: 1 },
    row: { flexDirection: "row", alignItems: "center" },
    header_container: {
      paddingVertical: 28,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    header_title: {
      fontSize: 32,
      fontWeight: "700",
      marginLeft: 16,
      marginTop: 6,
      color: NowColorState === "light" ? "black" : "white",
    },
  });

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <OnlyLeftArrowHeader navigation={navigation} />
      <ScrollView>
        <View style={styles.header_container}>
          <View style={styles.row}>
            <Image
              style={{
                width: 64,
                height: 64,
              }}
              source={require("../../../../assets/svgs/rice.png")}
            />
            <Text style={styles.header_title}>급식</Text>
          </View>
          {/*ios일때만 add to siri 버튼 추가*/}
          {Platform.OS === "ios" ? (
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(
                  "https://www.icloud.com/shortcuts/b26d2eaa565c407a95e67ff6bac5082b"
                );
              }}
            >
              <Image
                style={{ height: 64, width: 120 }}
                resizeMode={"contain"}
                source={require("../../../../assets/images/add_to_siri.png")}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        {status === "loading" ? (
          <View
            style={{
              height: Dimensions.get("screen").height / 2,
              justifyContent: "center",
            }}
          >
            <ActivityIndicator />
          </View>
        ) : null}

        {status === "success"
          ? data.data.map((_item) => {
              return (
                <Row key={uuid.v4()} _id={_item._id} meals={_item.meals} />
              );
            })
          : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ _id, meals }) {
  const NowColorState = useColorScheme();

  const days = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];

  const styles = StyleSheet.create({
    row_container: { paddingVertical: 10 },
    date_text: {
      padding: 20,
      fontSize: 20,
      fontWeight: "700",
      color: NowColorState === "light" ? "black" : "white",
    },
    scroll_container: { minHeight: 200 },
  });
  return (
    <View style={styles.row_container}>
      <Text style={styles.date_text}>
        {moment(_id).format("MM월 DD일") + " " + days[moment(_id).days()]}
      </Text>
      <ScrollView style={styles.scroll_container} horizontal={true}>
        {meals.map((_item) => (
          <Item
            key={_item._id}
            type={_item.type}
            menu={_item.menu}
            kcal={_item.kcal}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function Item({ type, menu, kcal }) {
  const NowColorState = useColorScheme();

  const styles = StyleSheet.create({
    item: {
      width: 200,
      backgroundColor: NowColorState === "light" ? "white" : "#2c2c36",
      borderRadius: 30,
      marginLeft: 15,
      padding: 20,
    },
    meal_type_text: {
      fontSize: 22,
      fontWeight: "700",
      color: NowColorState === "light" ? "black" : "white",
    },
    meal_kcal_text: { fontSize: 12, color: "gray", marginLeft: 6 },
    meal_menu_text: {
      lineHeight: 17,
      fontWeight: "500",
      fontSize: 14,
      color: NowColorState === "light" ? "gray" : "white",
    },
  });

  return (
    <View style={styles.item}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <Text style={styles.meal_type_text}>{type}</Text>
        <Text style={styles.meal_kcal_text}>{kcal}</Text>
      </View>
      <View style={{ marginTop: 14 }}>
        {menu.map((menuText) => (
          <Text key={uuid.v4()} style={styles.meal_menu_text}>
            {menuText}
          </Text>
        ))}
      </View>
    </View>
  );
}
