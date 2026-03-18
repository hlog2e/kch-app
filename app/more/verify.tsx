import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  BackHandler,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import mime from "mime";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useAlert } from "../../context/AlertContext";
import { useUser } from "../../context/UserContext";
import { postVerificationRequest } from "../../apis/user/verify";
import SegmentedControl from "../../src/components/common/SegmentedControl";
import Dropdown, { DropdownItem } from "../../src/components/common/Dropdown";

type VerifyType = "undergraduate" | "teacher" | "graduate";

const VERIFY_OPTIONS = ["학생", "선생님", "졸업생"];
const VERIFY_TYPES: VerifyType[] = ["undergraduate", "teacher", "graduate"];

function VerifyHeader({ onBack }: { onBack: () => void }) {
  const { colors } = useTheme();

  return (
    <View style={headerStyles.header}>
      <TouchableOpacity style={headerStyles.backButton} onPress={onBack}>
        <Ionicons name="chevron-back" size={30} color={colors.text} />
        <Text style={[headerStyles.backButtonText, { color: colors.text }]}>
          뒤로
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const headerStyles = StyleSheet.create({
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
  },
});

export default function VerifyScreen() {
  const { colors, dark } = useTheme();
  const alert = useAlert();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const scrollRef = useRef<ScrollView>(null);

  // progress: 현재까지 진행된 단계 수 (0=타입만, 1=+출생연도/서류, 2=+서류)
  const [progress, setProgress] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [birthYear, setBirthYear] = useState<string | null>(null);
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const verifyType = VERIFY_TYPES[selectedIndex];
  const isTeacher = verifyType === "teacher";

  // 현재 보이는 단계 판별
  const showBirthYear = !isTeacher && progress >= 1;
  const showDocument = isTeacher ? progress >= 1 : progress >= 2;

  const thisYear = moment().format("YYYY");
  const [yearArray, setYearArray] = useState<DropdownItem<string>[]>([]);

  useEffect(() => {
    const arr: DropdownItem<string>[] = [];
    for (let i = parseInt(thisYear); i >= 1900; i--) {
      arr.push({ label: String(i), value: String(i) });
    }
    setYearArray(arr);
  }, [thisYear]);

  // progress 올라갈 때 스크롤 하단으로
  useEffect(() => {
    if (progress > 0) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [progress]);

  // Android 하드웨어 뒤로가기 처리
  useEffect(() => {
    const handler = BackHandler.addEventListener("hardwareBackPress", () => {
      handleBack();
      return true;
    });
    return () => handler.remove();
  }, [progress]);

  const handleBack = () => {
    if (progress === 0) {
      router.back();
    } else {
      setProgress(progress - 1);
    }
  };

  const handleNext = () => {
    if (showDocument) {
      handleSubmit();
    } else {
      setProgress(progress + 1);
    }
  };

  const { mutate, isPending } = useMutation<unknown, unknown, FormData>({
    mutationFn: postVerificationRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["UserData"] });
      alert.success(
        "인증 요청이 제출되었습니다. 관리자 확인 후 인증이 완료됩니다.",
      );
      router.back();
    },
    onError: (error: any) => {
      alert.error(
        error?.response?.data?.message || "인증 요청 중 오류가 발생하였습니다.",
      );
    },
  });

  const convertToJpeg = async (
    asset: ImagePicker.ImagePickerAsset,
  ): Promise<ImagePicker.ImagePickerAsset> => {
    const uri = asset.uri.toLowerCase();
    if (uri.endsWith(".heic") || uri.endsWith(".heif")) {
      const imageRef = await ImageManipulator.manipulate(asset.uri).renderAsync();
      const result = await imageRef.saveAsync({ format: SaveFormat.JPEG, compress: 0.8 });
      return { ...asset, uri: result.uri };
    }
    return asset;
  };

  const handleImagePicking = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        allowsMultipleSelection: false,
        quality: 0.5,
      });
      if (!result.canceled) {
        const converted = await convertToJpeg(result.assets[0]);
        setImage(converted);
      }
    } catch (_err) {
      alert.error("이미지를 로드하는 중 오류가 발생하였습니다.");
    }
  };

  const handleSubmit = () => {
    if (!image) {
      alert.error("인증 서류 사진을 선택해주세요.");
      return;
    }

    const needYear = verifyType !== "teacher";

    const formData = new FormData();
    formData.append("type", verifyType);
    formData.append("name", user?.name ?? "");
    if (needYear && birthYear) {
      formData.append("birthYear", birthYear);
    }
    formData.append("image", {
      uri: image.uri,
      name: image.uri.split("/").pop(),
      type: mime.getType(image.uri),
    } as any);

    alert.loading("");
    mutate(formData);
  };

  const isNextDisabled = () => {
    if (showDocument) return !image || isPending;
    if (showBirthYear) return !birthYear;
    return false;
  };

  const getButtonLabel = () => {
    return showDocument ? "인증 요청하기" : "다음";
  };

  // 타입 변경 시 이후 스텝 리셋
  const handleTypeChange = (index: number) => {
    setSelectedIndex(index);
    setProgress(1);
    setBirthYear(null);
    setImage(null);
  };

  const getDocumentHint = (): { title: string; description: string } => {
    switch (verifyType) {
      case "undergraduate":
        return {
          title: "학생증, 재학증명서 등",
          description:
            "금천고등학교 재학생임을 확인할 수 있는 사진이면 무엇이든 가능합니다.",
        };
      case "teacher":
        return {
          title: "NEIS 화면, 공무원증 등",
          description:
            "금천고등학교 선생님임을 확인할 수 있는 사진이면 무엇이든 가능합니다.",
        };
      case "graduate":
        return {
          title: "졸업장, 졸업 사진 등",
          description:
            "금천고등학교 졸업생임을 확인할 수 있는 사진이면 무엇이든 가능합니다.",
        };
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginTop: 2,
    },
    sectionSubtitle: {
      fontSize: 14,
      color: (colors as any).subText,
    },
    firstTitleWrap: { marginTop: 32 },
    stepTitleWrap: { marginTop: 40 },
    inputArea: { marginTop: 20 },
    imagePicker: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      borderStyle: "dashed",
      alignItems: "center",
      justifyContent: "center",
      height: 180,
      overflow: "hidden",
    },
    imagePickerText: {
      fontSize: 14,
      color: (colors as any).subText,
      marginTop: 8,
    },
    previewImage: {
      width: "100%",
      height: "100%",
      borderRadius: 14,
    },
    hintBox: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
      borderRadius: 12,
      padding: 12,
      gap: 10,
      marginTop: 12,
    },
    hintTextArea: {
      flex: 1,
    },
    hintTitle: {
      fontSize: 13,
      fontWeight: "700",
      color: (colors as any).subText,
    },
    hintDescription: {
      fontSize: 12,
      fontWeight: "400",
      color: (colors as any).subText,
      marginTop: 4,
      lineHeight: 18,
    },
    infoText: {
      fontSize: 13,
      color: (colors as any).subText,
      marginTop: 16,
      textAlign: "center",
    },
    bottomArea: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    nextButton: {
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: (colors as any).blue,
      borderRadius: 15,
    },
    nextButtonDisabled: {
      opacity: 0.5,
    },
    nextButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "700",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <VerifyHeader onBack={handleBack} />

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Step 1: 타입 선택 (항상 표시) */}
        <Animated.View
          entering={FadeInUp.duration(400)}
          style={styles.firstTitleWrap}
        >
          <Text style={styles.sectionSubtitle}>금천인 인증</Text>
          <Text style={styles.sectionTitle}>어떤 유형으로 인증하시겠어요?</Text>
        </Animated.View>
        <Animated.View
          entering={FadeInUp.duration(400).delay(150)}
          style={styles.inputArea}
        >
          <SegmentedControl
            options={VERIFY_OPTIONS}
            selectedIndex={selectedIndex}
            onSelect={handleTypeChange}
          />
        </Animated.View>

        {/* Step 2: 출생연도 (학생/졸업생만) */}
        {showBirthYear && (
          <>
            <Animated.View
              entering={FadeInUp.duration(400)}
              style={styles.stepTitleWrap}
            >
              <Text style={styles.sectionTitle}>출생연도를 선택해주세요</Text>
            </Animated.View>
            <Animated.View
              entering={FadeInUp.duration(400).delay(150)}
              style={styles.inputArea}
            >
              <Dropdown
                items={yearArray}
                value={birthYear}
                onValueChange={(value) => setBirthYear(value)}
                placeholder="출생연도를 선택해주세요"
                modalTitle="출생연도 선택"
              />
            </Animated.View>
          </>
        )}

        {/* Step 3: 서류 업로드 */}
        {showDocument && (
          <>
            <Animated.View
              entering={FadeInUp.duration(400)}
              style={styles.stepTitleWrap}
            >
              <Text style={styles.sectionTitle}>인증 서류를 첨부해주세요</Text>
            </Animated.View>
            <Animated.View
              entering={FadeInUp.duration(400).delay(150)}
              style={styles.inputArea}
            >
              <TouchableOpacity
                onPress={handleImagePicking}
                style={styles.imagePicker}
              >
                {image ? (
                  <Image
                    source={{ uri: image.uri }}
                    style={styles.previewImage}
                    contentFit="contain"
                  />
                ) : (
                  <>
                    <Ionicons
                      name="camera-outline"
                      size={32}
                      color={(colors as any).subText}
                    />
                    <Text style={styles.imagePickerText}>인증 서류 선택</Text>
                  </>
                )}
              </TouchableOpacity>

              <View style={styles.hintBox}>
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color={(colors as any).subText}
                />
                <View style={styles.hintTextArea}>
                  <Text style={styles.hintTitle}>
                    {getDocumentHint().title}
                  </Text>
                  <Text style={styles.hintDescription}>
                    {getDocumentHint().description}
                  </Text>
                </View>
              </View>
              <Text style={styles.infoText}>
                관리자 확인 후 인증이 완료됩니다
              </Text>
            </Animated.View>
          </>
        )}
      </ScrollView>

      <View style={styles.bottomArea}>
        <TouchableOpacity
          onPress={handleNext}
          style={[
            styles.nextButton,
            isNextDisabled() && styles.nextButtonDisabled,
          ]}
          disabled={isNextDisabled()}
        >
          <Text style={styles.nextButtonText}>{getButtonLabel()}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
