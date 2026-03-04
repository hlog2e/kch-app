import {
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useQuery } from "react-query";
import { useTheme } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { getCommunityCategories } from "../../../apis/community/index";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelect: (categoryId: string | null) => void;
}

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null;
};

// 배경색 hue 기반 텍스트 색상 결정
const getTextColor = (bgColor: string) => {
  const rgb = hexToRgb(bgColor);
  if (!rgb) return "#4b5563";
  const { r, g, b } = rgb;

  if ((r + g + b) / 3 < 100) return "#ffffff";

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  if (d < 15) return "#4b5563"; // 무채색 → 회색 텍스트

  let h = 0;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;

  if (h >= 340 || h < 15) return "#dc2626";  // 빨강/로즈
  if (h >= 15 && h < 45) return "#ea580c";   // 오렌지
  if (h >= 45 && h < 70) return "#d97706";   // 앰버/노랑
  if (h >= 70 && h < 160) return "#16a34a";  // 초록
  if (h >= 160 && h < 200) return "#0891b2"; // 시안/틸
  if (h >= 200 && h < 245) return "#3b82f6"; // 파랑
  if (h >= 245 && h < 340) return "#7c3aed"; // 보라
  return "#4b5563";
};

export default function CategoryFilter({
  selectedCategory,
  onSelect,
}: CategoryFilterProps) {
  const { dark } = useTheme();

  const { data: categoriesData } = useQuery(
    "communityCategories",
    getCommunityCategories,
    { staleTime: 5 * 60 * 1000 },
  );

  const handleSelect = (categoryId: string | null) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onSelect(categoryId);
  };

  const categories = categoriesData?.categories ?? [];
  const hasSelection = selectedCategory !== null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleSelect(null)}
        style={[
          styles.chip,
          {
            backgroundColor: !hasSelection
              ? dark ? "#e5e5e5" : "#2c2c2e"
              : dark ? "#2a2a2c" : "#f0f0f0",
          },
        ]}
      >
        <Text
          style={[
            styles.chipText,
            {
              color: !hasSelection
                ? dark ? "#1a1a1a" : "#ffffff"
                : dark ? "#999" : "#777",
            },
          ]}
        >
          전체
        </Text>
      </TouchableOpacity>

      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id;

        return (
          <TouchableOpacity
            key={cat.id}
            activeOpacity={0.7}
            onPress={() => handleSelect(cat.id)}
            style={[
              styles.chip,
              {
                backgroundColor: cat.color,
                opacity: hasSelection && !isSelected ? 0.4 : 1,
              },
            ]}
          >
            <Text
              style={[styles.chipText, { color: getTextColor(cat.color) }]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  chip: {
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
