import AnimatedLottieView from "lottie-react-native";
import { View, StyleSheet, Text } from "react-native";
import lottieData from "../../../assets/lottie/loader.json";

export default function CustomLoader({ text, loading }) {
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.modal}>
          <AnimatedLottieView
            autoPlay
            style={styles.lottie}
            source={lottieData}
          />
          <Text style={styles.text}>{text}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(52, 52, 52, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    zIndex: 100,
  },
  modal: {
    width: "100%",
    borderRadius: 35,
    backgroundColor: "white",
    alignItems: "center",
    padding: 25,
  },
  lottie: { marginTop: -5, width: 160, height: 160 },
  text: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
    textAlign: "center",
    lineHeight: 20,
  },
});
