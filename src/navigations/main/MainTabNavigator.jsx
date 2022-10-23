import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ChatStack from "./TabBarItems/ChatStack";
import CommunityStack from "./TabBarItems/CommunityStack";
import FeedStack from "./TabBarItems/FeedStack";
import HomeStack from "./TabBarItems/HomeStack";
import MoreStack from "./TabBarItems/MoreStack";

import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const { bottom: bottomInsets } = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { height: bottomInsets + 50 },
        tabBarShowLabel: false,
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "black",
        headerShown: false,
      }}
      initialRouteName="홈"
    >
      <Tab.Screen
        name="피드"
        component={FeedStack}
        options={{
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Ionicons name="albums" size="26" color={color} />
            ) : (
              <Ionicons name="albums-outline" size="26" color={color} />
            ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="커뮤니티"
        component={CommunityStack}
        options={{
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Ionicons name="people" size="26" color={color} />
            ) : (
              <Ionicons name="people-outline" size="26" color={color} />
            ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="홈"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Ionicons name="home" size="26" color={color} />
            ) : (
              <Ionicons name="home-outline" size="26" color={color} />
            ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="채팅"
        component={ChatStack}
        options={{
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Ionicons name="chatbubbles" size="26" color={color} />
            ) : (
              <Ionicons name="chatbubbles-outline" size="26" color={color} />
            ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="더보기"
        component={MoreStack}
        options={{
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Ionicons name="ellipsis-horizontal" size="26" color={color} />
            ) : (
              <Ionicons
                name="ellipsis-horizontal-outline"
                size="26"
                color={color}
              />
            ),
        }}
      ></Tab.Screen>
    </Tab.Navigator>
  );
}
