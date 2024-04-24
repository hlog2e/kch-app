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

import { useContext } from "react";
import { useQuery } from "react-query";
import { getCommunityDetail } from "../../../../../apis/community/community";
import FullScreenLoader from "../../../../components/Overlay/FullScreenLoader";
import { UserContext } from "../../../../../context/UserContext";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

import Hyperlink from "react-native-hyperlink";
import Header from "../../../../components/Header/Header";
import HorizontalScrollImageView from "../../../../components/Image/HorizontalScrollImageView";
import Comment from "../components/Detail/Comment";
import InteractionButtons from "../components/Detail/InteractionButtons";
import CommentInput from "../components/Detail/CommentInput";

export default function CommunityDetailScreen({ navigation, route }) {
  const { colors } = useTheme();
  const communityId = route.params.id;
  const { user } = useContext(UserContext);
  const { data, isLoading } = useQuery(
    "CommunityDetail",
    () => {
      return getCommunityDetail(communityId);
    },
    {
      retry: false,
      onError: (_err) => {
        console.log(_err);
        Alert.alert("오류", "존재하지 않거나, 삭제된 게시글 입니다.", [
          {
            text: "확인",
            onPress: () => {
              navigation.goBack();
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
    date: {
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
          <Header navigation={navigation} />
          {isLoading ? <FullScreenLoader /> : null}
          {/* {commentPOSTLoading ? <FullScreenLoader blur loading={true} /> : null} */}

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : null}
          >
            <View style={styles.scroll_view_wrap}>
              <ScrollView style={styles.scroll_view}>
                <View style={styles.wrap}>
                  <Text style={styles.title}>{data.title}</Text>
                  <Text style={styles.date}>
                    {moment(data.createdAt).fromNow()}
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
                    communityId={communityId}
                    navigation={navigation}
                  />
                </View>
                <Comment
                  communityId={communityId}
                  data={data.comments}
                  currentUser={user}
                />
              </ScrollView>
            </View>
            <CommentInput communityId={communityId} />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ActionSheetProvider>
    );
  }
}
