import React from "react";
import { Text, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolateColor,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

interface AnimatedToggleProps {
  options: [string, string];
  selectedIndex: 0 | 1;
  onToggle: (index: 0 | 1) => void;
}

const SPRING_CONFIG = { damping: 20, stiffness: 180, mass: 0.6 };
const TRACK_HEIGHT = 48;
const TRACK_PADDING = 6;
const INDICATOR_HEIGHT = TRACK_HEIGHT - TRACK_PADDING * 2;

export default function AnimatedToggle({
  options,
  selectedIndex,
  onToggle,
}: AnimatedToggleProps) {
  const { colors } = useTheme();
  const trackWidth = useSharedValue(0);
  const progress = useSharedValue(selectedIndex);
  const startX = useSharedValue(0);
  const isDragging = useSharedValue(false);

  React.useEffect(() => {
    if (!isDragging.value) {
      progress.value = withSpring(selectedIndex, SPRING_CONFIG);
    }
  }, [selectedIndex]);

  const chipWidth = () => {
    "worklet";
    return (trackWidth.value - TRACK_PADDING * 2) / 2;
  };

  const clampProgress = (val: number) => {
    "worklet";
    return Math.max(0, Math.min(1, val));
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onStart(() => {
      isDragging.value = true;
      startX.value = progress.value;
    })
    .onUpdate((e) => {
      const cw = chipWidth();
      if (cw <= 0) return;
      const dragProgress = e.translationX / cw;
      progress.value = clampProgress(startX.value + dragProgress);
    })
    .onEnd((e) => {
      isDragging.value = false;
      const targetIndex = progress.value >= 0.5 ? 1 : 0;
      progress.value = withSpring(targetIndex, SPRING_CONFIG);
      if (targetIndex !== selectedIndex) {
        runOnJS(onToggle)(targetIndex as 0 | 1);
      }
    });

  const tapLeft = Gesture.Tap().onEnd(() => {
    if (selectedIndex !== 0) {
      runOnJS(onToggle)(0);
    }
  });

  const tapRight = Gesture.Tap().onEnd(() => {
    if (selectedIndex !== 1) {
      runOnJS(onToggle)(1);
    }
  });

  const indicatorStyle = useAnimatedStyle(() => {
    const cw = chipWidth();
    if (trackWidth.value <= 0) return { width: 0, opacity: 0 };
    return {
      width: cw,
      opacity: 1,
      transform: [{ translateX: TRACK_PADDING + progress.value * cw }],
    };
  });

  const leftTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 0.5, 1],
      ["#ffffff", colors.subText, colors.subText]
    ),
  }));

  const rightTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 0.5, 1],
      [colors.subText, colors.subText, "#ffffff"]
    ),
  }));

  const styles = StyleSheet.create({
    root: {
      borderRadius: TRACK_HEIGHT / 2,
      overflow: "hidden",
    },
    track: {
      flexDirection: "row",
      backgroundColor: colors.cardBg2,
      borderRadius: TRACK_HEIGHT / 2,
      height: TRACK_HEIGHT,
      alignItems: "center",
    },
    indicator: {
      position: "absolute",
      top: TRACK_PADDING,
      left: 0,
      height: INDICATOR_HEIGHT,
      backgroundColor: colors.accentBlueSoft,
      borderRadius: INDICATOR_HEIGHT / 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.10,
      shadowRadius: 4,
      elevation: 4,
    },
    option: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      height: TRACK_HEIGHT,
      zIndex: 1,
    },
    optionText: {
      fontSize: 15,
      fontFamily: "Pretendard-ExtraBold",
      fontWeight: "800",
    },
  });

  return (
    <GestureHandlerRootView style={styles.root}>
      <GestureDetector gesture={pan}>
        <Animated.View
          style={styles.track}
          onLayout={(e) => {
            trackWidth.value = e.nativeEvent.layout.width;
          }}
        >
          <Animated.View style={[styles.indicator, indicatorStyle]} />

          <GestureDetector gesture={tapLeft}>
            <Animated.View style={styles.option}>
              <Animated.Text style={[styles.optionText, leftTextStyle]}>
                {options[0]}
              </Animated.Text>
            </Animated.View>
          </GestureDetector>

          <GestureDetector gesture={tapRight}>
            <Animated.View style={styles.option}>
              <Animated.Text style={[styles.optionText, rightTextStyle]}>
                {options[1]}
              </Animated.Text>
            </Animated.View>
          </GestureDetector>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}
