import React from "react";
import { Redirect } from "expo-router";
import { useUser } from "../context/UserContext";
import { View, ActivityIndicator } from "react-native";

export default function Main() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/login" />;
}
