import { TouchableOpacity, Text } from "react-native";

export default function ButtonOnlyText({ onPress, text }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>{text}</Text>
    </TouchableOpacity>
  );
}
