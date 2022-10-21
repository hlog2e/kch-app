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
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          borderTopWidth: 0,
          height: insets.bottom + 60,
        },
        tabBarItemStyle: { height: 50 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "#94a3b8",
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="피드"
        component={FeedStack}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="albums-outline" size="26" color={color} />
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="커뮤니티"
        component={CommunityStack}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-outline" size="26" color={color} />
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="홈"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size="26" color={color} />
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="채팅"
        component={ChatStack}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubbles-outline" size="26" color={color} />
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="더보기"
        component={MoreStack}
        options={{
          tabBarIcon: ({ color }) => (
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
