import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
} from "react-native";

import { useState } from "react";
import ImageModal from "react-native-image-modal";
import Carousel, { Pagination } from "react-native-snap-carousel";
import moment from "moment";
import SafeTitleHeader from "../../../components/common/SafeTitleHeader";
import { useQuery } from "react-query";
import { getFeeds } from "../../../../apis/home/feed";
import FullScreenLoader from "../../../components/common/FullScreenLoader";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function FeedScreen({ navigation }) {
  const { data, isLoading } = useQuery("feed", getFeeds, {});

  return (
    <View style={{ flex: 1 }}>
      <SafeTitleHeader title="학교 소식" />
      {isLoading ? <FullScreenLoader /> : null}
      {data ? (
        <FlatList
          data={data.feeds}
          renderItem={(_prevState) => <FeedItem item={_prevState.item} />}
          keyExtractor={(item) => item._id}
        />
      ) : null}
    </View>
  );
}

function FeedItem({ item }) {
  const [activeSnapIndex, setActiveSnapIndex] = useState(0);
  const styles = StyleSheet.create({
    container: { backgroundColor: "white", marginBottom: 10 },
    header: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      flexDirection: "row",
      alignItems: "center",
    },
    header_icon: { width: 40, height: 40 },
    header_text: { fontSize: 15, fontWeight: "700", marginLeft: 6 },

    footer: {
      padding: 12,
    },
    footer_title: { fontWeight: "700", fontSize: 12 },
    footer_desc: { fontSize: 12, marginTop: 5 },

    date: { fontSize: 10, color: "gray", marginTop: 10 },
  });
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.header_icon}
          source={require("../../../../assets/adaptive-icon.png")}
        />
        <Text style={styles.header_text}>{item.publisher}</Text>
      </View>
      <Carousel
        data={item.images}
        onSnapToItem={(_index) => setActiveSnapIndex(_index)}
        renderItem={({ item: image }) => {
          return (
            <ImageModal
              resizeMode="contain"
              imageBackgroundColor="#FFFFFF"
              style={{
                width: SCREEN_WIDTH,
                height: SCREEN_WIDTH,
              }}
              source={{ uri: image }}
            />
          );
        }}
        itemWidth={SCREEN_WIDTH}
        sliderWidth={SCREEN_WIDTH}
      />
      <Pagination
        inactiveDotScale={1}
        inactiveDotColor={"#d4d4d4"}
        containerStyle={{
          paddingVertical: 0,
          top: -25,
        }}
        dotColor={"gray"}
        activeDotIndex={activeSnapIndex}
        dotsLength={item.images.length}
      />
      <View style={styles.footer}>
        <View>
          <Text style={styles.footer_title}>금천고등학교 학생회</Text>
          <Text style={styles.footer_desc}>{item.desc}</Text>
        </View>
        <Text style={styles.date}>
          {moment.unix(item.createAt).format("M월 D일")}
        </Text>
      </View>
    </View>
  );
}
