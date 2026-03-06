import { FlatList, StyleSheet, View } from "react-native";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTheme } from "@react-navigation/native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { getCommunities } from "../../../apis/community/index";
import FullScreenLoader from "../../../src/components/Overlay/FullScreenLoader";
import CommunityItem from "../../../src/components/community/List/Item";
import CategoryFilter from "../../../src/components/community/CategoryFilter";
import CollapsibleHeader, {
  useCollapsibleHeader,
  DEFAULT_HEADER_HEIGHT,
} from "../../../src/components/Header/CollapsibleHeader";

export default function CommunityScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const { scrollProps, headerTranslateY } = useCollapsibleHeader({
    headerHeight: DEFAULT_HEADER_HEIGHT,
  });

  const { isLoading, data, refetch, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["community", selectedCategory],
      queryFn: ({ pageParam }) =>
        getCommunities({ offset: pageParam, category: selectedCategory ?? undefined }),
      initialPageParam: 0,
      getNextPageParam: (lastPage: any, allPages: any) => {
        if (Number(lastPage.nextCursor) > Number(lastPage.totalCount)) {
          return undefined;
        }
        return lastPage.nextCursor;
      },
      placeholderData: (prev) => prev,
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

      <FlatList
          {...scrollProps}
          onEndReachedThreshold={0.8}
          onEndReached={handleEndReached}
          ListHeaderComponent={
            <View>
              <View style={{ height: DEFAULT_HEADER_HEIGHT }} />
              <CategoryFilter
                selectedCategory={selectedCategory}
                onSelect={setSelectedCategory}
              />
            </View>
          }
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
          data={data ? (data as any).pages.flatMap((page: any) => page.communities) : []}
          renderItem={({ item }) => {
            return <CommunityItem item={item} />;
          }}
          keyExtractor={(item: any) => item._id}
        />
    </SafeAreaView>
  );
}
