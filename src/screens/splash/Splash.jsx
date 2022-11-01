import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import * as ExpoSplash from "expo-splash-screen";

import AsyncStorage from "@react-native-async-storage/async-storage";

ExpoSplash.preventAutoHideAsync();

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    (async () => {
      const user = await AsyncStorage.getItem("user");

      if (false) {
        navigation.replace("Main");
        ExpoSplash.hideAsync();
      } else {
        navigation.replace("Auth");
        ExpoSplash.hideAsync();
      }
    })();
  }, []);
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});
