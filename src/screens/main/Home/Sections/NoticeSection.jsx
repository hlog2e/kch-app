import { useTheme } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useInfiniteQuery } from "react-query";
import { getNotices } from "../../../../../apis/home/notice";
import moment from "moment";

export default function NoticeSection({ navigation }) {
  const { colors } = useTheme();

  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: "Notice",
    queryFn: ({ pageParam = 0 }) => getNotices({ skip: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      if (Number(lastPage.nextCursor) > Number(lastPage.totalCount)) {
        return false;
      }
      return lastPage.nextCursor;
    },
  });

  const styles = StyleSheet.create({
    container: {
      marginVertical: 24,
      paddingHorizontal: 14,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    flatList: {
      maxHeight: 400,
      marginTop: 14,
      //   borderWidth: 1,
      //   borderColor: colors.border,
      //   borderRadius: 15,
      //   paddingHorizontal: 14,
      paddingTop: 4,
    },
  });
  if (data) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>홈페이지 공지사항</Text>

        <FlatList
          horizontal
          style={styles.flatList}
          onEndReached={fetchNextPage}
          data={data.pages.flatMap((item) => item.notices)}
          renderItem={({ item }) => (
            <Item
              navigation={navigation}
              key={item._id}
              _id={item._id}
              title={item.title}
              teacher={item.teacher}
              createdAt={item.createdAt}
            />
          )}
        />
      </View>
    );
  }
}

function Item({ navigation, _id, title, teacher, createdAt }) {
  const { colors } = useTheme();
  const SCREEN_WIDTH = Dimensions.get("window").width;
  const styles = StyleSheet.create({
    item: {
      padding: 14,
      height: 130,
      width: 250,
      marginRight: 10,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 15,

      justifyContent: "space-between",
    },
    itemTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.text,
      maxWidth: SCREEN_WIDTH - 140,
    },
    itemTeacher: {
      fontSize: 12,
      fontWeight: "300",
      color: colors.subText,
      marginTop: 3,
    },
    itemCreatedAt: { fontSize: 12, fontWeight: "300", color: colors.subText },
  });
  return (
    <TouchableOpacity
      onPress={() => navigation.push("NoticeDetailScreen", { noticeId: _id })}
      style={styles.item}
    >
      <View>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemTeacher}>{teacher}</Text>
      </View>
      <View>
        <Text style={styles.itemCreatedAt}>
          {moment(createdAt).format("YYYY-MM-DD")}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
