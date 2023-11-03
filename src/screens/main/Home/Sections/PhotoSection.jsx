import { Image } from "expo-image";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useInfiniteQuery } from "react-query";
import { getPhotos } from "../../../../../apis/home/photo";

export default function PhotoSection({ navigation }) {
  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: "SchoolPhoto",
    queryFn: ({ pageParam = 0 }) => getPhotos({ skip: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      if (Number(lastPage.nextCursor) > Number(lastPage.totalCount)) {
        return false;
      }
      return lastPage.nextCursor;
    },
  });

  if (data) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>활동사진</Text>
        <FlatList
          horizontal
          style={styles.scroll}
          onEndReachedThreshold={0.8}
          onEndReached={fetchNextPage}
          data={data.pages.flatMap((item) => item.items)}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => navigation.push("PhotoDetailScreen", item)}
                style={styles.imageWrap}
                key={item._id}
              >
                <Image
                  transition={500}
                  placeholder={"L1O|b2-;fQ-;_3fQfQfQfQfQfQfQ"}
                  source={item.photos[0]}
                  style={styles.image}
                />
                <Text style={styles.imageTitle}>{item.title}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 14,
  },
  scroll: { marginTop: 14 },
  imageWrap: {
    maxWidth: 150,
    marginLeft: 14,
  },
  image: { width: 150, height: 150, borderRadius: 20 },
  imageTitle: { marginTop: 6, fontSize: 12, fontWeight: "600", color: "gray" },
});
