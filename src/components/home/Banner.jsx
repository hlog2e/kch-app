import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  View,
  Text,
} from "react-native";
import { useQuery } from "react-query";
import { getBanners } from "../../../apis/banner";
import Carousel from "react-native-snap-carousel";
import * as WebBrowser from "expo-web-browser";
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
      paddingVertical: 10,
      paddingHorizontal: 25,
    },
    image: { height: 75, borderRadius: 8, backgroundColor: "#e9e9e9" },
    pagination: {
      position: "absolute",
      bottom: 17,
      right: 35,
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
          WebBrowser.openBrowserAsync(item.link);
        }
      }}
    >
      <Image
        resizeMode={"contain"}
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
