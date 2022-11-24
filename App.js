import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClientProvider, QueryClient } from "react-query";
import RootStack from "./src/navigations/RootStack";
import { UserContext } from "./context/UserContext";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const queryClient = new QueryClient();

export default function App() {
  const [user, setUser] = useState({});

  async function getUserOnAsyncStorage() {
    const _user = JSON.parse(await AsyncStorage.getItem("user"));
    setUser(_user);
  }

  useEffect(() => {
    getUserOnAsyncStorage();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <UserContext.Provider value={{ user, setUser }}>
          <RootStack />
        </UserContext.Provider>
        <StatusBar />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
