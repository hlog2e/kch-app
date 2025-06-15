import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useTheme } from "@react-navigation/native";

import { SafeAreaView } from "react-native-safe-area-context";
import moment from "moment";

import { useQuery } from "react-query";
import { getCommunityDetail } from "../../apis/community/index";
import FullScreenLoader from "../../src/components/Overlay/FullScreenLoader";
import { useUser } from "../../context/UserContext";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

import Hyperlink from "react-native-hyperlink";
import Header from "../../src/components/Header/Header";
import HorizontalScrollImageView from "../../src/components/Image/HorizontalScrollImageView";
import Comment from "../../src/components/community/Detail/Comment";
import InteractionButtons from "../../src/components/community/Detail/InteractionButtons";
import CommentInput from "../../src/components/community/Detail/CommentInput";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function CommunityDetailScreen() {
  const { colors } = useTheme();
  const { id: communityId } = useLocalSearchParams<{ id: string }>();
  const { user } = useUser();
  const router = useRouter();
  const { data, isLoading }: { data: any; isLoading: boolean } = useQuery(
    "CommunityDetail",
    () => {
      return getCommunityDetail(communityId as string);
    },
    {
      retry: false,
      onError: (_err) => {
        console.log(_err);
        Alert.alert("오류", "존재하지 않거나, 삭제된 게시글 입니다.", [
          {
            text: "확인",
            onPress: () => {
              router.back();
            },
          },
        ]);
      },
    }
  );

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      flex: 1,
    },

    scroll_view_wrap: { flex: 1 },
    scroll_view: {
      backgroundColor: colors.background,
      height: 100,
    },
    wrap: {
      paddingHorizontal: 16,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 24,
      fontWeight: "600",
      color: colors.text,
    },
    nameAndDate: {
      marginTop: 4,
      fontSize: 12,
      color: colors.subText,
    },
    content: {
      marginTop: 12,
      color: colors.text,
    },
  });

  if (data) {
    return (
      <ActionSheetProvider>
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
          <Header backArrowText="커뮤니티" />
          {isLoading ? <FullScreenLoader /> : null}

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <View style={styles.scroll_view_wrap}>
              <ScrollView style={styles.scroll_view}>
                <View style={styles.wrap}>
                  <Text style={styles.title}>{data.title}</Text>
                  <Text style={styles.nameAndDate}>
                    {data.isAnonymous
                      ? "익명"
                      : data.publisherName + ` (${data.publisherDesc})`}{" "}
                    | {moment(data.createdAt).fromNow()}
                  </Text>

                  <Hyperlink linkDefault linkStyle={{ color: "#3b82f6" }}>
                    <Text selectable style={styles.content}>
                      {data.content}
                    </Text>
                  </Hyperlink>

                  <HorizontalScrollImageView data={data.images} height={200} />
                  <InteractionButtons
                    data={data}
                    user={user}
                    communityId={communityId as string}
                  />
                </View>
                <Comment
                  communityId={communityId as string}
                  data={data.comments}
                  currentUser={user}
                />
              </ScrollView>
            </View>
            <CommentInput communityId={communityId as string} />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ActionSheetProvider>
    );
  }
  return null;
}
