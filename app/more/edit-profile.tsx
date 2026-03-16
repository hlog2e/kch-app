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
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
      paddingHorizontal: 16,
      marginBottom: 6,
    },
    backButton: {
      width: 40,
      alignItems: "flex-start",
    },
    title: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.text,
    },
    spacer: {
      width: 40,
    },
  });

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={28} color={colors.text} />
      </TouchableOpacity>
      <Text style={styles.title}>프로필 수정</Text>
      <View style={styles.spacer} />
    </View>
  );
}

interface InputData {
  name: string | null;
  desc: string | null;
}

export default function EditUserProfileScreen() {
  const { user, update } = useUser();
  const alert = useAlert();
  const { colors } = useTheme();
  const router = useRouter();

  const isVerified =
    user?.type === "undergraduate" ||
    user?.type === "graduate" ||
    user?.type === "teacher";

  const [inputData, setInputData] = useState<InputData>({
    name: null,
    desc: null,
  });
  const { mutate: photoMutate } = useMutation<unknown, unknown, FormData>({
    mutationFn: postRegisterProfilePhoto,
  });
  const { mutate: deletePhotoMutate } = useMutation<unknown, unknown, void>({
    mutationFn: deleteProfilePhoto,
  });
  const { mutate: profileMutate } = useMutation<
    unknown,
    unknown,
    { name: string; desc: string }
  >({ mutationFn: postEditUserProfile });

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
        queryClient.invalidateQueries({ queryKey: ["UserData"] });
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
      onSuccess: async () => {
        queryClient.invalidateQueries({ queryKey: ["UserData"] });
        if (user) {
          await update({ user: { ...user, profilePhoto: undefined } });
        }
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
      onSuccess: async () => {
        queryClient.invalidateQueries({ queryKey: ["UserData"] });
        if (user) {
          await update({ user: { ...user, ...dataToSubmit } });
        }
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
      paddingHorizontal: 20,
    },

    photoWrap: { alignItems: "center", marginTop: 10 },
    photoContainer: { position: "relative" as const },
    photo: { width: 100, height: 100, borderRadius: 50 },
    photoPlaceholder: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.cardBg2,
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },
    removeButton: {
      position: "absolute" as const,
      top: 0,
      right: 0,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: "rgba(0,0,0,0.55)",
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },
    photoInfo: { fontSize: 12, marginTop: 6, color: colors.subText },

    formSection: { marginTop: 30 },
    inputWrap: { marginTop: 20 },
    inputLabel: { fontSize: 14, fontWeight: "600", color: colors.subText },
    disabledNotice: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      marginTop: 6,
      gap: 4,
    },
    disabledNoticeText: {
      fontSize: 12,
      color: colors.subText,
    },
    textInput: {
      padding: 14,
      marginTop: 8,
      backgroundColor: colors.cardBg2,
      borderRadius: 12,
      fontSize: 15,
      color: colors.text,
    },
    textInputDisabled: {
      padding: 14,
      marginTop: 8,
      backgroundColor: colors.cardBg2,
      borderRadius: 12,
      fontSize: 15,
      color: colors.subText,
      opacity: 0.6,
    },
    textInputMultiline: {
      padding: 14,
      marginTop: 8,
      backgroundColor: colors.cardBg2,
      borderRadius: 12,
      fontSize: 15,
      color: colors.text,
      minHeight: 80,
      textAlignVertical: "top" as const,
    },

    confirmButton: {
      height: 52,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.blue,
      borderRadius: 14,
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
          <View style={styles.photoWrap}>
            <TouchableOpacity
              onPress={handleImagePicking}
              style={styles.photoContainer}
            >
              {user?.profilePhoto ? (
                <Image
                  style={styles.photo}
                  source={user.profilePhoto}
                />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Ionicons name="person" size={44} color={colors.subText} />
                </View>
              )}
              {user?.profilePhoto && (
                <TouchableOpacity
                  onPress={handleDeleteProfilePhoto}
                  style={styles.removeButton}
                >
                  <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
            <Text style={styles.photoInfo}>탭해서 프로필 이미지 변경</Text>
          </View>

          <View style={styles.formSection}>
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>이름</Text>
              <TextInput
                value={inputData.name || ""}
                onChangeText={(value) =>
                  setInputData((prev) => ({ ...prev, name: value }))
                }
                style={isVerified ? styles.textInputDisabled : styles.textInput}
                placeholder="이름"
                placeholderTextColor={colors.subText}
                editable={!isVerified}
              />
              {isVerified && (
                <View style={styles.disabledNotice}>
                  <Ionicons
                    name="lock-closed"
                    size={14}
                    color={colors.subText}
                  />
                  <Text style={styles.disabledNoticeText}>
                    인증된 회원의 이름은 문의하기를 통해 변경할 수 있어요
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>자기소개</Text>
              <TextInput
                value={inputData.desc || ""}
                onChangeText={(value) =>
                  setInputData((prev) => ({ ...prev, desc: value }))
                }
                style={styles.textInputMultiline}
                placeholder="자기소개"
                placeholderTextColor={colors.subText}
                multiline
              />
            </View>
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
