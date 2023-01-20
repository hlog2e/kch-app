import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";

import { useState } from "react";
import Carousel, { Pagination } from "react-native-snap-carousel";
import moment from "moment";
import SafeTitleHeader from "../../../components/common/SafeTitleHeader";
import { useInfiniteQuery } from "react-query";
import { getFeeds } from "../../../../apis/feed/feed";
import FullScreenLoader from "../../../components/common/FullScreenLoader";
import ImageView from "react-native-image-viewing";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function FeedScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const { data, isLoading, fetchNextPage, refetch, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: "feed",
      queryFn: ({ pageParam = 0 }) => getFeeds(pageParam),
      getNextPageParam: (lastPage, allPages) => {
        if (Number(lastPage.nextCursor) > Number(lastPage.totalCount)) {
          return undefined;
        }
        return lastPage.nextCursor;
      },
    });

  return (
    <View style={{ flex: 1 }}>
      <SafeTitleHeader title="학교 소식" />

      {isLoading ? <FullScreenLoader /> : null}
      {data ? (
        <FlatList
          onEndReachedThreshold={0.8}
          onEndReached={fetchNextPage}
          ListFooterComponent={() => {
            if (isFetchingNextPage) return <FullScreenLoader />;
          }}
          onRefresh={() => {
            setRefreshing(true);
            refetch().then(() => {
              setRefreshing(false);
            });
          }}
          refreshing={refreshing}
          data={data.pages.flatMap((_i) => _i.feeds)}
          renderItem={(_prevState) => <FeedItem item={_prevState.item} />}
          keyExtractor={(item) => item._id}
        />
      ) : null}
    </View>
  );
}

function FeedItem({ item }) {
  const [activeSnapIndex, setActiveSnapIndex] = useState(0);
  const [imageOpen, setImageOpen] = useState(false);
  const [imageUris, setImageUris] = useState([]);

  const handleImageOpen = () => {
    let _temp = [];
    item.images.map((_i) => {
      _temp.push({ uri: _i });
    });
    setImageUris(_temp);
    setImageOpen(true);
  };

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

    image: {
      height: SCREEN_WIDTH,
      width: SCREEN_WIDTH,
      backgroundColor: "#f9f9f9",
    },
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
            <TouchableOpacity onPress={handleImageOpen}>
              <Image
                resizeMode={"contain"}
                style={styles.image}
                source={{ uri: image }}
              />
            </TouchableOpacity>
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
          <Text style={styles.footer_title}>{item.publisher}</Text>
          <Text style={styles.footer_desc}>{item.desc}</Text>
        </View>
        <Text style={styles.date}>
          {moment(item.createdAt).format("M월 D일")}
        </Text>
      </View>

      <ImageView
        visible={imageOpen}
        images={imageUris}
        onRequestClose={() => {
          setImageOpen(false);
        }}
        imageIndex={activeSnapIndex}
      />
    </View>
  );
}
