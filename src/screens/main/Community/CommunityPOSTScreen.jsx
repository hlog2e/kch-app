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
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useMutation, useQueryClient } from "react-query";
import { postCommunity } from "../../../../apis/community/community";

export default function CommunityPOSTScreen({ navigation }) {
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
        aspect: [1, 1],
        quality: 0.7,
        allowsMultipleSelection: true,
      });

      if (!result.cancelled) {
        setImages(result.selected);
      } else {
        console.log("이미지 선택 취소");
      }
    } catch (_err) {
      alert("이미지를 로드하는 중 오류가 발생하였습니다.");
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

  const handlePOST = () => {
    formData.append("title", title);
    formData.append("content", content);
    images.map(({ uri }) => {
      formData.append("image", { uri: uri, name: "test", type: "image" });
    });

    mutate(formData, {
      onSuccess: () => {
        setTitle("");
        setContent("");
        setImages([]);

        queryClient.invalidateQueries("community");
        navigation.goBack();
      },
    });
  };

  const styles = StyleSheet.create({
    wrap: { marginTop: 10, flex: 1, paddingHorizontal: 10 },
    title_input: {
      paddingHorizontal: 10,
      paddingVertical: 14,
      borderBottomWidth: 0.2,
      borderColor: "#d4d4d4",
      fontSize: 16,
      fontWeight: "700",
    },
    content_input: {
      paddingHorizontal: 10,
      color: "#52525b",
      marginTop: 10,
      paddingBottom: 100,
    },
    image_skeleton: {
      backgroundColor: "#f2f2f2",
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
    <SafeAreaView
      edges={["top", "bottom"]}
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
