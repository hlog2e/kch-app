import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CommunityScreen from "../../../screens/main/Community/Community";

const Stack = createNativeStackNavigator();
export default function CommunityStack() {
  return (
    <Stack.Navigator
      initialRouteName="CommunityScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="CommunityScreen"
        component={CommunityScreen}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}
