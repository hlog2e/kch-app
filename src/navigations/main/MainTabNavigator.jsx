import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CommunityStack from "./TabBarItems/CommunityStack";
import FeedStack from "./TabBarItems/FeedStack";
import HomeStack from "./TabBarItems/HomeStack";
import MoreStack from "./TabBarItems/MoreStack";
import * as Haptics from "expo-haptics";

import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const { colors } = useTheme();

  const { bottom: bottomInsets } = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { height: bottomInsets + 50 },
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        headerShown: false,
      }}
      screenListeners={{
        tabPress: () => {
          Haptics.impactAsync("light");
        },
      }}
      initialRouteName="HomeStack"
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Ionicons name="home" size={26} color={color} />
            ) : (
              <Ionicons name="home-outline" size={26} color={color} />
            ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="FeedStack"
        component={FeedStack}
        options={{
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Ionicons name="albums" size={26} color={color} />
            ) : (
              <Ionicons name="albums-outline" size={26} color={color} />
            ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="CommunityStack"
        component={CommunityStack}
        options={{
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Ionicons name="people" size={26} color={color} />
            ) : (
              <Ionicons name="people-outline" size={26} color={color} />
            ),
        }}
      ></Tab.Screen>

      <Tab.Screen
        name="MoreStack"
        component={MoreStack}
        options={{
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Ionicons name="ellipsis-horizontal" size={26} color={color} />
            ) : (
              <Ionicons
                name="ellipsis-horizontal-outline"
                size={26}
                color={color}
              />
            ),
        }}
      ></Tab.Screen>
    </Tab.Navigator>
  );
}
