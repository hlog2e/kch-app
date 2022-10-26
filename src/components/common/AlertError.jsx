import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AlertError({ text }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fecdd3",
        height: 50,
        borderRadius: 7,
        marginVertical: 20,
      }}
    >
      <Ionicons
        name="alert-circle-outline"
        size={24}
        color="#e11d48"
        style={{ marginLeft: 15 }}
      />
      <View style={{ marginLeft: 10 }}>
        <Text style={{ color: "#881337" }}>{text}</Text>
      </View>
    </View>
  );
}
