import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../../../screens/main/Home/Home";
import MealScreen from "../../../screens/main/Home/Meal";
import TimetableScreen from "../../../screens/main/Home/TimeTable";
// import CalendarScreen from "../../../screens/main/Home/Calendar";
import NewCalendarScreen from "../../../screens/main/Home/NewCalendar";
import NoticeScreen from "../../../screens/main/Home/Notice";
import StudentIDScreen from "../../../screens/main/Home/StudentID";

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
      {/*<Stack.Screen name="CalendarScreen" component={CalendarScreen} />*/}
      <Stack.Screen name="NewCalendarScreen" component={NewCalendarScreen} />
      <Stack.Screen name="NoticeScreen" component={NoticeScreen} />
      <Stack.Screen name="StudentIDScreen" component={StudentIDScreen} />
    </Stack.Navigator>
  );
}
