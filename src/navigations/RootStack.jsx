import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "./main/MainTabNavigator";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./auth/AuthStack";
import CommunityDetailScreen from "../screens/main/Community/CommunityDetail";

import { navigationRef } from "./RootNavigation";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import FullScreenLoader from "../components/common/FullScreenLoader";

const Stack = createNativeStackNavigator();

export default function RootStack() {
  const { user, isLoading } = useContext(UserContext);

  if (isLoading) {
    return <FullScreenLoader />;
  }
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            {/*커뮤니티 디테일 스크린은 탭바가 필요없기에 루트에 추가*/}
            <Stack.Screen
              name="CommunityDetailScreen"
              component={CommunityDetailScreen}
            />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
