import { ActivityIndicator, View, StyleSheet } from "react-native";

export default function FullScreenBlurLoader({ loading }) {
  const styles = StyleSheet.create({
    absolute: {
      justifyContent: "center",
      backgroundColor: "rgba(52, 52, 52, 0.3)",
      zIndex: 100,
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
  });

  if (loading) {
    return (
      <View style={styles.absolute}>
        <ActivityIndicator />
      </View>
    );
  }
}
