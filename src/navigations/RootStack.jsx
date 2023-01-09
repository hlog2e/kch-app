import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "./main/MainTabNavigator";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./auth/AuthStack";
import SplashScreen from "../screens/splash/Splash";
import CommunityDetailScreen from "../screens/main/Community/CommunityDetail";

import { navigationRef } from "./RootNavigation";

const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen}></Stack.Screen>
        <Stack.Screen name="Auth" component={AuthStack}></Stack.Screen>
        <Stack.Screen name="Main" component={MainTabNavigator}></Stack.Screen>
        {/*커뮤니티 디테일 스크린은 탭바가 필요없기에 루트에 추가*/}
        <Stack.Screen
          name="CommunityDetailScreen"
          component={CommunityDetailScreen}
        ></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
