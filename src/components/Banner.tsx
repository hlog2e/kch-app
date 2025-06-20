import React, { useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Dimensions,
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
import { useQuery } from "react-query";
import { getBanners } from "../../apis/banner/index";
import Carousel from "react-native-snap-carousel";
import * as Linking from "expo-linking";
import { useState } from "react";

const SCREEN_WIDTH = Dimensions.get("window").width;

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
      withSpring(1, { damping: 15, stiffness: 120 })
    );
    opacity.value = withDelay(
      400,
      withSpring(1, { damping: 15, stiffness: 120 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const { data = [] } = useQuery<BannerItem[]>(
    ["banner", location],
    () => getBanners({ location }),
    {
      onSuccess: (_data) => {
        setDataLength(_data.length);
      },
    }
  );

  const [dataLength, setDataLength] = useState<number>(0);
  const [nowIndex, setNowIndex] = useState<number>(0);

  return (
    <Animated.View
      style={[
        {
          marginTop: 4,
          paddingVertical: 14,
          paddingHorizontal: padding ?? 0,
        },
        animatedStyle,
      ]}
    >
      <Carousel<BannerItem>
        data={data}
        renderItem={({ item }) => (
          <Item
            item={item}
            height={height}
            dataLength={dataLength}
            nowIndex={nowIndex}
          />
        )}
        itemWidth={SCREEN_WIDTH - (parentPadding ?? padding * 2)}
        sliderWidth={SCREEN_WIDTH - (parentPadding ?? padding * 2)}
        autoplay
        autoplayDelay={0}
        autoplayInterval={6000}
        onSnapToItem={setNowIndex}
        vertical={false}
      />
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
  const styles = StyleSheet.create({
    image: { width: "100%", height: height, borderRadius: 15 },
    pagination: {
      position: "absolute",
      bottom: 8,
      right: 10,
      backgroundColor: "white",
      paddingVertical: 1,
      paddingHorizontal: 5,
      borderRadius: 15,
    },
    pagination_text: {
      fontSize: 10,
      color: "gray",
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
