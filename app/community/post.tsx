import { SafeAreaView } from "react-native-safe-area-context";
import {
  TextInput,
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Checkbox from "expo-checkbox";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  postCommunity,
  getCommunityCategories,
} from "../../apis/community/index";
import mime from "mime";
import * as Haptics from "expo-haptics";
import Header from "../../src/components/Header/Header";
import HorizontalImagePicker from "../../src/components/Image/HorizontalImagePicker";
import { useAlert } from "../../context/AlertContext";
import { useRouter } from "expo-router";

export default function CommunityPOSTScreen() {
  const { colors, dark } = useTheme();
  const alert = useAlert();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [images, setImages] = useState<any[]>([]);

  const { data: categoriesData } = useQuery({
    queryKey: ["communityCategories"],
    queryFn: getCommunityCategories,
    staleTime: 5 * 60 * 1000,
  });

  const categories = (categoriesData?.categories ?? []).filter(
    (cat) => cat.id !== "top"
  );

  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({ mutationFn: postCommunity });

  const handleSelectCategory = (categoryId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  const handlePOST = async () => {
    if (selectedCategory === null) {
      return alert.info("카테고리를 선택해 주세요!");
    }
    if (title === "" || content === "") {
      return alert.info("제목이랑 내용 모두 작성해 주세요!");
    }

    alert.loading("업로드 중 입니다...");
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", selectedCategory);
      formData.append("isAnonymous", String(isAnonymous));

      images.forEach(({ uri }) => {
        formData.append("image", {
          uri: uri,
          name: uri.split("/").pop(),
          type: mime.getType(uri),
        } as any);
      });

      await mutateAsync(formData);

      alert.close();
      queryClient.invalidateQueries({ queryKey: ["community"] });
      router.back();
    } catch (error: any) {
      error.response
        ? alert.error(error.response.data.message)
        : alert.error(
            "커뮤니티 글 작성 중 알 수 없는 오류가 발생하였습니다. 잠시 후 다시 시도해주세요!"
          );
    }
  };

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView>
          <Header backArrowText="커뮤니티 글 작성" />

          {/* 카테고리 선택 */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContainer}
          >
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  activeOpacity={0.7}
                  onPress={() => handleSelectCategory(cat.id)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: cat.color,
                      opacity: selectedCategory !== null && !isSelected ? 0.4 : 1,
                    },
                  ]}
                >
                  <Text style={[styles.chipText, { color: getTextColor(cat.color) }]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.wrap}>
            <TextInput
              value={title}
              onChangeText={setTitle}
              style={[styles.title_input, { color: colors.text, borderColor: "#d4d4d4" }]}
              placeholder="제목을 입력해주세요."
              placeholderTextColor={colors.subText}
            />
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholderTextColor={colors.subText}
              style={[styles.content_input, { color: colors.text }]}
              placeholder={
                "내용\n\n※경고※\n공공질서 또는 미풍양속에 반하는 표현행위, 제3자를 모욕, 폄하하는 행위 등 커뮤니티에 적합하지 않은 내용을 게시할 시 앱 영구 이용 정지 처리될 수 있습니다."
              }
              multiline
            />
            <HorizontalImagePicker images={images} setImages={setImages} />
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.checkbox_wrap}
            onPress={() => setIsAnonymous((prev) => !prev)}
          >
            <Checkbox
              style={styles.checkbox}
              color={isAnonymous ? colors.blue : undefined}
              value={isAnonymous}
            />
            <Text style={[styles.checkbox_text, { color: colors.subText }]}>
              익명
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handlePOST}>
            <Text style={styles.footer_button_text}>작성하기</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// CategoryFilter.tsx에서 재사용하는 유틸 함수
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

const getTextColor = (bgColor: string) => {
  const rgb = hexToRgb(bgColor);
  if (!rgb) return "#4b5563";
  const { r, g, b } = rgb;

  if ((r + g + b) / 3 < 100) return "#ffffff";

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  if (d < 15) return "#4b5563";

  let h = 0;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;

  if (h >= 340 || h < 15) return "#dc2626";
  if (h >= 15 && h < 45) return "#ea580c";
  if (h >= 45 && h < 70) return "#d97706";
  if (h >= 70 && h < 160) return "#16a34a";
  if (h >= 160 && h < 200) return "#0891b2";
  if (h >= 200 && h < 245) return "#3b82f6";
  if (h >= 245 && h < 340) return "#7c3aed";
  return "#4b5563";
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoryContainer: {
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
  wrap: {
    marginTop: 10,
    flex: 1,
    paddingHorizontal: 10,
  },
  title_input: {
    paddingHorizontal: 10,
    paddingVertical: 14,
    borderBottomWidth: 0.2,
    fontSize: 16,
    fontWeight: "700",
  },
  content_input: {
    paddingHorizontal: 10,
    marginTop: 10,
    paddingBottom: 100,
    textAlignVertical: "top",
  },
  footer: {
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkbox_wrap: { flexDirection: "row", alignItems: "center" },
  checkbox: { borderRadius: 5 },
  checkbox_text: {
    marginLeft: 5,
    fontWeight: "600",
    fontSize: 13,
  },
  footer_button_text: { color: "gray", fontWeight: "700" },
});
