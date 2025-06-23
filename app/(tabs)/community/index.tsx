import { FlatList, StyleSheet, View } from "react-native";
import { useState } from "react";
import { useInfiniteQuery } from "react-query";
import { useTheme } from "@react-navigation/native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { getCommunities } from "../../../apis/community/index";
import FullScreenLoader from "../../../src/components/Overlay/FullScreenLoader";
import CommunityItem from "../../../src/components/community/List/Item";
import CollapsibleHeader, {
  useCollapsibleHeader,
  DEFAULT_HEADER_HEIGHT,
} from "../../../src/components/Header/CollapsibleHeader";

export default function CommunityScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const { scrollProps, headerTranslateY } = useCollapsibleHeader({
    headerHeight: DEFAULT_HEADER_HEIGHT,
  });

  const { isLoading, data, refetch, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["community"],
      queryFn: ({ pageParam = 0 }) => getCommunities({ offset: pageParam }),
      getNextPageParam: (lastPage: any, allPages: any) => {
        if (Number(lastPage.nextCursor) > Number(lastPage.totalCount)) {
          return undefined;
        }
        return lastPage.nextCursor;
      },
    });

  const handleEndReached = () => {
    if (!isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoading && <FullScreenLoader />}

      <CollapsibleHeader
        title="커뮤니티"
        headerTranslateY={headerTranslateY}
        headerHeight={DEFAULT_HEADER_HEIGHT}
      />

      {data && (
        <FlatList
          {...scrollProps}
          onEndReachedThreshold={0.8}
          onEndReached={handleEndReached}
          ListHeaderComponent={() => (
            <View style={{ height: DEFAULT_HEADER_HEIGHT }} />
          )}
          ListFooterComponent={() => {
            if (isFetchingNextPage) return <FullScreenLoader />;
            return null;
          }}
          onRefresh={() => {
            setRefreshing(true);
            refetch().then(() => {
              setRefreshing(false);
            });
          }}
          refreshing={refreshing}
          data={(data as any).pages.flatMap((page: any) => page.communities)}
          renderItem={({ item }) => {
            return <CommunityItem item={item} />;
          }}
          keyExtractor={(item: any) => item._id}
        />
      )}
    </SafeAreaView>
  );
}
