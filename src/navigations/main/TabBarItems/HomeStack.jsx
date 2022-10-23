import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MealScreen from "../../../screens/etc/Meal";
import TimetableScreen from "../../../screens/etc/TimeTable";
import HomeScreen from "../../../screens/main/Home";

const Stack = createNativeStackNavigator();
export default function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="MealScreen" component={MealScreen} />
      <Stack.Screen name="TimetableScreen" component={TimetableScreen} />
    </Stack.Navigator>
  );
}
