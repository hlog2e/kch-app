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
import { getNotices } from "../../../../../apis/school_data/notice";
import moment from "moment";
import Ionicons from "@expo/vector-icons/Ionicons";
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
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginLeft: 14,
    },
    flatList: {
      paddingTop: 6,
      maxHeight: 350,
      marginTop: 4,
    },
  });
  if (data) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>홈페이지 공지사항</Text>

        <FlatList
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
      marginBottom: 2,
      // backgroundColor: colors.cardBg2,
      padding: 14,
      height: 55,
      marginRight: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    itemTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.text,
      maxWidth: SCREEN_WIDTH - 170,
    },
    itemTitleWrap: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
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
      <View style={styles.itemTitleWrap}>
        <Ionicons name="alert-circle-outline" size={26} color={"#cad5e2"} />

        <View style={{ marginLeft: 8 }}>
          <Text style={styles.itemTitle} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
          <Text style={styles.itemTeacher}>{teacher}</Text>
        </View>
      </View>
      <View>
        <Text style={styles.itemCreatedAt}>
          {moment(createdAt).format("YYYY-MM-DD")}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
