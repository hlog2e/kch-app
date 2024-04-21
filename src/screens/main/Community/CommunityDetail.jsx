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

import { useContext, useRef } from "react";
import { useQuery } from "react-query";
import { getCommunityDetail } from "../../../../apis/community/community";
import FullScreenLoader from "../../../components/Overlay/FullScreenLoader";
import { UserContext } from "../../../../context/UserContext";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

import Hyperlink from "react-native-hyperlink";
import Header from "../../../components/Header/Header";
import HorizontalScrollImageView from "../../../components/Image/HorizontalScrollImageView";
import Comment from "./components/CommunityDetail/Comment";
import InteractionButtons from "./components/CommunityDetail/InteractionButtons";

export default function CommunityDetailScreen({ navigation, route }) {
  const { colors } = useTheme();
  const itemId = route.params.id;
  const { user } = useContext(UserContext);
  const { data, isLoading } = useQuery(
    "CommunityDetail",
    () => {
      return getCommunityDetail(itemId);
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

  const commentInputRef = useRef();

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
      marginTop: 24,
      fontSize: 15,
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
                    communityId={itemId}
                    commentInputRef={commentInputRef}
                    navigation={navigation}
                  />
                </View>
                {data.comments.map((_item) => {
                  return (
                    <Comment
                      key={_item._id}
                      communityId={itemId}
                      data={_item}
                      currentUser={user}
                    />
                  );
                })}
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ActionSheetProvider>
    );
  }
}
