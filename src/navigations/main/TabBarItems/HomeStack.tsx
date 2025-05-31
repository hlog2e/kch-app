import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../../../screens/main/Home/Home";
import StudentIDScreen from "../../../screens/main/Home/StudentID";
import CalendarScreen from "../../../screens/main/Home/CalendarScreen";
import TimetableScreen from "../../../screens/main/Home/Timetable/TimetableScreen";
import PhotoDetailScreen from "../../../screens/main/Home/PhotoDetailScreen";
import NoticeDetailScreen from "../../../screens/main/Home/NoticeDetailScreen";

const Stack = createNativeStackNavigator();
export default function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="StudentIDScreen" component={StudentIDScreen} />
      <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
      <Stack.Screen name="TimetableScreen" component={TimetableScreen} />
      <Stack.Screen name="PhotoDetailScreen" component={PhotoDetailScreen} />
      <Stack.Screen name="NoticeDetailScreen" component={NoticeDetailScreen} />
    </Stack.Navigator>
  );
}
