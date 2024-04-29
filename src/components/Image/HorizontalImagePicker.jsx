import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ScrollView, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useTheme } from "@react-navigation/native";

export default function HorizontalImagePicker({ images, setImages }) {
  const { colors } = useTheme();
  const handleImagePicking = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.5,
        allowsMultipleSelection: true,
      });
      console.log(result);

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

  const styles = StyleSheet.create({
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
  });
  return (
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
  );
}
