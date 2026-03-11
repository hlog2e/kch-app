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

interface SegmentedControlProps {
  options: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const SPRING_CONFIG = { damping: 20, stiffness: 180, mass: 0.6 };
const TRACK_HEIGHT = 48;
const TRACK_PADDING = 6;
const INDICATOR_HEIGHT = TRACK_HEIGHT - TRACK_PADDING * 2;

export default function SegmentedControl({
  options,
  selectedIndex,
  onSelect,
}: SegmentedControlProps) {
  const { colors } = useTheme();
  const count = options.length;
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
    return (trackWidth.value - TRACK_PADDING * 2) / count;
  };

  const clampProgress = (val: number) => {
    "worklet";
    return Math.max(0, Math.min(count - 1, val));
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
    .onEnd(() => {
      isDragging.value = false;
      const targetIndex = Math.round(progress.value);
      progress.value = withSpring(targetIndex, SPRING_CONFIG);
      if (targetIndex !== selectedIndex) {
        runOnJS(onSelect)(targetIndex);
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

  const makeTextStyle = (index: number) =>
    useAnimatedStyle(() => {
      const distance = Math.abs(progress.value - index);
      return {
        color: interpolateColor(
          Math.min(distance, 1),
          [0, 0.5, 1],
          ["#ffffff", (colors as any).subText, (colors as any).subText]
        ),
      };
    });

  const makeTapGesture = (index: number) =>
    Gesture.Tap().onEnd(() => {
      if (selectedIndex !== index) {
        runOnJS(onSelect)(index);
      }
    });

  const styles = StyleSheet.create({
    root: {
      borderRadius: TRACK_HEIGHT / 2,
      overflow: "hidden",
    },
    track: {
      flexDirection: "row",
      backgroundColor: (colors as any).cardBg2,
      borderRadius: TRACK_HEIGHT / 2,
      height: TRACK_HEIGHT,
      alignItems: "center",
    },
    indicator: {
      position: "absolute",
      top: TRACK_PADDING,
      left: 0,
      height: INDICATOR_HEIGHT,
      backgroundColor: "#60A5FA",
      borderRadius: INDICATOR_HEIGHT / 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
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
          {options.map((option, index) => (
            <GestureDetector key={option} gesture={makeTapGesture(index)}>
              <Animated.View style={styles.option}>
                <Animated.Text
                  style={[styles.optionText, makeTextStyle(index)]}
                >
                  {option}
                </Animated.Text>
              </Animated.View>
            </GestureDetector>
          ))}
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}
