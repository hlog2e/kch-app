import { TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

export default function FABPlus({ onPress }) {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    button: {
      zIndex: 100,
      position: "absolute",
      bottom: 20,
      right: 25,
      width: 50,
      height: 50,
      borderRadius: 100,
      backgroundColor: colors.blue,
      justifyContent: "center",
      alignItems: "center",
    },
  });
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Feather name="plus" size={28} color="white" />
    </TouchableOpacity>
  );
}
