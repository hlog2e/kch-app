import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../../screens/auth/Login";
import JoinScreen from "../../screens/auth/Join";

const Stack = createNativeStackNavigator();
export default function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Join" component={JoinScreen} />
    </Stack.Navigator>
  );
}
