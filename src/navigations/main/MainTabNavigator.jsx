import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatStack from "./TabBarItems/ChatStack";
import CommunityStack from "./TabBarItems/CommunityStack";
import FeedStack from "./TabBarItems/FeedStack";
import HomeStack from "./TabBarItems/HomeStack";
import MoreStack from "./TabBarItems/MoreStack";

import { MaterialIcons } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          borderTopLeftRadius: "25",
          borderTopRightRadius: "25",
          height: 90,
          position: "absolute",
          bottom: 0,
        },
        tabBarItemStyle: { paddingVertical: 5, paddingBottom: 10 },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "700" },
        tabBarActiveTintColor: "gray",
        tabBarInactiveTintColor: "#d9d9d9",
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="피드"
        component={FeedStack}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="article" size="28" color={color} />
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen name="커뮤니티" component={CommunityStack}></Tab.Screen>
      <Tab.Screen
        name="홈"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color }) => (
            <Foundation name="home" size="28" color={color} />
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen name="채팅" component={ChatStack}></Tab.Screen>
      <Tab.Screen name="더보기" component={MoreStack}></Tab.Screen>
    </Tab.Navigator>
  );
}
