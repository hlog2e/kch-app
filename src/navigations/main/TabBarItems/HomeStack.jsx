import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../../../screens/main/Home/Home";
import StudentIDScreen from "../../../screens/main/Home/StudentID";

const Stack = createNativeStackNavigator();
export default function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />

      <Stack.Screen name="StudentIDScreen" component={StudentIDScreen} />
    </Stack.Navigator>
  );
}
