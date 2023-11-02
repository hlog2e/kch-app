import { SafeAreaView } from "react-native-safe-area-context";
import OnlyLeftArrowHeader from "../../../components/common/OnlyLeftArrowHeader";
import {
  TextInput,
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useMutation, useQueryClient } from "react-query";
import { postCommunity } from "../../../../apis/community/community";
import FullScreenBlurLoader from "../../../components/common/FullScreenBlurLoader";
import badWordChecker from "../../../../utils/badWordChecker";
import mime from "mime";

export default function CommunityPOSTScreen({ navigation }) {
  const NowColorState = useColorScheme();

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [images, setImages] = useState([]);
  const formData = new FormData();

  const queryClient = useQueryClient();
  const { mutate } = useMutation(postCommunity);

  const handleImagePicking = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.1,
        allowsMultipleSelection: true,
      });

      if (!result.canceled) {
        setImages(result.assets);
      } else {
        console.log("이미지 선택 취소");
      }
    } catch (_err) {
      Alert.alert("오류", "이미지를 로드하는 중 오류가 발생하였습니다.", [
        { text: "확인" },
      ]);
    }
  };

  const handleImageDelete = (_assetId) => {
    const copyBeforeImage = [...images];
    const deletedNewArray = copyBeforeImage.filter(
      ({ assetId }) => assetId !== _assetId
    );

    Alert.alert("삭제", "선택한 이미지를 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        onPress: () => {
          setImages(deletedNewArray);
        },
      },
    ]);
  };

  const checkBeforePOST = async () => {
    setLoading(true);
    // const { isBad: titleIsBad, word: titleBadWord } = await badWordChecker(
    //   title
    // );
    // const { isBad: contentIsBad, word: contentBadWord } = await badWordChecker(
    //   content
    // );

    // if (titleIsBad) {
    //   Alert.alert(
    //     "오류",
    //     "제목에 비속어가 포함되어 있습니다. '" + titleBadWord + "'",
    //     [{ text: "확인" }]
    //   );
    //   setLoading(false);
    //   return { passed: false };
    // }

    // if (contentIsBad) {
    //   Alert.alert(
    //     "오류",
    //     "내용에 비속어가 포함되어 있습니다. '" + contentBadWord + "'",
    //     [{ text: "확인" }]
    //   );
    //   setLoading(false);
    //   return { passed: false };
    // }

    if (title === "" || content === "") {
      Alert.alert("오류", "제목이랑 내용 모두 작성해주세요.", [
        { text: "확인" },
      ]);
      setLoading(false);
      return { passed: false };
    }

    return { passed: true };
  };

  const handlePOST = async () => {
    const { passed } = await checkBeforePOST();
    if (passed) {
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

        mutate(formData, {
          onSuccess: () => {
            setLoading(false);
            setTitle("");
            setContent("");
            setImages([]);

            queryClient.invalidateQueries("community");
            navigation.goBack();
          },
        });
      } catch (err) {
        console.log(err);
        Alert.alert("오류", "게시물 작성 도중 오류가 발생하였습니다.", [
          { text: "확인" },
        ]);
        setLoading(false);
      }
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: NowColorState === "light" ? "white" : "#18171c",
    },

    wrap: { marginTop: 10, flex: 1, paddingHorizontal: 10 },
    title_input: {
      paddingHorizontal: 10,
      paddingVertical: 14,
      borderBottomWidth: 0.2,
      borderColor: "#d4d4d4",
      fontSize: 16,
      fontWeight: "700",
      color: NowColorState === "light" ? "black" : "white",
    },
    content_input: {
      paddingHorizontal: 10,
      color: NowColorState === "light" ? "#52525b" : "white",
      marginTop: 10,
      paddingBottom: 100,
    },
    image_skeleton: {
      backgroundColor: NowColorState === "light" ? "#f2f2f2" : "#2c2c36",
      width: 100,
      height: 100,
      borderRadius: 10,
      paddingVertical: 20,
      marginLeft: 10,
      justifyContent: "space-between",
      alignItems: "center",
    },
    image_wrap: {
      marginLeft: 10,
    },
    image: { width: 100, height: 100, borderRadius: 10 },
    image_skeleton_text: { color: "gray", fontWeight: "700", fontSize: 13 },

    footer: {
      padding: 14,

      alignItems: "flex-end",
    },
    footer_button_text: { color: "gray", fontWeight: "700" },
  });

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
      <FullScreenBlurLoader loading={loading} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <ScrollView>
          <OnlyLeftArrowHeader navigation={navigation} />
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
              onChangeText={(_value) => {
                setContent(_value);
              }}
              style={styles.content_input}
              placeholderTextColor={NowColorState === "dark" ? "gray" : null}
              placeholder={"내용"}
              multiline
            />
            <ScrollView horizontal style={styles.image_container}>
              {images.map(({ assetId, uri }) => {
                return (
                  <TouchableOpacity
                    key={assetId}
                    style={styles.image_wrap}
                    onPress={() => handleImageDelete(assetId)}
                  >
                    <Image style={styles.image} source={{ uri: uri }} />
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity
                style={styles.image_skeleton}
                onPress={handleImagePicking}
              >
                <Ionicons name="camera" size={30} color="gray" />
                <Text style={styles.image_skeleton_text}>이미지 선택</Text>
              </TouchableOpacity>
            </ScrollView>
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
