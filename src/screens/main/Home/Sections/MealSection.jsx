import { View, ScrollView, Alert, StyleSheet, Text } from "react-native";
import { useQuery } from "react-query";
import { getMeals } from "../../../../../apis/home/meal";
import { useState } from "react";
import moment from "moment";

export default function MealSection() {
  const { data } = useQuery("meals", getMeals, {
    onError: () => {
      Alert.alert("오류", "급식 데이터를 가져오는데 오류가 발생하였습니다.", [
        { text: "확인" },
      ]);
    },
  });

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
    mealWrap: {
      marginTop: 24,
    },
    mealTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginLeft: 14,
    },
    scrollView: { marginTop: 16 },
  });
  if (data)
    return (
      <View style={styles.mealWrap}>
        <Text style={styles.mealTitle}>
          {moment(data.meals[focus]._id).isSame(new Date(), "day")
            ? "오늘의 급식"
            : moment(data.meals[focus]._id).format("M월 D일") +
              ` ${days[moment(data.meals[focus]._id).days()]} 급식`}
        </Text>
        <ScrollView
          scrollEventThrottle={1}
          onScroll={(e) => {
            const average = e.nativeEvent.contentSize.width / 4; //5개는 급식 아이템

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

function MealItem({ title, kcal, menu }) {
  const styles = StyleSheet.create({
    container: {
      borderWidth: title === "중식" ? 0 : 1,
      borderColor: "#e2e8f0",
      borderRadius: 30,
      minHeight: 180,
      width: 180,
      padding: 18,
      marginLeft: 12,
      backgroundColor: title === "중식" ? "#f4f4f4" : "white",
    },
    header: {
      alignItems: "flex-end",
      justifyContent: "center",
      flexDirection: "row",
    },
    headerTitle: { fontSize: 18, fontWeight: "700" },
    kcal: { fontWeight: "200", fontSize: 11, marginLeft: 4 },

    menuWrap: { marginTop: 10 },
    menuText: { color: "gray", fontSize: 13, marginBottom: 3 },
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