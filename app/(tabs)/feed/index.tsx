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
import { deleteFeed, getFeeds } from "../../../apis/feed/index";
import FullScreenLoader from "../../../src/components/Overlay/FullScreenLoader";
import ImageView from "react-native-image-viewing";
import { Ionicons } from "@expo/vector-icons";
import Hyperlink from "react-native-hyperlink";
import FABPlus from "../../../src/components/Button/FABPlus";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../../../context/UserContext";
import { useRouter } from "expo-router";

const SCREEN_WIDTH = Dimensions.get("window").width;

// Types
interface FeedItem {
  _id: string;
  publisherPhoto?: string;
  publisherName: string;
  publisherDesc: string;
  publisher: string;
  images?: string[];
  content: string;
  createdAt: string;
}

interface FeedResponse {
  feeds: FeedItem[];
  nextCursor: string;
  totalCount: string;
}

interface User {
  _id: string;
  type: "undergraduate" | "teacher" | string;
}

// Simple Header Component for Feed
function FeedHeaderComponent() {
  const { colors } = useTheme();

  return (
    <View style={feedHeaderStyles.header}>
      <Text style={[feedHeaderStyles.title, { color: colors.text }]}>피드</Text>
    </View>
  );
}

const feedHeaderStyles = StyleSheet.create({
  header: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  title: {
    fontWeight: "700",
    fontSize: 24,
    marginTop: 14,
    marginLeft: 16,
  },
});

export default function FeedScreen() {
  const { user } = useUser() as { user: User | null };
  const router = useRouter();
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
    queryFn: ({ pageParam = 0 }) => getFeeds(pageParam as number),
    getNextPageParam: (lastPage: any) => {
      if (Number(lastPage.nextCursor) > Number(lastPage.totalCount)) {
        return undefined;
      }
      return lastPage.nextCursor;
    },
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleEndReached = () => {
    fetchNextPage();
  };

  const canCreateFeed =
    user?.type === "undergraduate" || user?.type === "teacher";

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      {isLoading && <FullScreenLoader />}

      {isSuccess && canCreateFeed && (
        <FABPlus onPress={() => router.push("/feed/post")} />
      )}

      {data && (
        <FlatList
          onEndReachedThreshold={0.8}
          onEndReached={handleEndReached}
          ListHeaderComponent={<FeedHeaderComponent />}
          ListFooterComponent={() => {
            if (isFetchingNextPage) return <FullScreenLoader />;
            return null;
          }}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          data={data.pages.flatMap((page: any) => page.feeds)}
          renderItem={({ item }) => <FeedItemComponent item={item} />}
          keyExtractor={(item) => item._id}
        />
      )}
    </SafeAreaView>
  );
}

function FeedItemComponent({ item }: { item: FeedItem }) {
  const { user } = useUser() as { user: User | null };
  const [activeSnapIndex, setActiveSnapIndex] = useState(0);
  const [imageOpen, setImageOpen] = useState(false);
  const [imageUris, setImageUris] = useState<{ uri: string }[]>([]);

  const { mutate: deleteFeedMutate } = useMutation(deleteFeed);
  const queryClient = useQueryClient();

  const handleImageOpen = () => {
    if (!item.images) return;

    const uris = item.images.map((image: string) => ({ uri: image }));
    setImageUris(uris);
    setImageOpen(true);
  };

  const handleDeleteFeed = () => {
    Alert.alert("알림", "정말로 게시물을 삭제하시겠습니까?", [
      { text: "아니요", style: "cancel" },
      {
        text: "예",
        style: "destructive",
        onPress: async () => {
          await deleteFeedMutate(
            { feedId: item._id },
            {
              onSuccess: () => {
                queryClient.invalidateQueries("Feed");
              },
            }
          );
        },
      },
    ]);
  };

  const isMyFeed = item.publisher === user?._id;

  return (
    <View style={styles.container}>
      <FeedItemHeader item={item} />

      {item.images && (
        <FeedImageCarousel
          images={item.images}
          activeIndex={activeSnapIndex}
          onSnapToItem={setActiveSnapIndex}
          onImagePress={handleImageOpen}
        />
      )}

      <FeedContent content={item.content} createdAt={item.createdAt} />

      {isMyFeed && <FeedDeleteButton onPress={handleDeleteFeed} />}

      <ImageView
        visible={imageOpen}
        images={imageUris}
        onRequestClose={() => setImageOpen(false)}
        imageIndex={activeSnapIndex}
      />
    </View>
  );
}

