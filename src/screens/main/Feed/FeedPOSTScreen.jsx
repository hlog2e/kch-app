import { SafeAreaView } from "react-native-safe-area-context";
import OnlyLeftArrowHeader from "../../../components/common/OnlyLeftArrowHeader";
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
import { postFeed } from "../../../../apis/feed/feed";

import mime from "mime";
import CustomLoader from "../../../components/common/CustomLoader";
import CustomAlert from "../../../components/common/CustomAlert";

export default function FeedPOSTScreen({ navigation }) {
  const { colors } = useTheme();

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    status: null,
    message: null,
  });

  const [content, setContent] = useState("");

  const [images, setImages] = useState([]);
  const formData = new FormData();

  const queryClient = useQueryClient();
  const { mutate } = useMutation(postFeed);

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

  const handlePOST = async () => {
    if (content === "")
      return setAlert({
        show: true,
        status: "info",
        message: "내용을 작성해주세요:)",
      });

    if (content !== "") {
      setLoading(true);
      try {
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
            setContent("");
            setImages([]);

            queryClient.invalidateQueries("Feed");
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
            "피드 작성 중 알 수 없는 오류가 발생하였습니다. 잠시 후 다시 시도해주세요!",
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

    content_input: {
      paddingHorizontal: 10,
      color: colors.text,
      paddingBottom: 100,
      fontSize: 16,
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
      <CustomLoader text={"업로드 중 입니다..."} loading={loading} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <ScrollView>
          <OnlyLeftArrowHeader navigation={navigation} />
          <View style={styles.wrap}>
            <TextInput
              value={content}
              onChangeText={(_value) => {
                setContent(_value);
              }}
              style={styles.content_input}
              placeholder={"내용을 입력해주세요!"}
              placeholderTextColor={colors.subText}
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
