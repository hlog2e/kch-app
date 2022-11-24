import { useContext, useEffect, useState } from "react";
import * as ExpoSplash from "expo-splash-screen";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { View } from "react-native";
import { UserContext } from "../../../context/UserContext";

ExpoSplash.preventAutoHideAsync();

export default function SplashScreen({ navigation }) {
  const { user, setUser } = useContext(UserContext);

  async function redirect() {
    if (user) {
      navigation.replace("Main");
      await ExpoSplash.hideAsync();
    } else {
      navigation.replace("Auth");
      await ExpoSplash.hideAsync();
    }
  }

  useEffect(() => {
    redirect();
  }, []);

  return <View></View>;
}
