import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CommunityScreen from "../../../screens/main/Community/Community";
import CommunityDetailScreen from "../../../screens/main/Community/CommunityDetail";

const Stack = createNativeStackNavigator();
export default function CommunityStack() {
  return (
    <Stack.Navigator
      initialRouteName="CommunityScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="CommunityScreen" component={CommunityScreen} />
      <Stack.Screen
        name="CommunityDetailScreen"
        component={CommunityDetailScreen}
      />
    </Stack.Navigator>
  );
}
