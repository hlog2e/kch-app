import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../../../screens/main/Home/Home";
import MealScreen from "../../../screens/main/Home/Meal";
import TimetableScreen from "../../../screens/main/Home/TimeTable";
import CalendarScreen from "../../../screens/main/Home/Calendar";
import NoticeScreen from "../../../screens/main/Home/Notice";

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
      <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
      <Stack.Screen name="NoticeScreen" component={NoticeScreen} />
    </Stack.Navigator>
  );
}
