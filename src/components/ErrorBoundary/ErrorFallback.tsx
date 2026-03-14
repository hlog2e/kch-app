import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Updates from "expo-updates";

interface Props {
  error: Error;
  resetError: () => void;
}

export default function ErrorFallback({ error, resetError }: Props) {
  const isDark = useColorScheme() === "dark";

  const bg = isDark ? "#000000" : "#ffffff";
  const text = isDark ? "#ffffff" : "#000000";
  const subText = isDark ? "#a1a1aa" : "#71717a";
  const divider = isDark ? "#27272a" : "#e4e4e7";

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
        <View style={styles.iconWrapper}>
          <Ionicons name="construct-outline" size={40} color="#3b82f6" />
        </View>

        <Text style={[styles.title, { color: text }]}>
          앗, 문제가 발생했어요
        </Text>

        <View style={[styles.divider, { backgroundColor: divider }]} />

        <Text style={[styles.message, { color: subText }]}>
          금천고 앱 개발자가{"\n"}
          신속하게 문제를 확인하고 수정하고 있어요.
        </Text>
        <Text style={[styles.submessage, { color: subText }]}>
          잠시 후 다시 시도해 주세요!
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={resetError}
          activeOpacity={0.8}
        >
          <Ionicons name="refresh" size={18} color="#fff" />
          <Text style={styles.buttonText}>다시 시도</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonOutline, { borderColor: "#3b82f6" }]}
          onPress={() => Updates.reloadAsync()}
          activeOpacity={0.8}
        >
          <Ionicons name="reload" size={18} color="#3b82f6" />
          <Text style={styles.buttonOutlineText}>앱 재시작</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(59,130,246,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  divider: {
    width: 40,
    height: 3,
    borderRadius: 2,
    marginBottom: 16,
  },
  message: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 4,
  },
  submessage: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 28,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    width: "100%",
    paddingVertical: 15,
    borderRadius: 15,
    backgroundColor: "#3b82f6",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonOutline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    width: "100%",
    paddingVertical: 15,
    borderRadius: 15,
    borderWidth: 1.5,
  },
  buttonOutlineText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3b82f6",
  },
});
