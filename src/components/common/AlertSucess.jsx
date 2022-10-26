import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AlertSucess({ text }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#bbf7d0",
        height: 50,
        borderRadius: 7,
        marginVertical: 20,
      }}
    >
      <Ionicons
        name="checkmark-circle-outline"
        size={24}
        color="#4ade80"
        style={{ marginLeft: 15 }}
      />
      <View style={{ marginLeft: 10 }}>
        <Text style={{ color: "#16a34a" }}>{text}</Text>
      </View>
    </View>
  );
}
