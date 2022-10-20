import { SafeAreaProvider } from "react-native-safe-area-context";
import RootStack from "./src/navigations/RootStack";

export default function App() {
  return (
    <SafeAreaProvider>
      <RootStack />
    </SafeAreaProvider>
  );
}
