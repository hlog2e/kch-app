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
import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postFeed } from "../../apis/feed/index";
import mime from "mime";
import Header from "../../src/components/Header/Header";
import HorizontalImagePicker from "../../src/components/Image/HorizontalImagePicker";
import { useAlert } from "../../context/AlertContext";
import { useRouter } from "expo-router";

export default function FeedPOSTScreen() {
  const { colors } = useTheme();
  const alert = useAlert();
  const router = useRouter();

  const [content, setContent] = useState("");
  const [images, setImages] = useState<any[]>([]);

  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({ mutationFn: postFeed });

  const handlePOST = async () => {
    if (content.trim() === "") {
      return alert.info("내용을 작성해 주세요!");
    }

    alert.loading("업로드 중 입니다...");
    try {
      const formData = new FormData();
      formData.append("content", content);

      images.forEach(({ uri }) => {
        formData.append("image", {
          uri: uri,
          name: uri.split("/").pop(),
          type: mime.getType(uri),
        } as any);
      });

      await mutateAsync(formData);

      alert.close();
      queryClient.invalidateQueries({ queryKey: ["Feed"] });
      router.back();
    } catch (error: any) {
      error.response
        ? alert.error(error.response.data.message)
        : alert.error(
            "피드 작성 중 알 수 없는 오류가 발생하였습니다. 잠시 후 다시 시도해주세요!"
          );
    }
  };

  const isDisabled = content.trim() === "";

  return (
    <SafeAreaView edges={["top", "bottom"]} style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Header backArrowText="피드 작성" />
        <ScrollView style={styles.wrap}>
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholderTextColor={colors.subText}
            style={[styles.content_input, { color: colors.text }]}
            placeholder="무슨 이야기를 나누고 싶으신가요?"
            multiline
          />
          <HorizontalImagePicker images={images} setImages={setImages} />
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handlePOST}
            disabled={isDisabled}
            style={[
              styles.footer_button,
              { backgroundColor: colors.blue, opacity: isDisabled ? 0.5 : 1 },
            ]}
          >
            <Text style={styles.footer_button_text}>작성하기</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrap: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  content_input: {
    fontSize: 15,
    paddingBottom: 100,
    textAlignVertical: "top",
  },
  footer: {
    padding: 14,
  },
  footer_button: {
    borderRadius: 12,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  footer_button_text: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
