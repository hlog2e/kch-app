import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { useUser } from "../../../../context/UserContext";
import { useTheme } from "@react-navigation/native";
import { useMutation, useQueryClient } from "react-query";

import * as ImagePicker from "expo-image-picker";
import mime from "mime";
import {
  deleteProfilePhoto,
  postEditUserProfile,
  postRegisterProfilePhoto,
} from "../../../../apis/user/profile";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../../components/Header/Header";
import { useAlert } from "../../../../context/AlertContext";

export default function EditUserProfileScreen({ navigation }) {
  const { user } = useUser();
  const alert = useAlert();
  const { colors } = useTheme();

  const [inputData, setInputData] = useState({ name: null, desc: null });
  const { mutate: photoMutate } = useMutation(postRegisterProfilePhoto);
  const { mutate: deletePhotoMutate } = useMutation(deleteProfilePhoto);
  const { mutate: profileMutate } = useMutation(postEditUserProfile);

  const formData = new FormData();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user) {
      setInputData({ name: user.name, desc: user.desc });
    }
  }, [user]);

  const handleImagePicking = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        allowsMultipleSelection: false,
        quality: 0.5,
      });

      if (!result.canceled) {
        const image = result.assets[0];
        await handlePOSTPhoto(image);
      }
    } catch (_err) {
      alert.error("이미지를 로드하는 중 오류가 발생하였습니다.");
    }
  };

  const handlePOSTPhoto = async (image) => {
    alert.loading();
    formData.append("image", {
      uri: image.uri,
      name: image.uri.split("/").pop(),
      type: mime.getType(image.uri),
    });

    photoMutate(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries("UserData");
        alert.success(
          "이미지를 성공적으로 업로드 하였습니다.\n화면 상에서 변경되기까지 약 30초 정도 걸려요:)"
        );
      },
      onError: (error) =>
        alert.error(
          "이미지를 업로드 하던 중 오류가 발생하였습니다." +
            error?.response?.data?.message
        ),
    });
  };

  const handleDeleteProfilePhoto = async () => {
    alert.loading();
    deletePhotoMutate(
      {},
      {
        onSuccess: () => {
          queryClient.invalidateQueries("UserData");
          alert.success(
            "기본 프로필 이미지로 변경하였습니다.\n화면 상에서 변경되기까지는 약 30초 정도 걸려요:)"
          );
        },
        onError: (error) => {
          alert.error(
            "기본 프로필 이미지로 변경하던 중 오류가 발생하였습니다." +
              error?.response?.data?.message
          );
        },
      }
    );
  };

  const handlePOSTUserData = async () => {
    alert.loading();
    profileMutate(inputData, {
      onSuccess: () => {
        queryClient.invalidateQueries("UserData");
        navigation.goBack();
        alert.close();
      },
      onError: (error) => {
        alert.error(
          "프로필을 수정하던 중 오류가 발생하였습니다." +
            error?.response?.data?.message
        );
      },
    });
  };

  const styles = StyleSheet.create({
    container: { flex: 1 },
    flexWrap: {
      flex: 1,
      justifyContent: "space-between",
      marginHorizontal: 20,
    },

    photoWrap: { alignItems: "center", marginTop: 10 },
    photo: { width: 100, height: 100, borderRadius: 50 },
    photoInfo: { fontSize: 12, marginTop: 6, color: colors.subText },

    defaultButton: {
      marginTop: 10,
      padding: 5,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
    },
    defaultButtonText: {
      fontSize: 12,
      color: colors.subText,
      fontWeight: "200",
    },

    inputWrap: { marginTop: 24 },
    inputLeftText: { fontSize: 16, fontWeight: "600" },
    textInput: {
      padding: 12,
      marginTop: 10,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      fontWeight: "700",
      color: colors.text,
    },

    doneButton: {
      marginBottom: 20,
      backgroundColor: colors.blue,
      padding: 15,
      alignItems: "center",
      borderRadius: 15,
    },
    doneButtonText: { fontWeight: "700", color: "white" },
  });
  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <Header navigation={navigation} />

      <KeyboardAvoidingView
        style={styles.flexWrap}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <View>
          <View style={styles.photoWrap}>
            <TouchableOpacity onPress={handleImagePicking}>
              {user.profilePhoto ? (
                <Image
                  contentFit={"contain"}
                  style={styles.photo}
                  source={user.profilePhoto}
                />
              ) : (
                <Ionicons name="person-circle" size={100} color={"#d9d9d9"} />
              )}
            </TouchableOpacity>
            <Text style={styles.photoInfo}>사진을 탭하여 업로드</Text>
            {user.profilePhoto ? (
              <TouchableOpacity
                onPress={handleDeleteProfilePhoto}
                style={styles.defaultButton}
              >
                <Text style={styles.defaultButtonText}>기본 프로필로 변경</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <View style={styles.inputWrap}>
            <Text style={styles.inputLeftText}>이름</Text>
            <TextInput
              value={inputData.name}
              onChangeText={(_value) =>
                setInputData((_prev) => {
                  return { ..._prev, name: _value };
                })
              }
              style={styles.textInput}
              placeholder="이름"
            />
          </View>
          <View style={styles.inputWrap}>
            <Text style={styles.inputLeftText}>설명</Text>
            <TextInput
              value={inputData.desc}
              onChangeText={(_value) =>
                setInputData((_prev) => {
                  return { ..._prev, desc: _value };
                })
              }
              style={styles.textInput}
              placeholder="ex) 학생회장"
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handlePOSTUserData}
          style={styles.doneButton}
        >
          <Text style={styles.doneButtonText}>수정 완료</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
