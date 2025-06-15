import React from "react";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

export default function TabLayout() {
  const { colors } = useTheme();
  const { bottom: bottomInsets } = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: bottomInsets + 50,
          backgroundColor: "white",
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        headerShown: false,
        sceneStyle: { backgroundColor: "white" },
      }}
      screenListeners={{
        tabPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          tabBarIcon: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) =>
            focused ? (
              <Ionicons name="home" size={26} color={color} />
            ) : (
              <Ionicons name="home-outline" size={26} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="feed/index"
        options={{
          tabBarIcon: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) =>
            focused ? (
              <Ionicons name="albums" size={26} color={color} />
            ) : (
              <Ionicons name="albums-outline" size={26} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="community/index"
        options={{
          tabBarIcon: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) =>
            focused ? (
              <Ionicons name="people" size={26} color={color} />
            ) : (
              <Ionicons name="people-outline" size={26} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="more/index"
        options={{
          tabBarIcon: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) =>
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
      />
    </Tabs>
  );
}
