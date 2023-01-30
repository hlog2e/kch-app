import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SafeTitleHeader({ title }) {
  const NowColorState = useColorScheme();
  const { top: topInsets } = useSafeAreaInsets();

  const styles = StyleSheet.create({
    header: {
      backgroundColor: NowColorState === "light" ? "white" : "#18171c",
      borderColor: NowColorState === "light" ? "#d9d9d9" : "black",
      borderBottomWidth: 0.3,
    },
    title: {
      paddingVertical: 12,
      paddingHorizontal: 14,
      fontSize: 20,
      fontWeight: "700",
      color: NowColorState === "light" ? "black" : "white",
    },
  });

  return (
    <View style={[styles.header, { paddingTop: topInsets }]}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}
