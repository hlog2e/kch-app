import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import * as ExpoSplash from "expo-splash-screen";

ExpoSplash.preventAutoHideAsync();

export default function SplashScreen({ navigation }) {
  const [user, setUser] = useState(true);

  useEffect(() => {
    if (user) {
      navigation.replace("Main");
      ExpoSplash.hideAsync();
    } else {
      navigation.replace("Auth");
      ExpoSplash.hideAsync();
    }
  }, []);
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});
