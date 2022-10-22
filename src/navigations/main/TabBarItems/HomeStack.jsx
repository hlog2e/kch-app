import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import MealScreen from "../../../screens/etc/Meal";
import TimetableScreen from "../../../screens/etc/TimeTable";
import HomeScreen from "../../../screens/main/Home";

import { Octicons } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();
export default function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen
        name="MealScreen"
        component={MealScreen}
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          headerTitle: "",
          headerStyle: { backgroundColor: "white" },
          headerTintColor: "black",
          headerLeft: () => (
            <TouchableOpacity>
              <Octicons name="chevron-left" size={30} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="TimetableScreen" component={TimetableScreen} />
    </Stack.Navigator>
  );
}
