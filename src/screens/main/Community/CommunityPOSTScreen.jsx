import { SafeAreaView } from "react-native-safe-area-context";
import OnlyLeftArrowHeader from "../../../components/OnlyLeftArrowHeader";
import {
  TextInput,
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useMutation, useQueryClient } from "react-query";
import { postCommunity } from "../../../../apis/community/community";
import mime from "mime";
import CustomLoader from "../../../components/CustomLoader";
import CustomAlert from "../../../components/CustomAlert";

export default function CommunityPOSTScreen({ navigation }) {
  const { colors } = useTheme();

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    status: null,
    message: null,
  });

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
        quality: 0.5,
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
    if (title === "" || content === "") {
      setAlert({
        show: true,
        status: "info",
        message: "제목이랑 내용 모두 작성해 주세요 :)",
      });
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
          onError: (error) => {
            setLoading(false);
            if (error.response.data.message) {
              setAlert({
                show: true,
                status: "error",
                message: error.response.data.message,
              });
            }
          },
        });
      } catch (err) {
        console.log(err);
        setAlert({
          show: true,
          status: "error",
          message:
            "커뮤니티 글 작성 중 알 수 없는 오류가 발생하였습니다. 잠시 후 다시 시도해주세요!",
        });
        setLoading(false);
      }
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
    image_skeleton: {
      backgroundColor: colors.cardBg2,
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
      <CustomAlert
        show={alert.show}
        status={alert.status}
        message={alert.message}
        onClose={() => setAlert({ show: false, status: null, message: null })}
      />
      {/* <CustomLoader text={"업로드 중 입니다..."} loading={loading} />
      TODO: 여기에 alert 로 컴포넌트 통합
      */}
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
            <ScrollView horizontal style={styles.image_container}>
              {images.map(({ assetId, uri }) => {
                return (
                  <TouchableOpacity
                    key={assetId}
                    style={styles.image_wrap}
                    onPress={() => handleImageDelete(assetId)}
                  >
                    <Image
                      placeholder={"L1O|b2-;fQ-;_3fQfQfQfQfQfQfQ"}
                      transition={500}
                      style={styles.image}
                      source={{ uri: uri }}
                    />
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
