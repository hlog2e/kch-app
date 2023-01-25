import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import OnlyLeftArrowHeader from "../../../components/common/OnlyLeftArrowHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  getUserInfo,
  postRegisterPhoto,
} from "../../../../apis/home/studentID";
import * as ImagePicker from "expo-image-picker";
import mime from "mime";
import FullScreenLoader from "../../../components/common/FullScreenLoader";

export default function StudentIDScreen({ navigation }) {
  const { user } = useContext(UserContext);
  const { data: userData } = useQuery("userData", getUserInfo);

  useEffect(() => {
    if (user.grade === "teacher") {
      alert("선생님께서는 학생증 서비스를 이용하실 수 없습니다.");
      navigation.goBack();
    }
  });

  const styles = StyleSheet.create({
    container: { flex: 1 },
    card_wrap: {
      marginTop: 10,
      paddingHorizontal: 45,
    },
    title: { fontSize: 16, fontWeight: "700", paddingVertical: 7 },
    card: { backgroundColor: "white", borderRadius: 10 },
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
    },
    school_name: {
      fontSize: 12,
      fontWeight: "200",
      color: "gray",
      marginTop: 4,
    },
    divider: {
      marginHorizontal: 20,
      marginVertical: 15,
      height: 0.4,
      backgroundColor: "#c4c4c4",
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
      color: "gray",
    },
    info_text: {
      fontSize: 14,
      fontWeight: "600",
    },
    logo_row: {
      justifyContent: "center",
      paddingVertical: 10,
    },
    logo: { height: 40, marginVertical: 10 },
  });
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <OnlyLeftArrowHeader navigation={navigation} />

      <ScrollView style={styles.card_wrap}>
        <View style={styles.card}>
          <Image
            resizeMode={"contain"}
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
              <Text style={styles.info_text}>
                {user.grade === "1" ? "17" : null}
                {user.grade === "2" ? "18" : null}
                {user.grade === "3" ? "19" : null}세
              </Text>
            </View>
            <View style={styles.info_row}>
              <Text style={styles.info_title}>학년</Text>
              <Text style={styles.info_text}>{user.grade}학년</Text>
            </View>
            <View style={styles.info_row}>
              <Text style={styles.info_title}>반</Text>
              <Text style={styles.info_text}>{user.class}반</Text>
            </View>
            <View style={styles.info_row}>
              <Text style={styles.info_title}>번호</Text>
              <Text style={styles.info_text}>{user.number}번</Text>
            </View>
            <View style={styles.info_row}>
              <Text style={styles.info_title}>유효기간</Text>
              <Text style={styles.info_text}>
                {moment().add("1", "y").format("YYYY") + "-03-01"}
              </Text>
            </View>
            <View style={styles.logo_row}>
              <Image
                resizeMode={"contain"}
                style={styles.logo}
                source={{ uri: "https://static.kch-app.me/logo_title.jpeg" }}
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
      } else {
        console.log("이미지 선택 취소");
      }
    } catch (_err) {
      alert("이미지를 로드하는 중 오류가 발생하였습니다.");
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
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.dummy_image}
          onPress={handleImagePicking}
        >
          <Ionicons name="camera" size={30} color="gray" />
          <Text style={styles.dummy_desc}>사진을 등록해주세요</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {userData.photo ? (
        <TouchableOpacity onPress={handleImagePicking}>
          <Image style={styles.image} source={{ uri: userData.photo }} />
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
