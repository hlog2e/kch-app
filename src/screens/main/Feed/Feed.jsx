import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Image } from "expo-image";
import { useState } from "react";
import Carousel, { Pagination } from "react-native-snap-carousel";
import moment from "moment";
import SafeTitleHeader from "../../../components/common/SafeTitleHeader";
import { useInfiniteQuery } from "react-query";
import { getFeeds } from "../../../../apis/feed/feed";
import FullScreenLoader from "../../../components/common/FullScreenLoader";
import ImageView from "react-native-image-viewing";

import Hyperlink from "react-native-hyperlink";

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
  const NowColorState = useColorScheme();
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
    container: {
      backgroundColor: NowColorState === "light" ? "white" : "#2c2c36",
      marginBottom: 10,
    },
    header: {
      paddingVertical: 12,
      paddingHorizontal: 18,
      flexDirection: "row",
      alignItems: "center",
    },
    header_icon: { width: 34, height: 34 },
    header_text: {
      fontSize: 15,
      fontWeight: "700",
      marginLeft: 10,
      color: NowColorState === "light" ? "black" : "white",
    },

    footer: {
      padding: 12,
    },
    footer_title: {
      fontWeight: "700",
      fontSize: 12,
      color: NowColorState === "light" ? "black" : "white",
    },
    footer_desc: {
      fontSize: 12,
      marginTop: 5,
      color: NowColorState === "light" ? "black" : "white",
    },

    image: {
      height: SCREEN_WIDTH,
      width: SCREEN_WIDTH,
      backgroundColor: NowColorState === "light" ? "#f9f9f9" : "#18171c",
    },
    date: { fontSize: 10, color: "gray", marginTop: 10 },
  });
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          placeholder={"L1O|b2-;fQ-;_3fQfQfQfQfQfQfQ"}
          transition={500}
          style={styles.header_icon}
          source={require("../../../../assets/images/kch-icon.png")}
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
                contentFit={"contain"}
                placeholder={"L1O|b2-;fQ-;_3fQfQfQfQfQfQfQ"}
                transition={500}
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
          <Hyperlink linkDefault linkStyle={{ color: "#3b82f6" }}>
            <Text selectable style={styles.footer_desc}>
              {item.desc}
            </Text>
          </Hyperlink>
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
