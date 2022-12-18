import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SafeTitleHeader({ title }) {
  const { top: topInsets } = useSafeAreaInsets();
  console.log(topInsets);
  return (
    <View style={[styles.header, { paddingTop: topInsets }]}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "white",
    borderColor: "#f2f2f2",
    borderBottomWidth: 1,
  },
  title: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 20,
    fontWeight: "700",
  },
});
