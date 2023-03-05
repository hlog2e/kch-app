import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
  useColorScheme,
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
import { getExpoPushTokenAsync } from "expo-notifications";
import { unRegisterPushTokenToDB } from "../../../../apis/push-noti";
import { useMutation } from "react-query";
import { postResetBlockedUsers } from "../../../../apis/more/more";

export default function MoreScreen({ navigation }) {
  const NowColorState = useColorScheme();
  const { user, setUser } = useContext(UserContext);

  const handleLogout = async () => {
    const removePushTokenOnDB = async () => {
      const { data: pushToken } = await getExpoPushTokenAsync();
      await unRegisterPushTokenToDB(pushToken);
    };

    Alert.alert("알림", "로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "확인",
        onPress: async () => {
          try {
            // 실제 디바이스 경우 푸시 토큰을 DB에서 지우는 로직
            if (Device.isDevice) {
              await removePushTokenOnDB();
            }
            await AsyncStorage.removeItem("user");
            await AsyncStorage.removeItem("token");
            setUser(null);
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
    container: {
      flex: 1,
    },
    card: {
      backgroundColor: NowColorState === "light" ? "white" : "#2c2c36",
      marginHorizontal: 25,
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
    icon: { height: 38, width: 38 },
    name: {
      fontSize: 18,
      fontWeight: "700",
      color: NowColorState === "light" ? "black" : "white",
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
      backgroundColor: NowColorState === "light" ? "#f2f2f2" : "#18171c",
      alignItems: "center",
      justifyContent: "space-between",
    },
    button_text: {
      fontSize: 11,
      color: NowColorState === "light" ? "#334155" : "white",
    },
  });
  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <ScrollView>
        <View style={styles.card}>
          <View style={styles.header}>
            <View>
              <Text style={styles.name}>{user.name}</Text>
              {user.grade === "teacher" ? (
                <Text style={styles.personal_info}>
                  자랑스러운 금천고 선생님
                </Text>
              ) : (
                <Text style={styles.personal_info}>
                  {user.grade}학년 {user.class}반
                </Text>
              )}
            </View>
            <Image
              style={styles.icon}
              source={require("../../../../assets/images/kch-icon.png")}
            />
          </View>

          <View style={styles.button_box}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                navigation.push("NotificationSettingScreen");
              }}
            >
              <Ionicons
                name="md-notifications-outline"
                size={24}
                color={NowColorState === "light" ? "#334155" : "white"}
              />
              <Text style={[styles.button_text]}>알림 설정</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                if (user.grade === "teacher") {
                  Alert.alert(
                    "알림",
                    "선생님이 학생으로 돌아가시는건 불가능한 일 입니다.",
                    [{ text: "확인" }]
                  );
                } else {
                  navigation.push("ModifyUserInfoScreen");
                }
              }}
            >
              <Ionicons
                name="person-circle-outline"
                size={24}
                color={NowColorState === "light" ? "#334155" : "white"}
              />
              <Text style={[styles.button_text]}>내 정보 수정</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
              <Ionicons name="exit-outline" size={24} color="#CF5858" />
              <Text style={[styles.button_text, { color: "#CF5858" }]}>
                로그아웃
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ListButtonSection navigation={navigation} user={user} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ListButtonSection({ navigation, user }) {
  const { mutate: resetBlockedUsersMutate } = useMutation(
    postResetBlockedUsers
  );

  const NowColorState = useColorScheme();
  const buttons = [
    {
      id: 0,
      name: "내가 작성한 글",
      onPress: () => {
        navigation.push("CommunitiesWrittenByMeScreen");
      },
      right: <EvilIcons name="chevron-right" size={34} color="#d4d4d4" />,
    },
    {
      id: 1,
      name: "차단한 사용자 초기화",
      onPress: () => {
        Alert.alert(
          "경고",
          "초기화를 하게 되면 지금까지 차단한 사용자 모두가 차단 해제 처리됩니다.",
          [
            { text: "취소", style: "cancel" },
            {
              text: "확인",
              onPress: () => {
                resetBlockedUsersMutate(
                  {},
                  {
                    onSuccess: (_data) => {
                      Alert.alert("알림", _data.message);
                    },
                  }
                );
              },
            },
          ]
        );
      },
      right: <Ionicons name="ios-refresh-outline" size={22} color="#d4d4d4" />,
    },
    { id: 2, name: "margin" },
    {
      id: 3,
      name: "개발자 정보",
      onPress: () => {
        navigation.push("DeveloperDetailScreen");
      },
      right: <EvilIcons name="chevron-right" size={34} color="#d4d4d4" />,
    },
    {
      id: 4,
      name: "제 34기 학생회",
      onPress: () => {
        navigation.push("StudentCouncilScreen");
      },
      right: <EvilIcons name="chevron-right" size={34} color="#d4d4d4" />,
    },
    { id: 5, name: "margin" },
    {
      id: 6,
      name: "의견 제출",
      onPress: () => {
        handleSendSMS("idea");
      },
      right: <EvilIcons name="chevron-right" size={34} color="#d4d4d4" />,
    },
    {
      id: 7,
      name: "버그·오류 신고",
      onPress: () => {
        handleSendSMS("bug");
      },
      right: <EvilIcons name="chevron-right" size={34} color="#d4d4d4" />,
    },

    { id: 8, name: "margin" },
    {
      id: 9,
      name: "개인정보 처리방침",
      onPress: async () => {
        await WebBrowser.openBrowserAsync(
          "https://static.kch-app.me/privacy.html"
        );
      },
      right: <EvilIcons name="chevron-right" size={34} color="#d4d4d4" />,
    },
    {
      id: 10,
      name: "이용약관",
      onPress: async () => {
        await WebBrowser.openBrowserAsync("https://terms.kch-app.me");
      },
      right: <EvilIcons name="chevron-right" size={34} color="#d4d4d4" />,
    },
    {
      id: 11,
      name: "오픈소스",
      onPress: async () => {
        await WebBrowser.openBrowserAsync("https://github.com/hlog2e/kch-app");
      },
      right: <EvilIcons name="chevron-right" size={34} color="#d4d4d4" />,
    },
    {
      id: 12,
      name: "앱 버전",
      onPress: () => {
        Alert.alert(
          "알림",
          `현재 앱 버전은 v.${Constants.expoConfig.version} 입니다.`,
          [{ text: "확인" }]
        );
      },
      right: (
        <Text style={{ fontSize: 10, color: "gray" }}>
          v.{Constants.expoConfig.version}
        </Text>
      ),
    },
  ];

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
      Alert.alert("오류", "디바이스가 SMS를 전송할 수 없는 상태입니다.", [
        { text: "확인" },
      ]);
    }
  };

  const styles = StyleSheet.create({
    container: { marginTop: 40 },
    button: {
      backgroundColor: NowColorState === "light" ? "white" : "#2c2c36",
      height: 45,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 15,
    },
    button_text: {
      fontWeight: "600",
      color: NowColorState === "light" ? "black" : "white",
    },
    margin: { height: 8 },
  });
  return (
    <View style={styles.container}>
      {buttons.map(({ id, name, right, onPress }) => {
        if (name === "margin") {
          return <View key={id} style={styles.margin} />;
        }
        return (
          <TouchableOpacity key={id} style={styles.button} onPress={onPress}>
            <Text style={styles.button_text}>{name}</Text>
            {right}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
