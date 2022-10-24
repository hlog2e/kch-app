import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";

export default function Weather() {
  useEffect(() => {}, []);
  return (
    <View style={{ flexDirection: "row" }}>
      <Ionicons name="sunny" style={{}} size={26} />
      <View style={{ marginHorizontal: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>24 ℃</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="umbrella-outline"
            style={{ color: "gray" }}
            size={12}
          />
          <Text style={{ fontSize: 12, color: "gray" }}> 10 %</Text>
        </View>
      </View>
    </View>
  );
}
