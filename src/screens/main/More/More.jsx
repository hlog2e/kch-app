import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EvilIcons, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";
import { UserContext } from "../../../../context/UserContext";
import * as SMS from "expo-sms";
import moment from "moment";
import * as Device from "expo-device";
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";

export default function MoreScreen({ navigation }) {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = async () => {
    Alert.alert("알림", "로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "확인",
        onPress: async () => {
          await AsyncStorage.removeItem("user");
          await AsyncStorage.removeItem("token");
          setUser(null);
          navigation.push("Auth");
        },
      },
    ]);
  };

  const handleSendSMS = async (_type) => {
    const smsIsAvailable = await SMS.isAvailableAsync();

    let message = "";
    const bugTemplate = `[Bug Report]
timestamp: ${moment().format("YYYY-MM-DD-HH-mm:ss.SSS")}
User ID: ${user._id}
Device: ${Device.modelName}
OS: ${Device.osName}
OS Version: ${Device.osVersion} 
iOS Model ID: ${Device.modelId}

[버그내용]

(해당부분을 지우고 오류가 발생한 것을 자세히 설명해주세요... 버그가 발생한 부분의 스크린샷도 첨부해주시면 감사하겠습니다.)`;
    const ideaTemplate = `[의견제출]

`;

    if (_type === "bug") {
      message = bugTemplate;
    }

    if (_type === "idea") {
      message = ideaTemplate;
    }

    if (smsIsAvailable) {
      await SMS.sendSMSAsync(["01095645490"], message, {});
    } else {
      alert("디바이스가 문자메세지를 전송할 수 없는 상태입니다.");
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    card: {
      backgroundColor: "white",
      marginHorizontal: 20,
      marginTop: 50,
      borderRadius: 15,
      paddingVertical: 20,
      paddingHorizontal: 15,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    icon: { height: 52, width: 52 },
    name: {
      fontSize: 18,
      fontWeight: "700",
    },
    personal_info: {
      fontSize: 12,
      fontWeight: "300",
      color: "gray",
      marginTop: 4,
    },
    button_box: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 5,
      marginTop: 15,
      paddingHorizontal: 10,
    },
    button: {
      height: 65,
      width: 80,
      borderRadius: 13,
      paddingVertical: 10,
      backgroundColor: "#f2f2f2",
      alignItems: "center",
      justifyContent: "space-between",
    },
    button_text: {
      fontSize: 11,
      color: "gray",
    },
  });
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.card}>
          <View style={styles.header}>
            <View>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.personal_info}>
                {user.grade}학년 {user.class}반
              </Text>
            </View>
            <Image
              style={styles.icon}
              source={require("../../../../assets/adaptive-icon.png")}
            />
          </View>

          <View style={styles.button_box}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                handleSendSMS("idea");
              }}
            >
              <Ionicons name="bulb-outline" size={24} color="gray" />
              <Text style={[styles.button_text]}>의견제출</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                handleSendSMS("bug");
              }}
            >
              <Ionicons name="bug-outline" size={24} color="gray" />
              <Text style={[styles.button_text]}>버그·오류 신고</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
              <Ionicons name="exit-outline" size={24} color="#CF5858" />
              <Text style={[styles.button_text, { color: "#CF5858" }]}>
                로그아웃
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ListButtonSection />
      </ScrollView>
    </SafeAreaView>
  );
}

function ListButtonSection() {
  const buttons = [
    {
      name: "개발자 정보",
      onPress: () => {
        console.log("test");
      },
      right: <EvilIcons name="chevron-right" size={34} color="#d4d4d4" />,
    },
    {
      name: "금천고를 빛낸 사람들",
      onPress: () => {
        console.log("test");
      },
      right: <EvilIcons name="chevron-right" size={34} color="#d4d4d4" />,
    },
    { name: "margin" },
    {
      name: "개인정보 처리방침",
      onPress: async () => {
        await WebBrowser.openBrowserAsync(
          "https://static.kch-app.me/privacy.html"
        );
      },
      right: <EvilIcons name="chevron-right" size={34} color="#d4d4d4" />,
    },
    {
      name: "오픈소스",
      onPress: async () => {
        await WebBrowser.openBrowserAsync("https://github.com/hlog2e/kch-app");
      },
      right: <EvilIcons name="chevron-right" size={34} color="#d4d4d4" />,
    },
    { name: "margin" },
    {
      name: "앱 버전",
      onPress: () => {
        alert(`현재 앱 버전은 v.${Constants.manifest.apiServer} 입니다.`);
      },
      right: (
        <Text style={{ fontSize: 10, color: "gray" }}>
          v.{Constants.manifest.version}
        </Text>
      ),
    },
  ];
  const styles = StyleSheet.create({
    container: { marginTop: 40 },
    button: {
      backgroundColor: "white",
      height: 45,
      borderTopWidth: 0.2,
      borderColor: "#e9e9e9",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 15,
    },
    button_text: { fontWeight: "600" },
    margin: { height: 8 },
  });
  return (
    <View style={styles.container}>
      {buttons.map(({ name, right, onPress }) => {
        if (name === "margin") {
          return <View style={styles.margin} />;
        }
        return (
          <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.button_text}>{name}</Text>
            {right}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
