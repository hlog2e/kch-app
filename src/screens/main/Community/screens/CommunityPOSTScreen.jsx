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
import { useMutation, useQueryClient } from "react-query";
import { postCommunity } from "../../../../../apis/community/community";
import mime from "mime";

import Header from "../../../../components/Header/Header";
import HorizontalImagePicker from "../../../../components/Image/HorizontalImagePicker";
import { useAlert } from "../../../../../context/AlertContext";

export default function CommunityPOSTScreen({ navigation }) {
  const { colors } = useTheme();
  const alert = useAlert();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [images, setImages] = useState([]);
  const formData = new FormData();

  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation(postCommunity);

  const handlePOST = async () => {
    if (title === "" || content === "") {
      return alert.info("제목이랑 내용 모두 작성해 주세요 !");
    }

    alert.loading("업로드 중 입니다...");
    try {
      formData.append("title", title);
      formData.append("content", content);
      images.map(({ uri }) => {
        formData.append("image", {
          uri: uri,
          name: uri.split("/").pop(),
          type: mime.getType(uri),
        });
      });
      await mutateAsync(formData);

      setTitle("");
      setContent("");
      setImages([]);

      alert.close();
      queryClient.invalidateQueries("community");
      navigation.goBack();
    } catch (error) {
      error.response
        ? alert.error(error.response.data.message)
        : alert.error(
            "커뮤니티 글 작성 중 알 수 없는 오류가 발생하였습니다. 잠시 후 다시 시도해주세요!"
          );
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    wrap: { marginTop: 10, flex: 1, paddingHorizontal: 10 },
    title_input: {
      paddingHorizontal: 10,
      paddingVertical: 14,
      borderBottomWidth: 0.2,
      borderColor: "#d4d4d4",
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    content_input: {
      paddingHorizontal: 10,
      color: colors.text,
      marginTop: 10,
      paddingBottom: 100,
      textAlignVertical: "top",
    },
    footer: {
      padding: 14,

      alignItems: "flex-end",
    },
    footer_button_text: { color: "gray", fontWeight: "700" },
  });

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <ScrollView>
          <Header navigation={navigation} />
          <View style={styles.wrap}>
            <TextInput
              value={title}
              onChangeText={(_value) => {
                setTitle(_value);
              }}
              style={styles.title_input}
              placeholder={"제목을 입력해주세요."}
            />
            <TextInput
              value={content}
              placeholderTextColor={colors.subText}
              onChangeText={(_value) => {
                setContent(_value);
              }}
              style={styles.content_input}
              placeholder={
                "내용\n\n※경고※\n공공질서 또는 미풍양속에 반하는 표현행위, 제3자를 모욕, 폄하하는 행위 등 커뮤니티에 적합하지 않은 내용을 게시할 시 금천고 앱 영구 이용 정지 처리될 수 있습니다."
              }
              multiline
            />
            <HorizontalImagePicker images={images} setImages={setImages} />
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity onPress={handlePOST}>
            <Text style={styles.footer_button_text}>작성하기</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
