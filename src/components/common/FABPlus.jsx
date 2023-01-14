import { TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function FABPlus({ color, onPress }) {
  const styles = StyleSheet.create({
    button: {
      zIndex: 100,
      position: "absolute",
      bottom: 20,
      right: 25,
      width: 50,
      height: 50,
      borderRadius: 100,
      backgroundColor: color,
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