function FeedItemHeader({ item }: { item: FeedItem }) {
  const { colors } = useTheme();

  return (
    <View style={styles.header}>
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
        <Text style={[styles.publisherText, { color: colors.text }]}>
          {item.publisherName}
        </Text>
        <Text style={[styles.publisherDesc, { color: colors.subText }]}>
          {item.publisherDesc}
        </Text>
      </View>
    </View>
  );
}

function FeedImageCarousel({
  images,
  activeIndex,
  onSnapToItem,
  onImagePress,
}: {
  images: string[];
  activeIndex: number;
  onSnapToItem: (index: number) => void;
  onImagePress: () => void;
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.carouselWrap}>
      <Carousel
        vertical={false}
        data={images}
        onSnapToItem={onSnapToItem}
        renderItem={({ item: image }: { item: string }) => (
          <TouchableOpacity onPress={onImagePress}>
            <Image
              contentFit={"cover"}
              placeholder={"L1O|b2-;fQ-;_3fQfQfQfQfQfQfQ"}
              transition={500}
              style={styles.image}
              source={{ uri: image }}
            />
          </TouchableOpacity>
        )}
        itemWidth={SCREEN_WIDTH}
        sliderWidth={SCREEN_WIDTH}
      />

      <Pagination
        inactiveDotScale={1}
        inactiveDotColor={colors.subText}
        containerStyle={styles.paginationContainer}
        dotColor={colors.text}
        activeDotIndex={activeIndex}
        dotsLength={images.length}
      />
    </View>
  );
}

function FeedContent({
  content,
  createdAt,
}: {
  content: string;
  createdAt: string;
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.content}>
      <Hyperlink linkDefault linkStyle={{ color: "#3b82f6" }}>
        <Text selectable style={[styles.contentText, { color: colors.text }]}>
          {content}
        </Text>
      </Hyperlink>

      <Text style={[styles.date, { color: colors.subText }]}>
        {moment(createdAt).format("M월 D일")}
      </Text>
    </View>
  );
}

function FeedDeleteButton({ onPress }: { onPress: () => void }) {
  const { colors } = useTheme();

  return (
    <View style={styles.deleteButtonWrap}>
      <TouchableOpacity onPress={onPress} style={styles.deleteButton}>
        <Text style={[styles.deleteButtonText, { color: colors.red }]}>
          삭제하기
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles moved to the bottom and organized
const styles = StyleSheet.create({
  // Container styles
  container: {
    marginTop: 14,
    paddingBottom: 16,
  },

  // Header styles
  header: {
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  publisherPhoto: {
    width: 45,
    height: 45,
    borderRadius: 50,
  },
  publisherWrap: {
    marginLeft: 8,
  },
  publisherText: {
    fontSize: 15,
    fontWeight: "700",
  },
  publisherDesc: {
    fontSize: 12,
    marginTop: 2,
  },

  // Content styles
  content: {
    paddingHorizontal: 12,
    marginTop: 10,
  },
  contentText: {
    fontSize: 14,
    fontWeight: "200",
    lineHeight: 18,
  },
  date: {
    fontSize: 12,
    marginTop: 8,
  },

  // Image carousel styles
  carouselWrap: {},
  image: {
    aspectRatio: 1,
    width: "100%",
  },
  paginationContainer: {
    paddingVertical: 0,
    marginTop: 10,
  },

  // Delete button styles
  deleteButtonWrap: {
    flexDirection: "row",
    padding: 12,
  },
  deleteButton: {},
  deleteButtonText: {
    fontSize: 12,
    fontWeight: "300",
  },
});
