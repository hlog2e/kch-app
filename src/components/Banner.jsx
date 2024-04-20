import {
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  View,
  Text,
} from "react-native";
import { Image } from "expo-image";
import { useQuery } from "react-query";
import { getBanners } from "../../apis/common/banner";
import Carousel from "react-native-snap-carousel";
import * as Linking from "expo-linking";
import { useState } from "react";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function Banner({ location, height, padding, parentPadding }) {
  const { data } = useQuery("banner", () => getBanners({ location }), {
    onSuccess: (_data) => {
      setDataLength(_data.length);
    },
  });
  const [dataLength, setDataLength] = useState(0);
  const [nowIndex, setNowIndex] = useState(0);

  return (
    <View
      style={{
        paddingVertical: 14,
        paddingHorizontal: padding ? padding : 0,
      }}
    >
      <Carousel
        data={data}
        renderItem={({ item }) => {
          return (
            <Item
              item={item}
              height={height}
              dataLength={dataLength}
              nowIndex={nowIndex}
            />
          );
        }}
        itemWidth={SCREEN_WIDTH - (parentPadding || padding * 2)}
        sliderWidth={SCREEN_WIDTH - (parentPadding || padding * 2)}
        autoplay
        autoplayDelay={0}
        autoplayInterval={6000}
        onSnapToItem={(_index) => {
          setNowIndex(_index);
        }}
      />
    </View>
  );
}

const Item = ({ item, height, dataLength, nowIndex }) => {
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
  return (
    <TouchableOpacity
      onPress={() => {
        if (item.link) {
          Linking.openURL(item.link);
        }
      }}
    >
      <Image
        contentFit={"cover"}
        transition={500}
        style={styles.image}
        source={{
          uri: item.uri,
        }}
      />
      <View style={styles.pagination}>
        <Text style={styles.pagination_text}>
          {nowIndex + 1 + "/" + dataLength}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
