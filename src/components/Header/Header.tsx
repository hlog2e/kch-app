import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";

import { Octicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
interface HeaderProps {
  title?: string;
  backArrowText?: string;
  rightComponent?: React.ReactNode;
}

export default function Header({
  title,
  backArrowText = "",
  rightComponent,
}: HeaderProps) {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    header: {
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "row",
    },
    title: {
      fontWeight: "700",
      fontSize: 24,
      marginTop: 14,
      marginLeft: 16,
      color: colors.text,
    },
  });

  return (
    <View style={styles.header}>
      {title ? (
        <Text style={styles.title}>{title}</Text>
      ) : (
        <BackArrowButton backArrowText={backArrowText} />
      )}
      {rightComponent}
    </View>
  );
}

interface BackArrowProps {
  backArrowText: string;
}

function BackArrowButton({ backArrowText }: BackArrowProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    wrap: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: 16,
      marginBottom: 6,
    },
    backArrowText: {
      paddingHorizontal: 10,
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
  });
  return (
    <TouchableOpacity
      style={styles.wrap}
      onPress={() => {
        router.back();
      }}
    >
      <Octicons name="chevron-left" size={30} color={colors.text} />
      <Text style={styles.backArrowText}>{backArrowText}</Text>
    </TouchableOpacity>
  );
}
