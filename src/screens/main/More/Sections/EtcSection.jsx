import { useTheme } from "@react-navigation/native";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as SMS from "expo-sms";
import * as Device from "expo-device";
import * as WebBrowser from "expo-web-browser";
import moment from "moment";

import { useUser } from "../../../../../context/UserContext";

export default function EtcSection({ navigation }) {
  const { colors } = useTheme();
  const { user } = useUser();

  const handleSendSMS = async () => {
    const smsIsAvailable = await SMS.isAvailableAsync();

    const bugTemplate = `[Bug Report]
timestamp: ${moment().format("YYYY-MM-DD-HH-mm:ss.SSS")}
User ID: ${user._id}
Device: ${Device.modelName}
OS: ${Device.osName}
OS Version: ${Device.osVersion} 
iOS Model ID: ${Device.modelId}
  
[버그내용]
  
(해당부분을 지우고 오류가 발생한 것을 자세히 설명해주세요... 버그가 발생한 부분의 스크린샷도 첨부해주시면 감사하겠습니다.)`;

    if (smsIsAvailable) {
      await SMS.sendSMSAsync(["01095645490"], bugTemplate, {});
    } else {
      Alert.alert("오류", "디바이스가 SMS를 전송할 수 없는 상태입니다.", [
        { text: "확인" },
      ]);
    }
  };

  const styles = StyleSheet.create({
    wrap: { marginTop: 20 },
    sectionTitle: { fontSize: 12, color: colors.subText },

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
      color: colors.text,
    },
  });
  return (
    <View style={styles.wrap}>
      <Text style={styles.sectionTitle}>기타</Text>

      <View style={styles.buttonWrap}>
        <TouchableOpacity onPress={() => handleSendSMS()} style={styles.button}>
          <View style={styles.buttonLeftWrap}>
            <Ionicons name="bug-outline" size={26} color={colors.subText} />
            <Text style={styles.buttonText}>버그(오류) 신고</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.subText} />
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => navigation.push("DeveloperDetailScreen")}
          style={styles.button}
        >
          <View style={styles.buttonLeftWrap}>
            <Ionicons
              name="code-slash-outline"
              size={26}
              color={colors.subText}
            />
            <Text style={styles.buttonText}>개발자 정보</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.subText} />
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={async () => {
            await WebBrowser.openBrowserAsync(
              "https://static.kch-app.me/privacy.html"
            );
          }}
          style={styles.button}
        >
          <View style={styles.buttonLeftWrap}>
            <Ionicons
              name="ios-lock-closed-outline"
              size={26}
              color={colors.subText}
            />
            <Text style={styles.buttonText}>개인정보 처리방침</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.subText} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            await WebBrowser.openBrowserAsync("https://terms.kch-app.me");
          }}
          style={styles.button}
        >
          <View style={styles.buttonLeftWrap}>
            <Ionicons
              name="document-text-outline"
              size={26}
              color={colors.subText}
            />
            <Text style={styles.buttonText}>이용약관</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.subText} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
