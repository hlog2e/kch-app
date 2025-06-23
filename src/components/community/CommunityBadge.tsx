import { StyleSheet, Text, View } from "react-native";
import { useQuery } from "react-query";
import { getCommunityCategories } from "../../../apis/community/index";

interface CommunityBadgeProps {
  categoryId?: string;
}

export default function CommunityBadge({ categoryId }: CommunityBadgeProps) {
  // 카테고리 데이터 가져오기
  const { data: categoriesData } = useQuery(
    "communityCategories",
    getCommunityCategories,
    {
      staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    }
  );

  // 색상을 RGB로 변환하는 함수
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  // 배경색에 따른 텍스트 색상을 결정하는 함수
  const getTextColorFromBackground = (backgroundColor: string) => {
    const rgb = hexToRgb(backgroundColor);
    if (!rgb) return "#ffffff"; // 기본 흰색

    const { r, g, b } = rgb;

    // 색상 계열 판단 및 살짝 연한 색상 반환
    if (b > r && b > g) {
      // 파란색 계열
      return "#3b82f6"; // 살짝 연한 파란색
    } else if (r > g && r > b) {
      // 빨간색 계열
      return "#dc2626"; // 살짝 연한 빨간색
    } else if (g > r && g > b) {
      // 초록색 계열
      return "#16a34a"; // 살짝 연한 초록색
    } else if (r > 200 && g > 200 && b < 100) {
      // 노란색 계열
      return "#d97706"; // 살짝 연한 오렌지
    } else if (r + g + b > 600) {
      // 밝은 색상 (흰색, 연한 색상들)
      return "#4b5563"; // 살짝 연한 회색
    } else {
      // 어두운 색상들
      return "#ffffff"; // 흰색
    }
  };

  // 카테고리별 색상을 반환하는 함수
  const getCategoryColor = (categoryId: string) => {
    if (!categoriesData?.categories) {
      return { bg: "#6b7280", text: "#ffffff" }; // 기본 색상
    }

    const category = categoriesData.categories.find(
      (cat) => cat.id === categoryId
    );
    if (category) {
      return {
        bg: category.color,
        text: getTextColorFromBackground(category.color),
      };
    }

    return { bg: "#6b7280", text: "#ffffff" }; // 기본 색상
  };

  // 카테고리 ID로 이름을 반환하는 함수
  const getCategoryName = (categoryId: string) => {
    if (!categoriesData?.categories) {
      return categoryId; // 기본적으로 ID 반환
    }

    const category = categoriesData.categories.find(
      (cat) => cat.id === categoryId
    );
    return category ? category.name : categoryId;
  };

  // categoryId가 없으면 null 반환
  if (!categoryId) {
    return null;
  }

  const colors = getCategoryColor(categoryId);

  const styles = StyleSheet.create({
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 16,
      alignSelf: "flex-start",
      marginBottom: 4,
      backgroundColor: colors.bg,
    },
    text: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.text,
    },
  });

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{getCategoryName(categoryId)}</Text>
    </View>
  );
}
