import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useTheme } from "@react-navigation/native";

import { Image } from "expo-image";

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

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function CommunityScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const {
    isLoading,
    isSuccess,
    data,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["community"],
    queryFn: ({ pageParam = 0 }) => getCommunities({ offset: pageParam }),
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
      <SafeTitleHeader title="커뮤니티" />
      {isLoading ? <FullScreenLoader /> : null}
      {isSuccess ? (
        <FABPlus
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
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      marginBottom: 8,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 18,
    },
    header: { marginTop: 30 },
    title: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
    },
    time: { fontSize: 11, color: "#b4b4b4", marginTop: 4 },
    publisher_name: { fontSize: 13, color: "gray", marginTop: 4 },
    content: {
      fontSize: 14,
      color: colors.subText,

      marginTop: 18,
      height: 40,
    },
    image_container: {
      flexDirection: "row",
      paddingVertical: 4,
    },
    image: {
      height: SCREEN_WIDTH / 2.2,
      width: SCREEN_WIDTH / 2.2,
      borderRadius: 15,
      marginRight: 8,
      backgroundColor: "#f9f9f9",
    },
    footer: {
      flexDirection: "row",
      paddingVertical: 12,
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
            <Image
              key={_item}
              style={styles.image}
              placeholder={"L1O|b2-;fQ-;_3fQfQfQfQfQfQfQ"}
              transition={500}
              source={{ uri: _item }}
            />
          ))}
        </View>
      ) : null}

      <View style={styles.footer}>
        <View style={styles.icon_wrap}>
          <FontAwesome name={"heart-o"} size={20} color={colors.text} />
          <Text style={styles.icon_text}>{comma(item.likeCount)}</Text>
        </View>
        <View style={[styles.icon_wrap, { marginLeft: 14 }]}>
          <Ionicons name={"chatbubble-outline"} size={20} color={colors.text} />
          <Text style={styles.icon_text}>{comma(item.commentCount)}</Text>
        </View>
        <View style={[styles.icon_wrap, { marginLeft: 14 }]}>
          <Ionicons name={"eye-outline"} size={24} color={colors.text} />
          <Text style={styles.icon_text}>
            {item.views ? comma(item.views) : 0}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
