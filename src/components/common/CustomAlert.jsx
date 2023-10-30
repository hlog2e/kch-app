import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CustomAlert({
  show,
  status,
  message,
  children,
  onClose,
}) {
  if (show) {
    return (
      <View style={styles.container}>
        <View style={styles.alert}>
          <View style={styles.wrap}>
            {status === "error" && (
              <Ionicons name="alert-circle-outline" size={70} color="#ef4444" />
            )}
            {status === "success" && (
              <Ionicons
                name="checkmark-circle-outline"
                size={70}
                color="#4ade80"
              />
            )}
            {status === "info" && (
              <Ionicons
                name="information-circle-outline"
                size={70}
                color="#64748b"
              />
            )}
            <Text style={styles.text}>{message}</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>확인</Text>
          </TouchableOpacity>
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
  alert: {
    width: "100%",
    borderRadius: 35,
    backgroundColor: "white",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  wrap: { alignItems: "center" },
  text: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    width: "100%",
    height: 50,
    backgroundColor: "#3b82f6",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
