import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MoreScreen from "../../../screens/main/More/More";
import DeveloperDetailScreen from "../../../screens/main/More/DeveloperDetail";

import CommunitiesWrittenByMeScreen from "../../../screens/main/More/CommunitiesWrittenByMe";
import NotificationSettingScreen from "../../../screens/main/More/NotificationSetting";
import EditUserProfileScreen from "../../../screens/main/More/EditUserProfile";

const Stack = createNativeStackNavigator();
export default function MoreStack() {
  return (
    <Stack.Navigator
      initialRouteName="MoreScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="MoreScreen" component={MoreScreen} />

      <Stack.Screen
        name="DeveloperDetailScreen"
        component={DeveloperDetailScreen}
      />
      <Stack.Screen
        name="EditUserProfileScreen"
        component={EditUserProfileScreen}
      />
      <Stack.Screen
        name="CommunitiesWrittenByMeScreen"
        component={CommunitiesWrittenByMeScreen}
      />
      <Stack.Screen
        name="NotificationSettingScreen"
        component={NotificationSettingScreen}
      />
    </Stack.Navigator>
  );
}
