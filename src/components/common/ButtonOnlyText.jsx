import { TouchableOpacity, Text } from "react-native";

export default function ButtonOnlyText({ onPress, text, color }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "600", color: color }}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}
