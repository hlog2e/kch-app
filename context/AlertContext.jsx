import { useContext, useState, createContext } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const AlertContext = createContext({
  error: () => {},
  info: () => {},
  success: () => {},
  warning: () => {},
  loading: () => {},
});

export const useAlert = () => useContext(AlertContext);

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState({
    show: null,
    status: null,
    message: null,
    icon: null,
    color: null,
  });

  const error = (_message) => {
    setAlert({
      show: true,
      status: "error",
      message: _message,
      icon: "alert-circle-outline",
      color: "#ef4444",
    });
  };

  const info = (_message) => {
    setAlert({
      show: true,
      status: "info",
      message: _message,
      icon: "information-circle-outline",
      color: "#64748b",
    });
  };

  const success = (_message) => {
    setAlert({
      show: true,
      status: "success",
      message: _message,
      icon: "checkmark-circle-outline",
      color: "#4ade80",
    });
  };

  const warning = (_message) => {
    setAlert({
      show: true,
      status: "warning",
      message: _message,
      icon: "warning-outline",
      color: "#f59e0b",
    });
  };

  const loading = (_message) => {
    setAlert({
      show: true,
      status: "loading",
      message: _message,
    });
  };

  return (
    <AlertContext.Provider value={{ error, info, success, warning }}>
      {alert.show ? (
        <View style={styles.container}>
          <View style={styles.alert}>
            <View style={styles.wrap}>
              <Ionicons name={alert.icon} size={70} color={alert.color} />

              <Text style={styles.text}>{alert.message}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.button}>
              <Text style={styles.buttonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      {children}
    </AlertContext.Provider>
  );
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
