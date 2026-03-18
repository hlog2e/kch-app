import React, { useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { useQuery } from "@tanstack/react-query";
import { getBanners } from "../../apis/banner/index";
import ReanimatedCarousel from "react-native-reanimated-carousel";
import { useTheme } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { useState } from "react";
import { useResponsiveScale } from "../hooks/useResponsiveScale";

export interface BannerItem {
  uri: string;
  link?: string;
}

interface BannerProps {
  location: string;
  height: number;
  padding?: number;
  parentPadding?: number;
}

export default function Banner({
  location,
  height,
  padding = 0,
  parentPadding,
}: BannerProps) {
  // 애니메이션 설정
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // 400ms 지연 후 스케일과 페이드인
    scale.value = withDelay(
      400,
      withSpring(1, { damping: 15, stiffness: 120 }),
    );
    opacity.value = withDelay(
      400,
      withSpring(1, { damping: 15, stiffness: 120 }),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const { data = [] } = useQuery<BannerItem[]>({
    queryKey: ["banner", location],
    queryFn: () => getBanners({ location }),
  });
  const [nowIndex, setNowIndex] = useState<number>(0);
  const [layoutWidth, setLayoutWidth] = useState(0);

  const carouselWidth = layoutWidth - (parentPadding ?? padding * 2);

  return (
    <Animated.View
      onLayout={(e) => setLayoutWidth(e.nativeEvent.layout.width)}
      style={[
        {
          paddingVertical: 14,
          paddingHorizontal: padding ?? 0,
        },
        animatedStyle,
      ]}
    >
      {data.length > 0 && layoutWidth > 0 && (
        <ReanimatedCarousel
          data={data}
          width={carouselWidth}
          height={height}
          autoPlay
          autoPlayInterval={6000}
          loop
          onSnapToItem={setNowIndex}
          renderItem={({ item }: { item: BannerItem }) => (
            <Item
              item={item}
              height={height}
              dataLength={data.length}
              nowIndex={nowIndex}
            />
          )}
        />
      )}
    </Animated.View>
  );
}

interface ItemProps {
  item: BannerItem;
  height: number;
  dataLength: number;
  nowIndex: number;
}

const Item = ({ item, height, dataLength, nowIndex }: ItemProps) => {
  const { colors } = useTheme();
  const { s } = useResponsiveScale();
  const styles = StyleSheet.create({
    image: { width: "100%", height: height, borderRadius: s(15) },
    pagination: {
      position: "absolute",
      bottom: 8,
      right: 10,
      backgroundColor: colors.cardBg,
      paddingVertical: 1,
      paddingHorizontal: 5,
      borderRadius: s(15),
    },
    pagination_text: {
      fontSize: 10,
      color: colors.subText,
    },
  });

  const handlePress = () => {
    if (item.link) {
      Linking.openURL(item.link);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Image
        contentFit="cover"
        transition={500}
        style={styles.image}
        source={{ uri: item.uri }}
      />
      <View style={styles.pagination}>
        <Text style={styles.pagination_text}>{`${
          nowIndex + 1
        }/${dataLength}`}</Text>
      </View>
    </TouchableOpacity>
  );
};
