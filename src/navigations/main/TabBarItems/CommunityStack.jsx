import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CommunityScreen from "../../../screens/main/Community/screens/BoardListScreen";
import AccessDeniedScreen from "../../../screens/main/Community/AccessDeniedScreen";
import CommunityInnerListScreen from "../../../screens/main/Community/screens/ListScreen";

const Stack = createNativeStackNavigator();

export default function CommunityStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CommunityScreen" component={CommunityScreen} />
      <Stack.Screen name="AccessDeniedScreen" component={AccessDeniedScreen} />
      <Stack.Screen
        name="CommunityInnerListScreen"
        component={CommunityInnerListScreen}
      />
    </Stack.Navigator>
  );
}
