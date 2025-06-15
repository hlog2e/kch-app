import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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

// 목 데이터 (실제 구현시에는 API로 교체)
const mockCommunityPosts = [
  {
    id: "1",
    title: "중간고사 준비하는 꿀팁 공유해요!",
    content:
      "안녕하세요! 이번에 중간고사를 잘 본 학생입니다. 제가 사용한 공부법을 공유해볼게요...",
    author: "김*현",
    authorGrade: "2학년",
    likeCount: 47,
    commentCount: 23,
    createdAt: "2024-06-18T10:30:00Z",
    category: "학습",
    images: ["https://picsum.photos/200/150?random=1"],
  },
  {
    id: "2",
    title: "학교 급식 맛집 메뉴 추천!",
    content:
      "오늘 급식이 진짜 맛있었는데 여러분도 드셔보세요. 특히 치킨마요덮밥이...",
    author: "박*민",
    authorGrade: "3학년",
    likeCount: 32,
    commentCount: 18,
    createdAt: "2024-06-18T14:15:00Z",
    category: "생활",
  },
  {
    id: "3",
    title: "동아리 페스티벌 후기 + 사진",
    content: "어제 동아리 페스티벌 너무 재미있었어요! 사진 몇 장 공유합니다.",
    author: "이*수",
    authorGrade: "1학년",
    likeCount: 89,
    commentCount: 41,
    createdAt: "2024-06-17T16:45:00Z",
    category: "행사",
    images: [
      "https://picsum.photos/200/150?random=2",
      "https://picsum.photos/200/150?random=3",
      "https://picsum.photos/200/150?random=4",
    ],
  },
];

export default function CommunitySection() {
  const { colors } = useTheme();
  const router = useRouter();

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
    scrollView: {
      paddingLeft: 14,
      paddingVertical: 17,
    },
  });

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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={{ paddingRight: 14 }}
      >
        {mockCommunityPosts.map((post, index) => (
          <CommunityPostCard key={post.id} post={post} index={index} />
        ))}
      </ScrollView>
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

  const getCategoryColor = (category: string) => {
    // 모든 카테고리를 통일된 파란색으로
    return "#4A90E2";
  };

  const styles = StyleSheet.create({
    card: {
      width: screenWidth - 80,
      minHeight: 140,
      backgroundColor: index % 2 === 0 ? "#F2F9FF" : colors.cardBg,
      borderRadius: 20,
      marginRight: 12,
      padding: 16,
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
    categoryBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
      backgroundColor: "rgba(74, 144, 226, 0.1)",
      borderWidth: 1,
      borderColor: "#4A90E2",
    },
    categoryText: {
      fontSize: 10,
      fontWeight: "600",
      color: "#4A90E2",
    },
    postTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 6,
      lineHeight: 20,
    },
    postContent: {
      fontSize: 13,
      color: colors.subText,
      lineHeight: 18,
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
      onPress={() => router.push(`/community/post/${post.id}`)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.categoryContainer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{post.category}</Text>
          </View>
        </View>
      </View>

      <View style={styles.contentWithImage}>
        <View style={styles.textContent}>
          <Text style={styles.postTitle} numberOfLines={2}>
            {post.title}
          </Text>
          <Text style={styles.postContent} numberOfLines={2}>
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
            {post.author} • {post.authorGrade}
          </Text>
          <Text style={styles.timeText}>
            {moment(post.createdAt).fromNow()}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="heart-outline" size={14} color="#ff6b6b" />
            <Text style={styles.statText}>{post.likeCount}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons
              name="chatbubble-outline"
              size={14}
              color={colors.subText}
            />
            <Text style={styles.statText}>{post.commentCount}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
