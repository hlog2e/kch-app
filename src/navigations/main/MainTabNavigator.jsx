import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatStack from "./TabBarItems/ChatStack";
import CommunityStack from "./TabBarItems/CommunityStack";
import FeedStack from "./TabBarItems/FeedStack";
import HomeStack from "./TabBarItems/HomeStack";
import MoreStack from "./TabBarItems/MoreStack";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          tabBar: {
            borderTopLeftRadius: "30",
            borderTopRightRadius: "30",
            position: "absolute",
            bottom: 0,
          },
        },
        tabBarActiveTintColor: "gray",
        tabBarInactiveTintColor: "#d9d9d9",
        headerShown: false,
      }}
    >
      <Tab.Screen name="피드" component={FeedStack}></Tab.Screen>
      <Tab.Screen name="커뮤니티" component={CommunityStack}></Tab.Screen>
      <Tab.Screen name="홈" component={HomeStack}></Tab.Screen>
      <Tab.Screen name="채팅" component={ChatStack}></Tab.Screen>
      <Tab.Screen name="더보기" component={MoreStack}></Tab.Screen>
    </Tab.Navigator>
  );
}
