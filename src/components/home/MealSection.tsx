import React, { useEffect } from "react";
import { View, ScrollView, Alert, StyleSheet, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { useQuery } from "react-query";
import { getMeals } from "../../../apis/school_data/meal";
import { useState } from "react";
import moment from "moment";
import { Image } from "expo-image";
import { useTheme } from "@react-navigation/native";

// 이미지 import
const riceImage = require("../../../assets/svgs/rice.png");

export default function MealSection() {
  const { colors } = useTheme();
  const { data } = useQuery("meals", getMeals);

  // 애니메이션 설정
  const translateX = useSharedValue(-50);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // 600ms 지연 후 왼쪽에서 슬라이드인
    translateX.value = withDelay(
      600,
      withSpring(0, { damping: 15, stiffness: 120 })
    );
    opacity.value = withDelay(
      600,
      withSpring(1, { damping: 15, stiffness: 120 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

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
      // marginTop: 4,
    },
    mealTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 14,
      color: colors.text,
    },
    mealImage: { marginLeft: 6, width: 30, height: 30 },
    scrollView: { marginTop: 16, paddingLeft: 14 },
  });
  if (data && data.meals.length > 0) {
    return (
      <Animated.View style={[styles.mealWrap, animatedStyle]}>
        <View style={styles.flexRow}>
          <Text style={styles.mealTitle}>
            {moment(data.meals[focus]._id).isSame(new Date(), "day")
              ? "오늘의 급식"
              : moment(data.meals[focus]._id).format("M월 D일") +
                ` ${days[moment(data.meals[focus]._id).days()]}`}
          </Text>
          <Image style={styles.mealImage} source={riceImage} />
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
          showsHorizontalScrollIndicator={false}
        >
          {data.meals.map((_children: any) => {
            return _children.meals.map((_meal: any) => {
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
      </Animated.View>
    );
  }
}

function MealItem({ title, kcal, menu }: { title: any; kcal: any; menu: any }) {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    container: {
      borderWidth: title === "석식" ? 0 : 0.5,
      borderColor: colors.border,
      borderRadius: 30,
      minHeight: 160,
      width: 160,
      padding: 14,
      marginRight: 12,
      backgroundColor: title === "석식" ? "#F2F9FF" : "white",
    },
    header: {
      alignItems: "flex-end",
      justifyContent: "center",
      flexDirection: "row",
    },
    headerTitle: { fontSize: 16, fontWeight: "700", color: colors.text },
    kcal: {
      fontWeight: "200",
      fontSize: 10,
      marginLeft: 4,
      color: colors.subText,
    },

    menuWrap: { marginTop: 12 },
    menuText: { color: colors.subText, fontSize: 13, lineHeight: 16 },
  });
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.kcal}>{kcal}</Text>
      </View>
      <View style={styles.menuWrap}>
        {menu.map((_menu: any) => {
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
