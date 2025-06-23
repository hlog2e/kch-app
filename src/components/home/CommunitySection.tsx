import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import moment from "moment";
import { useInfiniteQuery } from "react-query";
import { getCommunities } from "../../../apis/community/index";
import CommunityBadge from "../community/CommunityBadge";

export default function CommunitySection() {
  const { colors } = useTheme();
  const router = useRouter();

  // 무한스크롤을 위한 useInfiniteQuery 사용
  const { data, isLoading, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["homeCommunityPosts"],
      queryFn: ({ pageParam = 0 }) =>
        getCommunities({ offset: pageParam, category: undefined }),
      getNextPageParam: (lastPage: any, allPages: any) => {
        if (Number(lastPage.nextCursor) > Number(lastPage.totalCount)) {
          return undefined;
        }
        return lastPage.nextCursor;
      },
      staleTime: 3 * 60 * 1000, // 3분간 캐시 유지
    });

  // 애니메이션 설정
  const translateY = useSharedValue(40);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // 800ms 지연 후 아래에서 위로 슬라이드인
    translateY.value = withDelay(
      800,
      withSpring(0, { damping: 15, stiffness: 120 })
    );
    opacity.value = withDelay(
      800,
      withSpring(1, { damping: 15, stiffness: 120 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  // 다음 페이지 로드 핸들러
  const handleEndReached = () => {
    if (!isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const styles = StyleSheet.create({
    container: {
      marginTop: 24,
    },
    headerSection: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginHorizontal: 14,
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    fireIcon: {
      marginLeft: 8,
    },
    moreButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 15,
      backgroundColor: colors.cardBg2,
    },
    moreButtonText: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.subText,
      marginRight: 4,
    },
    flatListContainer: {
      paddingLeft: 14,
      paddingVertical: 17,
    },
  });

  // 로딩 중이거나 데이터가 없으면 빈 컨테이너 반환
  const posts = data?.pages?.flatMap((page: any) => page.communities) || [];
  if (isLoading || !data || posts.length === 0) {
    return <View style={styles.container} />;
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.headerSection}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>인기 커뮤니티 🔥</Text>
        </View>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => router.push("/community")}
        >
          <Text style={styles.moreButtonText}>더보기</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.subText} />
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={posts}
        renderItem={({ item, index }) => (
          <CommunityPostCard key={item._id} post={item} index={index} />
        )}
        keyExtractor={(item: any) => item._id}
        contentContainerStyle={styles.flatListContainer}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => {
          if (isFetchingNextPage) {
            return <View style={{ width: 50 }} />; // 로딩 인디케이터 자리
          }
          return null;
        }}
      />
    </Animated.View>
  );
}

interface CommunityPostCardProps {
  post: any;
  index: number;
}

function CommunityPostCard({ post, index }: CommunityPostCardProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const screenWidth = Dimensions.get("window").width;

  const styles = StyleSheet.create({
    card: {
      width: screenWidth - 80,
      height: 160,
      marginRight: 12,
      backgroundColor: index % 2 === 0 ? "#F2F9FF" : colors.cardBg,
      borderRadius: 20,
      padding: 14,
      borderWidth: 1,
      borderColor: index % 2 === 0 ? "#E0F0FF" : colors.border,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    categoryContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    postTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 6,
    },
    postContent: {
      fontSize: 13,
      color: colors.subText,
      marginBottom: 12,
    },
    contentWithImage: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    textContent: {
      flex: 1,
      marginRight: 12,
    },
    imagePreview: {
      width: 50,
      height: 50,
      borderRadius: 8,
    },
    multiImageContainer: {
      position: "relative",
    },
    imageOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    imageCountText: {
      color: "white",
      fontSize: 10,
      fontWeight: "700",
    },
    cardFooter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: "auto",
    },
    authorInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    authorText: {
      fontSize: 12,
      color: colors.subText,
      fontWeight: "500",
      marginLeft: 4,
    },
    statsContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    statItem: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: 12,
    },
    statText: {
      fontSize: 11,
      color: colors.subText,
      marginLeft: 2,
      fontWeight: "500",
    },
    timeText: {
      fontSize: 10,
      color: colors.subText,
      marginLeft: 6,
    },
  });

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/community/detail",
          params: { id: post._id },
        })
      }
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.categoryContainer}>
          <CommunityBadge categoryId={post.category} />
        </View>
      </View>

      <View style={styles.contentWithImage}>
        <View style={styles.textContent}>
          <Text style={styles.postTitle} numberOfLines={1} ellipsizeMode="tail">
            {post.title}
          </Text>
          <Text
            style={styles.postContent}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {post.content}
          </Text>
        </View>
        {post.images && post.images.length > 0 && (
          <View style={styles.multiImageContainer}>
            <Image
              style={styles.imagePreview}
              source={{ uri: post.images[0] }}
              contentFit="cover"
            />
            {post.images.length > 1 && (
              <View style={styles.imageOverlay}>
                <Text style={styles.imageCountText}>
                  +{post.images.length - 1}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.authorInfo}>
          <Ionicons
            name="person-circle-outline"
            size={16}
            color={colors.subText}
          />
          <Text style={styles.authorText}>
            {post.isAnonymous
              ? "익명"
              : !post?.publisher || !post?.publisher?.name
              ? "탈퇴한 사용자"
              : `${post.publisher.name} • ${post.publisher.desc || ""}`}
          </Text>
          <Text style={styles.timeText}>
            {moment(post.createdAt).fromNow()}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="heart-outline" size={14} color="#ff6b6b" />
            <Text style={styles.statText}>{post.likeCount || 0}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons
              name="chatbubble-outline"
              size={14}
              color={colors.subText}
            />
            <Text style={styles.statText}>{post.commentCount || 0}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
