import { useEffect } from "react";
import * as ExpoSplash from "expo-splash-screen";

import AsyncStorage from "@react-native-async-storage/async-storage";

ExpoSplash.preventAutoHideAsync();

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    (async () => {
      const user = await AsyncStorage.getItem("user");

      if (user) {
        navigation.replace("Main");
        ExpoSplash.hideAsync();
      } else {
        navigation.replace("Auth");
        ExpoSplash.hideAsync();
      }
    })();
  }, []);
}
