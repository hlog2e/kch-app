import React, { useRef, useEffect } from "react";
import { Animated, StyleSheet, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";

// CollapsibleHeader constants
export const DEFAULT_HEADER_HEIGHT = 50;
export const DEFAULT_SCROLL_RANGE = 40;
export const SCROLL_THRESHOLD = 10;
export const ANIMATION_DURATION = 200;

interface CollapsibleHeaderProps {
  title: string;
  headerHeight?: number;
  headerTranslateY: Animated.Value;
  children?: React.ReactNode;
}

interface UseCollapsibleHeaderProps {
  headerHeight?: number;
  scrollRange?: number;
  disabled?: boolean;
}

// Hook for handling collapsible header logic
export const useCollapsibleHeader = ({
  headerHeight = DEFAULT_HEADER_HEIGHT,
  scrollRange = DEFAULT_SCROLL_RANGE,
  disabled = false,
}: UseCollapsibleHeaderProps = {}) => {
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const isHeaderVisible = useRef(true);
  const insets = useSafeAreaInsets();
  const safeAreaTop = insets.top;

  // disabled 상태일 때는 헤더 표시
  useEffect(() => {
    if (disabled && !isHeaderVisible.current) {
      Animated.timing(headerTranslateY, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start();
      isHeaderVisible.current = true;
    }
  }, [disabled]);

  const handleScroll = (event: any) => {
    const rawScrollY = event.nativeEvent.contentOffset.y;
    const currentScrollY = Math.max(rawScrollY, 0);
    const diff = currentScrollY - lastScrollY.current;
    const maxTranslate = -(headerHeight + safeAreaTop);

    if (currentScrollY <= scrollRange) {
      // continuous range-based animation
      const ratio = Math.min(currentScrollY / scrollRange, 1);
      headerTranslateY.setValue(maxTranslate * ratio);
      if (ratio === 1) {
        isHeaderVisible.current = false;
      }
    } else {
      // direction-based hide/show
      if (diff > SCROLL_THRESHOLD && isHeaderVisible.current) {
        Animated.timing(headerTranslateY, {
          toValue: maxTranslate,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }).start();
        isHeaderVisible.current = false;
      } else if (diff < -SCROLL_THRESHOLD && !isHeaderVisible.current) {
        Animated.timing(headerTranslateY, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }).start();
        isHeaderVisible.current = true;
      }
    }
    lastScrollY.current = currentScrollY;
  };

  const scrollProps = {
    onScroll: handleScroll,
    scrollEventThrottle: 16,
  };

  return {
    headerTranslateY,
    scrollProps,
  };
};

export default function CollapsibleHeader({
  title,
  headerHeight = DEFAULT_HEADER_HEIGHT,
  headerTranslateY,
  children,
}: CollapsibleHeaderProps) {
  const insets = useSafeAreaInsets();
  const safeAreaTop = insets.top;
  const { colors } = useTheme();

  const headerStyles = [
    styles.header,
    {
      height: headerHeight + safeAreaTop,
      paddingTop: safeAreaTop,
      backgroundColor: colors.background || "#ffffff",
      transform: [{ translateY: headerTranslateY }],
    },
  ];

  return (
    <Animated.View style={headerStyles}>
      <View style={styles.headerContent}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    zIndex: 1000,
  },
  headerContent: {
    paddingHorizontal: 16,
    paddingVertical: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
  },
});
