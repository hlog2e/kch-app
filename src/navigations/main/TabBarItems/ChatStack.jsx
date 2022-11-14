import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatScreen from "../../../screens/main/Chat/Chat";

const Stack = createNativeStackNavigator();
export default function ChatStack() {
  return (
    <Stack.Navigator
      initialRouteName="ChatScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="ChatScreen" component={ChatScreen}></Stack.Screen>
    </Stack.Navigator>
  );
}
