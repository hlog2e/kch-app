import { ActivityIndicator, Dimensions, View } from "react-native";

export default function FullScreenLoader({ blur }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        zIndex: 100,
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: blur ? "rgba(52, 52, 52, 0.3)" : null,
      }}
    >
      <ActivityIndicator />
    </View>
  );
}
