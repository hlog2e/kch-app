import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import * as Linking from "expo-linking";
import { useTheme } from "@react-navigation/native";
import { useQuery } from "react-query";
import { getNoticeDetail } from "../../apis/school_data/notice";
import moment from "moment";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Simple Header Component for Notice Detail
function NoticeDetailHeader() {
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

export default function NoticeDetailScreen() {
  const { id: noticeId } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();

  const { data }: { data: any } = useQuery("NoticeDetail", () =>
    getNoticeDetail({ noticeId: noticeId as string })
  );

  const styles = StyleSheet.create({
    container: { flex: 1 },

    header: { marginLeft: 14, marginTop: 16 },

    title: { fontSize: 22, fontWeight: "700", color: colors.text },
    teacherAndDate: { fontWeight: "300", color: colors.subText, marginTop: 2 },

    buttonWrap: { marginTop: 12, paddingVertical: 12 },
    button: {
      height: 45,
      width: 90,
      padding: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 15,
      marginRight: 10,
    },
    buttonText: { fontSize: 14, fontWeight: "700", color: colors.subText },
    buttonInfoText: {
      marginTop: 4,
      fontSize: 12,
      fontWeight: "200",
      color: colors.subText,
    },

    contentTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginTop: 12,
    },
    webviewWrap: {
      flex: 1,

      borderWidth: 1,
      borderRadius: 14,
      borderColor: colors.border,
    },
    webview: { flex: 1, borderRadius: 10, margin: 6 },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <NoticeDetailHeader />
      <View style={styles.header}>
        <Text style={styles.title}>{data?.title}</Text>
        <Text style={styles.teacherAndDate}>
          {moment(data?.createdAt).format("YYYY-MM-DD")} | {data?.teacher}
        </Text>

        <View style={styles.buttonWrap}>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(data?.url || "");
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>원본 보기</Text>
          </TouchableOpacity>
          <Text style={styles.buttonInfoText}>
            첨부파일 다운로드는 원본 보기를 통해 가능합니다:)
          </Text>
        </View>

        <Text style={styles.contentTitle}>내용</Text>
      </View>

      <WebView
        style={styles.webview}
        onShouldStartLoadWithRequest={({ url }) => {
          if (url !== "about:blank") {
            Linking.openURL(url);
            return false;
          }
          return true;
        }}
        source={{ html: data?.html || "" }}
      />
    </SafeAreaView>
  );
}
