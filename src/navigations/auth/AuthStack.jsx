import { createNativeStackNavigator } from "@react-navigation/native-stack";
import JoinScreen from "../../screens/auth/join/Join";
import LoginScreen from "../../screens/auth/login/Login";
import LoginVerfiyScreen from "../../screens/auth/login/LoginVerfiy";

const Stack = createNativeStackNavigator();
export default function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen}></Stack.Screen>
      <Stack.Screen
        name="LoginVerify"
        component={LoginVerfiyScreen}
      ></Stack.Screen>
      <Stack.Screen name="Join" component={JoinScreen}></Stack.Screen>
    </Stack.Navigator>
  );
}
