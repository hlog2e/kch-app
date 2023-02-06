import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SafeTitleHeader({ title, rightComponent }) {
  const NowColorState = useColorScheme();
  const { top: topInsets } = useSafeAreaInsets();

  const styles = StyleSheet.create({
    header: {
      paddingHorizontal: 14,
      backgroundColor: NowColorState === "light" ? "white" : "#18171c",
      borderColor: NowColorState === "light" ? "#d9d9d9" : "black",
      borderBottomWidth: 0.3,
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
    },
    title: {
      paddingVertical: 12,

      fontSize: 20,
      fontWeight: "700",
      color: NowColorState === "light" ? "black" : "white",
    },
  });

  return (
    <View style={[styles.header, { paddingTop: topInsets }]}>
      <Text style={styles.title}>{title}</Text>
      {rightComponent}
    </View>
  );
}
