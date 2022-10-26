import { TouchableOpacity, Text } from "react-native";

export default function ButtonFullWidth({ text, color, onPress }) {
  return (
    <TouchableOpacity
      style={{
        paddingHorizontal: 15,
        paddingVertical: 20,
        marginBottom: 20,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
        backgroundColor: color,
      }}
      onPress={onPress}
    >
      <Text
        style={{
          color: "white",
          fontSize: 20,
          fontWeight: "700",
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}
