import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTheme } from "@react-navigation/native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { getCommunities } from "../../../apis/community/index";
import FullScreenLoader from "../../../src/components/Overlay/FullScreenLoader";
import CommunityItem from "../../../src/components/community/List/Item";
import CategoryFilter from "../../../src/components/community/CategoryFilter";
import CollapsibleHeader, {
  useCollapsibleHeader,
  DEFAULT_HEADER_HEIGHT,
} from "../../../src/components/Header/CollapsibleHeader";
import { useUser } from "../../../context/UserContext";
import FABPlus from "../../../src/components/Button/FABPlus";

export default function CommunityScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const router = useRouter();

  const canAccessCommunity =
    user?.type === "undergraduate" || user?.type === "graduate";

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
      enabled: canAccessCommunity,
    });

  const handleEndReached = () => {
    if (!isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (!canAccessCommunity) {
    return (
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <CollapsibleHeader
          title="커뮤니티"
          headerTranslateY={headerTranslateY}
          headerHeight={DEFAULT_HEADER_HEIGHT}
        />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
          }}
        >
          <Ionicons
            name="people-outline"
            size={36}
            color={colors.subText}
          />
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: colors.text,
              marginTop: 16,
            }}
          >
            재학생과 졸업생만 이용 가능합니다
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: colors.subText,
              marginTop: 8,
              textAlign: "center",
            }}
          >
            금천인 인증을 완료하면 커뮤니티를 이용할 수 있어요
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/more/verify")}
            style={{
              backgroundColor: colors.blue,
              borderRadius: 20,
              height: 40,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 24,
              marginTop: 24,
            }}
          >
            <Text style={{ color: "#ffffff", fontSize: 14, fontWeight: "bold" }}>
              금천인 인증
            </Text>
            <MaterialIcons
              name="verified"
              size={16}
              color="#ffffff"
              style={{ marginLeft: 5 }}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      {isLoading && <FullScreenLoader />}

      <CollapsibleHeader
        title="커뮤니티"
        headerTranslateY={headerTranslateY}
        headerHeight={DEFAULT_HEADER_HEIGHT}
      />

      <FABPlus onPress={() => router.push("/community/post")} />

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
