import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "./main/MainTabNavigator";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./auth/AuthStack";
import SplashScreen from "../screens/splash/Splash";

const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen}></Stack.Screen>
        <Stack.Screen name="Auth" component={AuthStack}></Stack.Screen>
        <Stack.Screen name="Main" component={MainTabNavigator}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
