import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Image } from "expo-image";
import { useState } from "react";
import Carousel, { Pagination } from "react-native-snap-carousel";
import moment from "moment";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import { deleteFeed, getFeeds } from "../../../../apis/feed/index";
import FullScreenLoader from "../../../components/Overlay/FullScreenLoader";
import ImageView from "react-native-image-viewing";
import { Ionicons } from "@expo/vector-icons";
import Hyperlink from "react-native-hyperlink";
import FABPlus from "../../../components/Button/FABPlus";
import Header from "../../../components/Header/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../../../../context/UserContext";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function FeedScreen({ navigation }) {
  const { user } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const {
    data,
    isLoading,
    isSuccess,
    fetchNextPage,
    refetch,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: "Feed",
    queryFn: ({ pageParam = 0 }) => getFeeds(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (Number(lastPage.nextCursor) > Number(lastPage.totalCount)) {
        return undefined;
      }
      return lastPage.nextCursor;
    },
  });

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <Header title="피드" />

      {isLoading && <FullScreenLoader />}

      {isSuccess &&
        (user.type === "undergraduate" || user.type === "teacher" ? (
          <FABPlus onPress={() => navigation.push("FeedPOSTScreen")} />
        ) : null)}

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
    </SafeAreaView>
  );
}

function FeedItem({ item }) {
  const { user } = useUser();
  const { colors } = useTheme();
  const [activeSnapIndex, setActiveSnapIndex] = useState(0);
  const [imageOpen, setImageOpen] = useState(false);
  const [imageUris, setImageUris] = useState([]);

  const { mutate: deleteCommentMutate } = useMutation(deleteFeed);
  const queryClient = useQueryClient();

  const handleImageOpen = () => {
    let _temp = [];
    item.images.map((_i) => {
      _temp.push({ uri: _i });
    });
    setImageUris(_temp);
    setImageOpen(true);
  };

  const handleDeleteComment = () => {
    Alert.alert("알림", "정말로 게시물을 삭제하시겠습니까?", [
      { text: "아니요", style: "cancel" },
      { text: "예", style: "destructive", onPress: () => deleteComment() },
    ]);

    const deleteComment = async () => {
      await deleteCommentMutate(
        { feedId: item._id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries("Feed");
          },
        }
      );
    };
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,

      marginHorizontal: 15,
      marginTop: 10,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 15,
      padding: 10,
    },
    header: {
      padding: 3,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    publisherPhoto: { width: 45, height: 45, borderRadius: 50 },

    headerLeftWrap: {
      flexDirection: "row",
      alignItems: "center",
    },

    publisherWrap: { marginLeft: 8 },
    publisherText: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.text,
    },
    publisherDesc: {
      fontSize: 12,
      marginTop: 2,
      color: colors.subText,
    },

    date: { fontSize: 12, color: colors.subText },

    deleteButtonWrap: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 4,
    },
    deleteButton: {},
    deleteButtonText: { fontSize: 12, fontWeight: "300", color: colors.red },

    contentText: {
      marginTop: 10,
      fontSize: 14,
      fontWeight: "200",
      color: colors.text,
      lineHeight: 18,
    },

    carouselWrap: { marginTop: 15 },
    image: {
      aspectRatio: 1,
      width: "100%",
      borderRadius: 20,
      backgroundColor: colors.cardBg2,
    },
  });
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeftWrap}>
          {item.publisherPhoto ? (
            <Image
              placeholder={"L1O|b2-;fQ-;_3fQfQfQfQfQfQfQ"}
              contentFit={"contain"}
              transition={500}
              style={styles.publisherPhoto}
              source={{ uri: item.publisherPhoto }}
            />
          ) : (
            <Ionicons name="person-circle" size={45} color={"#d9d9d9"} />
          )}

          <View style={styles.publisherWrap}>
            <Text style={styles.publisherText}>{item.publisherName}</Text>
            <Text style={styles.publisherDesc}>{item.publisherDesc}</Text>
          </View>
        </View>

        <Text style={styles.date}>
          {moment(item.createdAt).format("M월 D일")}
        </Text>
      </View>
      <View style={styles.content}>
        <View>
          <Hyperlink linkDefault linkStyle={{ color: "#3b82f6" }}>
            <Text selectable style={styles.contentText}>
              {item.content}
            </Text>
          </Hyperlink>
        </View>
      </View>

      {item.images && (
        <View style={styles.carouselWrap}>
          <Carousel
            data={item.images}
            onSnapToItem={(_index) => setActiveSnapIndex(_index)}
            renderItem={({ item: image }) => {
              return (
                <TouchableOpacity onPress={handleImageOpen}>
                  <Image
                    contentFit={"cover"}
                    placeholder={"L1O|b2-;fQ-;_3fQfQfQfQfQfQfQ"}
                    transition={500}
                    style={styles.image}
                    source={{ uri: image }}
                  />
                </TouchableOpacity>
              );
            }}
            itemWidth={SCREEN_WIDTH - 60}
            sliderWidth={SCREEN_WIDTH - 50}
          />

          <Pagination
            inactiveDotScale={1}
            inactiveDotColor={colors.subText}
            containerStyle={{
              paddingVertical: 0,
              marginTop: 10,
            }}
            dotColor={colors.text}
            activeDotIndex={activeSnapIndex}
            dotsLength={item.images.length}
          />

          {item.publisher === user._id && (
            <View style={styles.deleteButtonWrap}>
              <TouchableOpacity
                onPress={handleDeleteComment}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>삭제하기</Text>
              </TouchableOpacity>
            </View>
          )}

          <ImageView
            visible={imageOpen}
            images={imageUris}
            onRequestClose={() => {
              setImageOpen(false);
            }}
            imageIndex={activeSnapIndex}
          />
        </View>
      )}
    </View>
  );
}
