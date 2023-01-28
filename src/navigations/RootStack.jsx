import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "./main/MainTabNavigator";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./auth/AuthStack";
import CommunityDetailScreen from "../screens/main/Community/CommunityDetail";
import CommunityPOSTScreen from "../screens/main/Community/CommunityPOSTScreen";

import { navigationRef } from "./RootNavigation";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import FullScreenLoader from "../components/common/FullScreenLoader";
import * as Linking from "expo-linking";
import MealScreen from "../screens/main/Home/Meal";

const Stack = createNativeStackNavigator();

export default function RootStack() {
  const { user, isLoading } = useContext(UserContext);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  const config = {
    screens: {
      Main: {
        screens: {
          HomeStack: {
            initialRouteName: "HomeScreen",
            screens: {
              MealScreen: "meal",
              TimetableScreen: "timetable",
              NewCalendarScreen: "calendar",
              NoticeScreen: "notice",
            },
          },
          FeedStack: {
            screens: { FeedScreen: "feed" },
          },
          CommunityStack: {
            screens: { CommunityScreen: "community" },
          },
        },
      },
      CommunityDetailScreen: "community-detail-screen/:id",
    },
  };

  const linking = {
    prefixes: [Linking.createURL("/"), "kch://"],
    config,
  };
  return (
    <NavigationContainer linking={linking} ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            {/*커뮤니티 디테일 스크린은 탭바가 필요없기에 루트에 추가*/}
            <Stack.Screen
              name="CommunityDetailScreen"
              component={CommunityDetailScreen}
            />
            <Stack.Screen
              name="CommunityPOSTScreen"
              component={CommunityPOSTScreen}
            />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
