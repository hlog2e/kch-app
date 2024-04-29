import { FlatList, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { useInfiniteQuery } from "react-query";
import { getCommunities } from "../../../../../../apis/community/community";
import FullScreenLoader from "../../../../../components/Overlay/FullScreenLoader";
import CommunityItem from "./Item";
import { useTheme } from "@react-navigation/native";

export default function CommunityList({ boardData, navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const { colors } = useTheme();

  const {
    isLoading,
    isSuccess,
    data,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["community", boardData],
    queryFn: ({ pageParam = 0 }) =>
      getCommunities({ boardId: boardData._id, offset: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      if (Number(lastPage.nextCursor) > Number(lastPage.totalCount)) {
        return undefined;
      }
      return lastPage.nextCursor;
    },
  });

  const styles = StyleSheet.create({
    header: { padding: 12, backgroundColor: colors.cardBg2 },
    headerText: { fontSize: 12, color: colors.subText, fontWeight: "300" },
  });

  if (isLoading) return <FullScreenLoader />;
  if (data) {
    return (
      <FlatList
        onEndReachedThreshold={0.8}
        onEndReached={fetchNextPage}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.headerText}>{boardData.desc}</Text>
          </View>
        )}
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
    );
  }
}
