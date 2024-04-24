import { FlatList } from "react-native";
import { useState } from "react";
import { useInfiniteQuery } from "react-query";
import { getCommunities } from "../../../../../../apis/community/community";
import FullScreenLoader from "../../../../../components/Overlay/FullScreenLoader";
import CommunityItem from "./Item";

export default function CommunityList({ boardData, navigation, issuerId }) {
  const [refreshing, setRefreshing] = useState(false);

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

  if (isLoading) return <FullScreenLoader />;
  if (data) {
    return (
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
    );
  }
}
