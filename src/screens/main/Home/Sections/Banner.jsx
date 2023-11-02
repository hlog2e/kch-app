import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  View,
  Text,
} from "react-native";
import { useQuery } from "react-query";
import { getBanners } from "../../../../../apis/home/banner";
import Carousel from "react-native-snap-carousel";
import * as Linking from "expo-linking";
import { useState } from "react";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function Banner() {
  const { data, isLoading } = useQuery("banner", getBanners, {
    onSuccess: (_data) => {
      setDataLength(_data.length);
    },
  });
  const [dataLength, setDataLength] = useState(0);
  const [nowIndex, setNowIndex] = useState(0);

  return (
    <>
      <Carousel
        data={data}
        renderItem={({ item }) => {
          return (
            <Item item={item} dataLength={dataLength} nowIndex={nowIndex} />
          );
        }}
        itemWidth={SCREEN_WIDTH}
        sliderWidth={SCREEN_WIDTH}
        autoplay
        autoplayDelay={0}
        autoplayInterval={6000}
        onSnapToItem={(_index) => {
          setNowIndex(_index);
        }}
      />
    </>
  );
}

const Item = ({ item, dataLength, nowIndex }) => {
  const styles = StyleSheet.create({
    container: {
      marginTop: 16,
      paddingVertical: 6,
      paddingHorizontal: 14,
    },
    image: { height: 150, borderRadius: 15 },
    pagination: {
      position: "absolute",
      bottom: 12,
      right: 22,
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
      style={styles.container}
      onPress={() => {
        if (item.link) {
          Linking.openURL(item.link);
        }
      }}
    >
      <Image
        resizeMode={"cover"}
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
