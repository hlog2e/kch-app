import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import OnlyLeftArrowHeader from "../../../components/common/OnlyLeftArrowHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  getUserInfo,
  postRegisterBarCode,
  postRegisterPhoto,
} from "../../../../apis/home/studentID";
import * as ImagePicker from "expo-image-picker";
import mime from "mime";

import * as Haptics from "expo-haptics";

import Barcode from "@kichiyaki/react-native-barcode-generator";
import { BarCodeScanner } from "expo-barcode-scanner";

import WrapBarCodeScanner from "../../../components/common/WrapBarCodeScanner";
import { useTheme } from "@react-navigation/native";

export default function StudentIDScreen({ navigation }) {
  const { colors } = useTheme();
  const { user } = useContext(UserContext);
  const queryClient = useQueryClient();
  const { data: userData } = useQuery("userData", getUserInfo);
  const { mutate: registerBarcodeMutate } = useMutation(postRegisterBarCode);

  const [hasPermission, setHasPermission] = useState(null);
  const [barCodeScannerOpen, setBarCodeScannerOpen] = useState(false);

  useEffect(() => {
    if (user.grade === "teacher") {
      Alert.alert(
        "알림",
        "선생님께서는 학생증 서비스를 이용하실 수 없습니다.",
        [{ text: "확인" }]
      );
      navigation.goBack();
    }
    // 마운트시 바코드 스캐너 카메라 권한 요청
    requestBarCodeScannerPermissions();
  });

  const openBarCodeScanner = () => {
    if (hasPermission) {
      setBarCodeScannerOpen(true);
    } else {
      Alert.alert(
        "오류",
        "카메라 권한이 허용되지 않아서 바코드를 스캔할 수 없어요! 설정에서 카메라 권한을 허용해 주세요.",
        [{ text: "확인" }]
      );
    }
  };
  const requestBarCodeScannerPermissions = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    setBarCodeScannerOpen(false);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    registerBarcodeMutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries("userData");
        Alert.alert("알림", "바코드 등록을 성공하였습니다!", [
          { text: "확인" },
        ]);
      },
    });
  };

  const age = moment().format("YYYY") - user.birthYear + 1;

  const styles = StyleSheet.create({
    container: { flex: 1 },
    card_wrap: {
      marginTop: 10,
      paddingHorizontal: 45,
    },
    title: { fontSize: 16, fontWeight: "700", paddingVertical: 7 },
    card: { borderRadius: 10, borderWidth: 1, borderColor: colors.border },
    image: {
      height: 150,
      backgroundColor: "#001396",
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    name_section: {
      alignItems: "center",
    },
    name: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
    },
    school_name: {
      fontSize: 12,
      fontWeight: "200",
      color: colors.subText,
      marginTop: 4,
    },
    divider: {
      marginHorizontal: 20,
      marginVertical: 15,
      height: 0.4,
      backgroundColor: colors.subText,
    },
    info_section: {
      paddingHorizontal: 25,
    },
    info_row: {
      paddingVertical: 5,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    info_title: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.subText,
    },
    info_text: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },

    logo_row: {
      alignItems: "center",
      paddingVertical: 10,
    },
    logo: {
      height: 45,
      width: 180,
      marginVertical: 10,
      borderRadius: 10,
      backgroundColor: colors.cardBg2,
    },
  });
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <OnlyLeftArrowHeader navigation={navigation} />
      <WrapBarCodeScanner
        barCodeScannerOpen={barCodeScannerOpen}
        handleBarCodeScanned={handleBarCodeScanned}
        setBarCodeScannerOpen={setBarCodeScannerOpen}
      />

      <ScrollView style={styles.card_wrap}>
        <View style={styles.card}>
          <Image
            contentFit={"contain"}
            transition={500}
            style={styles.image}
            source={{ uri: "https://static.kch-app.me/student_id_banner.png" }}
          />
          <Photo userData={userData} />
          <View style={styles.name_section}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.school_name}>청주 금천고등학교</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.info_section}>
            <View style={styles.info_row}>
              <Text style={styles.info_title}>나이</Text>
              <Text style={styles.info_text}>{age}세</Text>
            </View>

            <View style={styles.info_row}>
              <Text
                style={styles.info_title}
                onPress={() => {
                  openBarCodeScanner();
                }}
              >
                유효기간
              </Text>
              <Text style={styles.info_text}>
                {moment()
                  .add(Math.abs(age - 20), "y")
                  .format("YYYY") + "-03-01"}
              </Text>
            </View>
            <BarCodeSection
              userData={userData}
              openBarCodeScanner={openBarCodeScanner}
            />
            <View style={styles.logo_row}>
              <Image
                contentFit={"contain"}
                transition={500}
                style={styles.logo}
                source={require("../../../../assets/images/logo_title.png")}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Photo({ userData }) {
  const [loading, setLoading] = useState(false);

  const { mutate } = useMutation(postRegisterPhoto);
  const queryClient = useQueryClient();

  const formData = new FormData();

  const handleImagePicking = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        allowsMultipleSelection: false,
        quality: 0.3,
      });

      if (!result.canceled) {
        const image = result.assets[0];
        await handlePOSTRegisterPhoto(image);
      }
    } catch (_err) {
      Alert.alert("오류", "이미지를 로드하는 중 오류가 발생하였습니다.", [
        { text: "확인" },
      ]);
    }
  };

  const handlePOSTRegisterPhoto = async (image) => {
    setLoading(true);
    formData.append("image", {
      uri: image.uri,
      name: image.uri.split("/").pop(),
      type: mime.getType(image.uri),
    });

    mutate(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries("userData");
        setLoading(false);
      },
    });
  };

  const styles = StyleSheet.create({
    container: { paddingVertical: 15, alignItems: "center" },
    dummy_image: {
      backgroundColor: "#e4e4e4",
      height: 125,
      width: 100,
      borderRadius: 5,
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 27,
    },
    dummy_desc: {
      fontSize: 10,
      fontWeight: "700",
      color: "gray",
    },
    image: {
      height: 125,
      width: 100,
      borderRadius: 5,
    },
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={[styles.dummy_image, { justifyContent: "center" }]}>
          <ActivityIndicator />
        </View>
      </View>
    );
  }

  // userData === undefinded 일때 처리
  if (!userData) {
    return null;
  }

  return (
    <View style={styles.container}>
      {userData.idPhoto ? (
        <TouchableOpacity onPress={handleImagePicking}>
          <Image
            style={styles.image}
            transition={500}
            source={{ uri: userData.idPhoto }}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.dummy_image}
          onPress={handleImagePicking}
        >
          <Ionicons name="camera" size={30} color="gray" />
          <Text style={styles.dummy_desc}>사진을 등록해주세요</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function BarCodeSection({ userData, openBarCodeScanner }) {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    barcode: { marginTop: 20 },
    text: { fontSize: 10 },

    dummy_barcode_container: { alignItems: "center" },
    dummy_barcode: {
      borderWidth: 1,
      borderColor: colors.border,
      height: 55,
      width: 150,
      borderRadius: 5,
      marginTop: 10,
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 6,
    },
    dummy_text: { fontSize: 10, color: "gray" },
  });
  if (!userData) {
    return null;
  }

  if (userData.barcode) {
    return (
      <Barcode
        style={styles.barcode}
        value={userData.barcode}
        text={userData.barcode}
        textStyle={styles.text}
        format={"CODE39"}
        height={40}
        width={1.2}
      />
    );
  }

  if (!userData.barcode || userData.barcode === "") {
    return (
      <View style={styles.dummy_barcode_container}>
        <TouchableOpacity
          style={styles.dummy_barcode}
          onPress={() => {
            openBarCodeScanner();
          }}
        >
          <Ionicons name="barcode" size={24} color="gray" />
          <Text style={styles.dummy_text}>바코드를 등록해주세요</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
