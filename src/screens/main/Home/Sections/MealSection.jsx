import { View, ScrollView, Alert, StyleSheet, Text } from "react-native";
import { useQuery } from "react-query";
import { getMeals } from "../../../../../apis/home/meal";
import { useState } from "react";
import moment from "moment";
import { Image } from "expo-image";
import { useTheme } from "@react-navigation/native";

export default function MealSection() {
  const { colors } = useTheme();
  const { data } = useQuery("meals", getMeals);

  const [focus, setFocus] = useState(0);
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
    flexRow: { flexDirection: "row", alignItems: "center" },
    mealWrap: {
      marginTop: 12,
    },
    mealTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginLeft: 14,
      color: colors.text,
    },
    mealImage: { marginLeft: 6, width: 40, height: 40 },
    scrollView: { marginTop: 16 },
  });
  if (data && data.meals.length > 0) {
    return (
      <View style={styles.mealWrap}>
        <View style={styles.flexRow}>
          <Text style={styles.mealTitle}>
            {moment(data.meals[focus]._id).isSame(new Date(), "day")
              ? "오늘의 급식"
              : moment(data.meals[focus]._id).format("M월 D일") +
                ` ${days[moment(data.meals[focus]._id).days()]}`}
          </Text>
          <Image
            style={styles.mealImage}
            source={require("../../../../../assets/svgs/rice.png")}
          />
        </View>
        <ScrollView
          scrollEventThrottle={1}
          onScroll={(e) => {
            const average = e.nativeEvent.contentSize.width / data.meals.length;

            if (e.nativeEvent.contentOffset.x > 0) {
              setFocus(
                Math.round(e.nativeEvent.contentOffset.x / average - 0.25)
              );
            }
          }}
          style={styles.scrollView}
          horizontal
        >
          {data.meals.map((_children) => {
            return _children.meals.map((_meal) => {
              return (
                <MealItem
                  key={_meal._id}
                  title={_meal.type}
                  kcal={_meal.kcal}
                  menu={_meal.menu}
                />
              );
            });
          })}
        </ScrollView>
      </View>
    );
  }
}

function MealItem({ title, kcal, menu }) {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    container: {
      borderWidth: title === "중식" ? 0 : 1,
      borderColor: colors.border,
      borderRadius: 30,
      minHeight: 180,
      width: 180,
      padding: 18,
      marginLeft: 12,
      backgroundColor: title === "중식" ? colors.cardBg2 : colors.cardBg,
    },
    header: {
      alignItems: "flex-end",
      justifyContent: "center",
      flexDirection: "row",
    },
    headerTitle: { fontSize: 18, fontWeight: "700", color: colors.text },
    kcal: {
      fontWeight: "200",
      fontSize: 11,
      marginLeft: 4,
      color: colors.subText,
    },

    menuWrap: { marginTop: 10 },
    menuText: { color: colors.subText, fontSize: 13, lineHeight: 16 },
  });
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.kcal}>{kcal}</Text>
      </View>
      <View style={styles.menuWrap}>
        {menu.map((_menu) => {
          return (
            <Text key={_menu} style={styles.menuText}>
              {_menu}
            </Text>
          );
        })}
      </View>
    </View>
  );
}
