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
import { useUser } from "../../context/UserContext";
import { useTheme } from "@react-navigation/native";
import { useMutation, useQueryClient } from "react-query";
import * as ImagePicker from "expo-image-picker";
import mime from "mime";
import {
  deleteProfilePhoto,
  postEditUserProfile,
  postRegisterProfilePhoto,
} from "../../apis/user/profile";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAlert } from "../../context/AlertContext";

// Simple Header Component for Edit Profile
function EditProfileHeader() {
  const { colors } = useTheme();
  const router = useRouter();

  const styles = StyleSheet.create({
    header: {
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "row",
    },
    backButton: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: 16,
      marginBottom: 6,
    },
    backButtonText: {
      paddingHorizontal: 10,
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
  });

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={30} color={colors.text} />
        <Text style={styles.backButtonText}>뒤로</Text>
      </TouchableOpacity>
    </View>
  );
}

interface InputData {
  name: string | null;
  desc: string | null;
}

export default function EditUserProfileScreen() {
  const { user } = useUser();
  const alert = useAlert();
  const { colors } = useTheme();
  const router = useRouter();

  const [inputData, setInputData] = useState<InputData>({
    name: null,
    desc: null,
  });
  const { mutate: photoMutate } = useMutation<unknown, unknown, FormData>(
    postRegisterProfilePhoto
  );
  const { mutate: deletePhotoMutate } = useMutation<unknown, unknown, void>(
    deleteProfilePhoto
  );
  const { mutate: profileMutate } = useMutation<
    unknown,
    unknown,
    { name: string; desc: string }
  >(postEditUserProfile);

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

  const handlePOSTPhoto = async (image: ImagePicker.ImagePickerAsset) => {
    alert.loading("");
    formData.append("image", {
      uri: image.uri,
      name: image.uri.split("/").pop(),
      type: mime.getType(image.uri),
    } as any);

    photoMutate(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries("UserData");
        alert.success(
          "이미지를 성공적으로 업로드 하였습니다.\n화면 상에서 변경되기까지 약 30초 정도 걸려요:)"
        );
      },
      onError: (error: any) =>
        alert.error(
          "이미지를 업로드 하던 중 오류가 발생하였습니다." +
            error?.response?.data?.message
        ),
    });
  };

  const handleDeleteProfilePhoto = async () => {
    alert.loading("");
    deletePhotoMutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries("UserData");
        alert.success(
          "기본 프로필 이미지로 변경하였습니다.\n화면 상에서 변경되기까지는 약 30초 정도 걸려요:)"
        );
      },
      onError: (error: any) => {
        alert.error(
          "기본 프로필 이미지로 변경하던 중 오류가 발생하였습니다." +
            error?.response?.data?.message
        );
      },
    });
  };

  const handlePOSTUserData = async () => {
    const dataToSubmit = {
      name: inputData.name || "",
      desc: inputData.desc || "",
    };

    alert.loading("");
    profileMutate(dataToSubmit, {
      onSuccess: () => {
        queryClient.invalidateQueries("UserData");
        router.back();
        alert.close();
      },
      onError: (error: any) => {
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
    inputLeftText: { fontSize: 16, fontWeight: "600", color: colors.text },
    textInput: {
      padding: 12,
      marginTop: 10,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      color: colors.text,
    },

    confirmButton: {
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.blue,
      borderRadius: 15,
      marginBottom: 20,
    },
    confirmButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "700",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <EditProfileHeader />
      <KeyboardAvoidingView
        style={styles.flexWrap}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View>
          <TouchableOpacity
            onPress={handleImagePicking}
            style={styles.photoWrap}
          >
            <Image
              style={styles.photo}
              source={{
                uri: user?.profileImage
                  ? user.profileImage
                  : "https://cdn.discordapp.com/attachments/1101838265849245787/1102095939500302336/image.png",
              }}
            />
            <Text style={styles.photoInfo}>탭해서 프로필 이미지 변경</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDeleteProfilePhoto}
            style={styles.defaultButton}
          >
            <Text style={styles.defaultButtonText}>기본 이미지로 변경</Text>
          </TouchableOpacity>

          <View style={styles.inputWrap}>
            <Text style={styles.inputLeftText}>닉네임</Text>
            <TextInput
              value={inputData.name || ""}
              onChangeText={(value) =>
                setInputData((prev) => ({ ...prev, name: value }))
              }
              style={styles.textInput}
              placeholder="닉네임"
              placeholderTextColor={colors.subText}
            />
          </View>
          <View style={styles.inputWrap}>
            <Text style={styles.inputLeftText}>자기소개</Text>
            <TextInput
              value={inputData.desc || ""}
              onChangeText={(value) =>
                setInputData((prev) => ({ ...prev, desc: value }))
              }
              style={styles.textInput}
              placeholder="자기소개"
              placeholderTextColor={colors.subText}
              multiline
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={handlePOSTUserData}
          style={styles.confirmButton}
        >
          <Text style={styles.confirmButtonText}>변경사항 저장</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
