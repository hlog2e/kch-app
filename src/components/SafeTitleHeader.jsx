import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";

export default function SafeTitleHeader({ title, rightComponent }) {
  const { colors } = useTheme();
  const { top: topInsets } = useSafeAreaInsets();

  const styles = StyleSheet.create({
    header: {
      paddingHorizontal: 14,
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderBottomWidth: 0.3,
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
    },
    title: {
      paddingVertical: 12,

      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
    },
  });

  return (
    <View style={[styles.header, { paddingTop: topInsets }]}>
      <Text style={styles.title}>{title}</Text>
      {rightComponent}
    </View>
  );
}
