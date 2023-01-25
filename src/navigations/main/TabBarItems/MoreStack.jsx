import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MoreScreen from "../../../screens/main/More/More";
import StudentCouncilScreen from "../../../screens/main/More/StudentCouncil";
import DeveloperDetailScreen from "../../../screens/main/More/DeveloperDetail";
import ModifyUserInfoScreen from "../../../screens/main/More/ModifyUserInfo";

const Stack = createNativeStackNavigator();
export default function MoreStack() {
  return (
    <Stack.Navigator
      initialRouteName="MoreScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="MoreScreen" component={MoreScreen} />
      <Stack.Screen
        name="StudentCouncilScreen"
        component={StudentCouncilScreen}
      />
      <Stack.Screen
        name="DeveloperDetailScreen"
        component={DeveloperDetailScreen}
      />
      <Stack.Screen
        name="ModifyUserInfoScreen"
        component={ModifyUserInfoScreen}
      />
    </Stack.Navigator>
  );
}
