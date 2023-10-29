import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { comma } from "../../../../utils/intl";
import moment from "moment";
import "moment/locale/ko";
import SafeTitleHeader from "../../../components/common/SafeTitleHeader";
import { useInfiniteQuery } from "react-query";
import { getCommunities } from "../../../../apis/community/community";
import FullScreenLoader from "../../../components/common/FullScreenLoader";
import { useState } from "react";
import FABPlus from "../../../components/common/FABPlus";

export default function CommunityScreen({ navigation }) {
  // const sortByIDArray = [
  //   { id: 0, text: "최신순", sort: { createdAt: -1 } },
  //   { id: 1, text: "인기순", sort: { views: -1 } },
  //   { id: 2, text: "좋아요순", sort: { likeCount: -1 } },
  //   { id: 3, text: "댓글 많은순", sort: { commentCount: -1 } },
  // ];
  // const [sortBy, setSortBy] = useState({
  //   id: 0,
  //   text: "최신순",
  //   sort: { createdAt: -1 },
  // });

  const [refreshing, setRefreshing] = useState(false);
  const {
    isLoading,
    isSuccess,
    data,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["community"], //정렬방법이 바뀌면 Refetch
    queryFn: ({ pageParam = 0 }) =>
      getCommunities({ offset: pageParam, sort: sortBy.sort }),
    getNextPageParam: (lastPage, allPages) => {
      if (Number(lastPage.nextCursor) > Number(lastPage.totalCount)) {
        return undefined;
      }
      return lastPage.nextCursor;
    },
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    rightHeaderText: {
      fontSize: 13,
      color: "gray",
    },
  });
  return (
    <View style={styles.container}>
      <SafeTitleHeader
        title="커뮤니티"
        // rightComponent={
        //   <TouchableOpacity
        //     onPress={() => {
        //       if (sortBy.id < sortByIDArray.length - 1) {
        //         setSortBy(sortByIDArray[sortBy.id + 1]);
        //       } else {
        //         setSortBy(sortByIDArray[0]);
        //       }
        //     }}
        //   >
        //     <Text style={styles.rightHeaderText}>{sortBy.text}</Text>
        //   </TouchableOpacity>
        // }
      />
      {isLoading ? <FullScreenLoader /> : null}
      {isSuccess ? (
        <FABPlus
          color={"#2563eb"}
          onPress={() => {
            navigation.push("CommunityPOSTScreen");
          }}
        />
      ) : null}

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
          data={data.pages.flatMap((_i) => _i.communities)}
          renderItem={(_item) => {
            return <CommunityItem item={_item.item} navigation={navigation} />;
          }}
          keyExtractor={(_item) => _item._id}
        />
      ) : null}
    </View>
  );
}

function CommunityItem({ item, navigation }) {
  const NowColorState = useColorScheme();
  const styles = StyleSheet.create({
    container: {
      backgroundColor: NowColorState === "light" ? "white" : "#2c2c36",
      marginBottom: 8,
    },
    header: { marginTop: 30, paddingHorizontal: 18 },
    title: {
      fontSize: 20,
      fontWeight: "600",
      color: NowColorState === "light" ? "black" : "white",
    },
    time: { fontSize: 11, color: "#b4b4b4", marginTop: 4 },
    publisher_name: { fontSize: 13, color: "gray", marginTop: 4 },
    content: {
      fontSize: 14,
      color: NowColorState === "light" ? "gray" : "white",
      paddingHorizontal: 18,
      marginTop: 18,
      height: 40,
    },
    image_container: {
      flexDirection: "row",
      height: 90,
      marginTop: 18,
      paddingHorizontal: 18,
    },
    image: {
      height: 80,
      width: 80,
      borderRadius: 15,
      marginRight: 8,
      backgroundColor: "#f9f9f9",
    },
    footer: {
      flexDirection: "row",
      height: 50,

      paddingHorizontal: 18,
    },
    icon_wrap: { flexDirection: "row", alignItems: "center" },
    icon_text: { fontSize: 12, marginLeft: 6, color: "#b4b4b4" },
  });

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.push("CommunityDetailScreen", { id: item._id });
      }}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode={"tail"}>
          {item.title}
        </Text>
        <Text style={styles.publisher_name}>
          {item.publisherName}{" "}
          {item.publisherGrade === "1" ||
          item.publisherGrade === "2" ||
          item.publisherGrade === "3"
            ? item.publisherGrade + "학년"
            : item.publisherGrade}
        </Text>
        <Text style={styles.time}>{moment(item.createdAt).fromNow()}</Text>
      </View>
      <Text style={styles.content} numberOfLines={2} ellipsizeMode={"tail"}>
        {item.content}
      </Text>
      {item.images.length > 0 ? (
        <View style={styles.image_container}>
          {item.images.map((_item) => (
            <Image key={_item} style={styles.image} source={{ uri: _item }} />
          ))}
        </View>
      ) : null}

      <View style={styles.footer}>
        <View style={styles.icon_wrap}>
          <FontAwesome
            name={"heart-o"}
            size={20}
            color={NowColorState === "light" ? "black" : "white"}
          />
          <Text style={styles.icon_text}>{comma(item.likeCount)}</Text>
        </View>
        <View style={[styles.icon_wrap, { marginLeft: 14 }]}>
          <Ionicons
            name={"chatbubble-outline"}
            size={20}
            color={NowColorState === "light" ? "black" : "white"}
          />
          <Text style={styles.icon_text}>{comma(item.commentCount)}</Text>
        </View>
        <View style={[styles.icon_wrap, { marginLeft: 14 }]}>
          <Ionicons
            name={"eye-outline"}
            size={24}
            color={NowColorState === "light" ? "black" : "white"}
          />
          <Text style={styles.icon_text}>
            {item.views ? comma(item.views) : 0}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
