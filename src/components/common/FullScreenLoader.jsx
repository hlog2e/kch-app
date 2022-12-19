import { ActivityIndicator, Dimensions, View } from "react-native";

export default function FullScreenLoader() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <ActivityIndicator />
    </View>
  );
}
