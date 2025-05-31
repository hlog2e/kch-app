import React, { useContext, useState, createContext, ReactNode } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AnimatedLottieView from "lottie-react-native";
import lottieData from "../assets/lottie/loader.json";

export type AlertStatus =
  | "error"
  | "info"
  | "success"
  | "warning"
  | "loading"
  | null;

interface AlertState {
  show: boolean;
  status: AlertStatus;
  message: string | null;
  icon: string | null;
  color: string | null;
}

interface AlertContextValue {
  error: (msg: string) => void;
  info: (msg: string) => void;
  success: (msg: string) => void;
  warning: (msg: string) => void;
  loading: (msg: string) => void;
  close: () => void;
}

export const AlertContext = createContext<AlertContextValue>({
  /* eslint-disable @typescript-eslint/no-empty-function */
  error: () => {},
  info: () => {},
  success: () => {},
  warning: () => {},
  loading: () => {},
  close: () => {},
});

export const useAlert = () => useContext(AlertContext);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    status: null,
    message: null,
    icon: null,
    color: null,
  });

  const error = (message: string) => {
    setAlert({
      show: true,
      status: "error",
      message,
      icon: "alert-circle-outline",
      color: "#ef4444",
    });
  };

  const info = (message: string) => {
    setAlert({
      show: true,
      status: "info",
      message,
      icon: "information-circle-outline",
      color: "#64748b",
    });
  };

  const success = (message: string) => {
    setAlert({
      show: true,
      status: "success",
      message,
      icon: "checkmark-circle-outline",
      color: "#4ade80",
    });
  };

  const warning = (message: string) => {
    setAlert({
      show: true,
      status: "warning",
      message,
      icon: "warning-outline",
      color: "#f59e0b",
    });
  };

  const loading = (message: string) => {
    setAlert({
      show: true,
      status: "loading",
      message,
      icon: null,
      color: null,
    });
  };

  const close = () => {
    setAlert({
      show: false,
      status: null,
      message: null,
      icon: null,
      color: null,
    });
  };

  return (
    <AlertContext.Provider
      value={{ error, info, success, warning, loading, close }}
    >
      {alert.show ? (
        <View style={styles.container}>
          <View style={styles.alert}>
            {alert.status === "loading" ? (
              <View style={styles.wrap}>
                <AnimatedLottieView
                  autoPlay
                  style={styles.lottie}
                  source={lottieData}
                />
                <Text style={styles.text}>{alert.message}</Text>
              </View>
            ) : (
              <>
                <View style={styles.wrap}>
                  <Ionicons
                    name={alert.icon as any}
                    size={70}
                    color={alert.color ?? undefined}
                  />

                  <Text style={styles.text}>{alert.message}</Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    setAlert({
                      show: false,
                      status: null,
                      message: null,
                      icon: null,
                      color: null,
                    })
                  }
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>확인</Text>
                </TouchableOpacity>
              </>
            )}
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
  lottie: { marginTop: -5, width: 160, height: 160 },
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
