import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FeedScreen from "../../../screens/main/Feed/Feed";

const Stack = createNativeStackNavigator();
export default function FeedStack() {
  return (
    <Stack.Navigator
      initialRouteName="FeedScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="FeedScreen" component={FeedScreen}></Stack.Screen>
    </Stack.Navigator>
  );
}
