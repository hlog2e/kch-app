import React from "react";
import { StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface FABPlusProps {
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(
  require("react-native").Pressable
);

export default function FABPlus({ onPress }: FABPlusProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  return (
    <AnimatedPressable
      style={[styles.button, { backgroundColor: colors.blue ?? colors.primary }, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Feather name="plus" size={28} color="white" />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    zIndex: 100,
    position: "absolute",
    bottom: 20,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Android elevation
    elevation: 8,
  },
});
