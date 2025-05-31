import { View, Alert, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../../../../../context/UserContext";
import { Image } from "expo-image";
import Constants from "expo-constants";
import * as Linking from "expo-linking";

export default function FooterSection({ navigation }) {
  const { logout } = useUser();
  const { colors } = useTheme();

  const handleLogout = async () => {
    Alert.alert("알림", "로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "확인",
        onPress: async () => {
          try {
            await logout();
            navigation.push("Auth");
          } catch (_err) {
            Alert.alert(
              "오류",
              "로그아웃을 실패하였습니다. 일시적인 네트워크 오류일 수 있으니, 잠시 후 다시 시도해주세요",
              [{ text: "확인" }]
            );
            console.log(_err);
          }
        },
      },
    ]);
  };

  const styles = StyleSheet.create({
    wrap: { marginTop: 30 },

    buttonWrap: { marginTop: 12 },
    button: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    buttonLeftWrap: { flexDirection: "row", alignItems: "center" },
    buttonText: {
      fontWeight: "600",
      fontSize: 16,
      marginLeft: 10,
      color: colors.red,
    },

    infoWrap: { alignItems: "center", marginTop: 40 },
    logo: { width: 40, height: 40, marginBottom: 8 },
    infoText: {
      fontSize: 12,
      marginTop: 4,
      fontWeight: "200",

      color: colors.subText,
    },
  });
  return (
    <View style={styles.wrap}>
      <TouchableOpacity onPress={handleLogout} style={styles.button}>
        <View style={styles.buttonLeftWrap}>
          <Ionicons name="log-out-outline" size={26} color={colors.red} />
          <Text style={styles.buttonText}>로그아웃</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.infoWrap}>
        <Image
          style={styles.logo}
          source={require("../../../../../assets/svgs/gray_logo.svg")}
        />
        <Text style={styles.infoText}>ⓒ 금천고등학교 | 개발자:김홍록</Text>
        <Text style={styles.infoText}>
          Version {Constants.expoConfig.version}
        </Text>
        <TouchableOpacity
          onPress={() => Linking.openURL("https://github.com/hlog2e/kch-app")}
        >
          <Text style={styles.infoText}>Github</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
