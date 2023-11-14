import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import OnlyLeftArrowHeader from "../../../components/common/OnlyLeftArrowHeader";
import moment from "moment";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import ImageView from "react-native-image-viewing";
import { useContext, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  addLike,
  deleteComment,
  deleteLike,
  getCommunityDetail,
  postComment,
  communityDelete,
  getBlockedUsers,
  postBlockUser,
  postReportCommunityItem,
  postReportComment,
} from "../../../../apis/community/community";

import FullScreenLoader from "../../../components/common/FullScreenLoader";
import { UserContext } from "../../../../context/UserContext";

import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { useActionSheet } from "@expo/react-native-action-sheet";
import FullScreenBlurLoader from "../../../components/common/FullScreenBlurLoader";
import Hyperlink from "react-native-hyperlink";

export default function CommunityDetailScreen({ navigation, route }) {
  const { colors } = useTheme();

  const itemId = route.params.id;

  const { user } = useContext(UserContext);

  const { data, isSuccess, isLoading } = useQuery(
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

  const [imageIndex, setImageIndex] = useState(0);
  const [imageOpen, setImageOpen] = useState(false);
  const [imageUris, setImageUris] = useState([]);

  const [comment, setComment] = useState("");

  const queryClient = useQueryClient();
  const { mutate: commentMutate, isLoading: commentPOSTLoading } =
    useMutation(postComment);
  const { data: blockedUsers } = useQuery("BlockedUsers", getBlockedUsers);

  const commentInputRef = useRef();

  const handleImageOpen = (index) => {
    let _temp = [];
    data.images.map((_i) => {
      _temp.push({ uri: _i });
    });
    setImageUris(_temp);
    setImageIndex(index);
    setImageOpen(true);
  };

  const handlePostComment = async () => {
    if (comment !== "") {
      await commentMutate(
        { comment: comment, communityId: itemId },
        {
          onSuccess: () => {
            queryClient.invalidateQueries("CommunityDetail");
          },
        }
      );
      setComment("");
    }
  };

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
      padding: 20,
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
      fontSize: 14,
      color: colors.subText,
    },
    image: {
      width: 200,
      height: 200,
      marginRight: 20,
      borderRadius: 20,
      marginTop: 32,
      backgroundColor: colors.cardBg2,
    },

    input_container: {
      paddingHorizontal: 14,
      paddingVertical: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderColor: colors.border,
      borderTopWidth: 0.2,
      backgroundColor: colors.background,
    },
    comment_input: { color: colors.text },
    comment_send_button: {
      fontSize: 16,
      color: colors.text,
    },
  });

  return (
    <ActionSheetProvider>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <OnlyLeftArrowHeader navigation={navigation} />
        {isLoading ? <FullScreenLoader /> : null}
        {commentPOSTLoading ? <FullScreenBlurLoader loading={true} /> : null}
        {isSuccess ? (
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
                  {user.isAdmin && (
                    <Text style={styles.date}>
                      신고 수 : {data.reports.length}
                    </Text>
                  )}

                  <Hyperlink linkDefault linkStyle={{ color: "#3b82f6" }}>
                    <Text selectable style={styles.content}>
                      {data.content}
                    </Text>
                  </Hyperlink>

                  <ScrollView horizontal>
                    {data.images.map((_item, _index) => (
                      <TouchableOpacity
                        key={_item}
                        onPress={() => {
                          handleImageOpen(_index);
                        }}
                      >
                        <Image
                          style={styles.image}
                          placeholder={"L1O|b2-;fQ-;_3fQfQfQfQfQfQfQ"}
                          transition={500}
                          contentFit={"cover"}
                          source={{
                            uri: _item,
                          }}
                        />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <ButtonBar
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
                      blockedUsers={blockedUsers}
                    />
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.input_container}>
              <TextInput
                ref={commentInputRef}
                style={styles.comment_input}
                value={comment}
                onChangeText={(_text) => {
                  setComment(_text);
                }}
                placeholderTextColor={colors.subText}
                placeholder={"댓글을 입력해주세요."}
                multiline
              />
              {comment !== "" ? (
                <TouchableOpacity onPress={handlePostComment}>
                  <Text style={styles.comment_send_button}>작성</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </KeyboardAvoidingView>
        ) : null}

        <ImageView
          visible={imageOpen}
          images={imageUris}
          imageIndex={imageIndex}
          onRequestClose={() => {
            setImageOpen(false);
          }}
        />
      </SafeAreaView>
    </ActionSheetProvider>
  );
}

function ButtonBar({ data, user, communityId, commentInputRef, navigation }) {
  const { colors } = useTheme();

  const queryClient = useQueryClient();
  const { mutate: likeAddMutate } = useMutation(addLike);
  const { mutate: likeDeleteMutate } = useMutation(deleteLike);
  const { mutate: communityDeleteMutate } = useMutation(communityDelete);
  const { mutate: blockUserMutate } = useMutation(postBlockUser);
  const { mutate: reportCommunityItem } = useMutation(postReportCommunityItem);

  const { showActionSheetWithOptions } = useActionSheet();

  const handleLike = async () => {
    //만약 data.likes 에 해당 유저 ID가 없다면 좋아요 추가
    if (!data.likes.includes(user._id)) {
      likeAddMutate(
        { communityId: communityId },
        {
          onSuccess: () => {
            queryClient.invalidateQueries("CommunityDetail");
          },
        }
      );
    }
    //else 좋아요 삭제
    else {
      likeDeleteMutate(
        { communityId: communityId },
        {
          onSuccess: () => {
            queryClient.invalidateQueries("CommunityDetail");
          },
        }
      );
    }
  };

  const handleDeleteCommunity = async () => {
    Alert.alert("", '"' + data.title + '" 을(를) 삭제하시겠습니까?', [
      { text: "취소", style: "cancel" },
      {
        text: "확인",
        onPress: () => {
          communityDeleteMutate(
            { communityId: communityId },
            {
              onSuccess: () => {
                queryClient.invalidateQueries("community");
                navigation.goBack();
              },
            }
          );
        },
      },
    ]);
  };

  const handleBlockUser = async () => {
    Alert.alert(
      "경고",
      "해당 사용자를 차단하면 작성한 게시물과 댓글 모두 볼 수 없습니다.",
      [
        { text: "취소", style: "cancel" },
        {
          text: "차단",
          style: "destructive",
          onPress: () => {
            blockUserMutate(
              { blockUserId: data.publisher },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries("community");
                  navigation.goBack();
                },
              }
            );
          },
        },
      ]
    );
  };

  const handleReport = async () => {
    Alert.alert("경고", "해당 게시물을 신고하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "신고",
        style: "destructive",
        onPress: () => {
          reportCommunityItem(
            { postId: communityId },
            {
              onSuccess: () => {
                Alert.alert("알림", "정상적으로 신고가 접수되었습니다.", [
                  { text: "확인" },
                ]);
              },
            }
          );
        },
      },
    ]);
  };

  const handleOpenActionSheet = async () => {
    const options = ["차단", "신고", "취소"];
    const destructiveButtonIndex = [0]; //빨간 강조 버튼의 인덱스들
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex) => {
        switch (selectedIndex) {
          case 0:
            // 차단하기
            handleBlockUser();
            break;

          case 1:
            // 신고하기
            handleReport();
            break;
        }
      }
    );
  };

  const styles = StyleSheet.create({
    button_bar: {
      marginTop: 20,
      height: 40,
      flexDirection: "row",
      alignItems: "center",
    },
    button: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    },
    button_text: {
      fontSize: 12,
      paddingHorizontal: 10,
      color: colors.text,
    },
  });
  return (
    <View style={styles.button_bar}>
      <TouchableOpacity style={styles.button} onPress={handleLike}>
        {/*만약 data.likes 배열에 유저ID 가 존재 한다면*/}
        {data.likes.includes(user._id) ? (
          <>
            <FontAwesome color={colors.red} name={"heart"} size={20} />
            <Text style={[styles.button_text, { color: colors.red }]}>
              {data.likeCount}
            </Text>
          </>
        ) : (
          <>
            <FontAwesome name={"heart-o"} size={20} color={colors.text} />
            <Text style={styles.button_text}>{data.likeCount}</Text>
          </>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          commentInputRef.current.focus();
        }}
      >
        <Ionicons name={"chatbubble-outline"} size={20} color={colors.text} />
        <Text style={styles.button_text}>{data.commentCount}</Text>
      </TouchableOpacity>
      {data.publisher === user._id ? (
        <TouchableOpacity style={styles.button} onPress={handleDeleteCommunity}>
          <Ionicons color={colors.red} name={"close"} size={24} />
          <Text style={{ fontSize: 12, color: colors.red }}>삭제하기</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleOpenActionSheet}>
          <Ionicons
            name={"ellipsis-horizontal-outline"}
            size={24}
            color={colors.text}
          />
          <Text style={styles.button_text}>더보기</Text>
        </TouchableOpacity>
      )}
      {user.isAdmin && (
        <TouchableOpacity style={styles.button} onPress={handleDeleteCommunity}>
          <Ionicons color={colors.red} name={"close"} size={24} />
          <Text style={{ fontSize: 12, color: colors.red }}>관리자 삭제</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function Comment({ communityId, currentUser, data, blockedUsers }) {
  const { colors } = useTheme();

  //react-query
  const queryClient = useQueryClient();
  const { mutate: deleteCommentMutate } = useMutation(deleteComment);
  const { mutate: blockUserMutate } = useMutation(postBlockUser);
  const { mutate: reportComment } = useMutation(postReportComment);

  const blockedUsersComment = blockedUsers
    ? blockedUsers.includes(data.issuer)
    : false;

  const { showActionSheetWithOptions } = useActionSheet();

  const styles = StyleSheet.create({
    comment: {
      backgroundColor: colors.background,
      borderTopWidth: 0.2,
      borderBottomWidth: 0.2,
      borderColor: colors.border,
      padding: 17,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    comment_writer_text: { fontSize: 12, color: "gray" },
    delete_text: { fontSize: 13, color: "gray" },
    delete_admin_text: { fontSize: 13, color: colors.red, marginTop: 10 },
    comment_text: {
      marginTop: 8,
      color: colors.text,
    },
    comment_date: { fontSize: 12, color: colors.subText, marginTop: 8 },

    blocked_users_comment: {
      backgroundColor: "white",
      borderTopWidth: 0.2,
      borderBottomWidth: 0.2,
      borderColor: "#d4d4d4",
      padding: 17,
    },
    blocked_users_comment_text: {
      fontSize: 14,
      color: "gray",
    },
  });

  const handleCommentDelete = async () => {
    Alert.alert("", "댓글을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "확인",
        onPress: () => {
          deleteCommentMutate(
            { communityId: communityId, commentId: data._id },
            {
              onSuccess: () => {
                queryClient.invalidateQueries("CommunityDetail");
              },
            }
          );
        },
      },
    ]);
  };

  const handleBlockUser = async () => {
    Alert.alert(
      "경고",
      "해당 사용자를 차단하면 작성한 게시물과 댓글 모두 볼 수 없습니다. (차단하면 되돌릴 수 없습니다.)",
      [
        { text: "취소", style: "cancel" },
        {
          text: "차단",
          style: "destructive",
          onPress: () => {
            blockUserMutate(
              { blockUserId: data.issuer },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries("CommunityDetail");
                  queryClient.invalidateQueries("BlockedUsers");
                },
              }
            );
          },
        },
      ]
    );
  };

  const handleReportComment = async () => {
    Alert.alert("경고", "해당 댓글을 신고하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "신고",
        style: "destructive",
        onPress: () => {
          reportComment(
            { postId: communityId, commentId: data._id },
            {
              onSuccess: () => {
                Alert.alert("알림", "정상적으로 해당 댓글을 신고하였습니다.", [
                  { text: "확인" },
                ]);
              },
            }
          );
        },
      },
    ]);
  };

  const handleOpenActionSheet = async () => {
    const options = ["차단", "신고", "취소"];
    const destructiveButtonIndex = [0]; //빨간 강조 버튼의 인덱스들
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex) => {
        switch (selectedIndex) {
          case 0:
            // 차단하기
            handleBlockUser();
            break;

          case 1:
            // 신고하기
            handleReportComment();
            break;
        }
      }
    );
  };

  if (blockedUsersComment) {
    return (
      <View style={styles.blocked_users_comment}>
        <Text style={styles.blocked_users_comment_text}>
          차단한 사용자의 댓글입니다.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.comment}>
      <View style={styles.header}>
        <Text style={styles.comment_writer_text}>익명</Text>

        {/*작성자 본인일 때 삭제버튼 보이기*/}
        {data.issuer === currentUser._id ? (
          <TouchableOpacity onPress={handleCommentDelete}>
            <Text style={styles.delete_text}>삭제</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleOpenActionSheet}>
            <Ionicons name="ellipsis-horizontal" size={16} color="gray" />
          </TouchableOpacity>
        )}
      </View>
      <Hyperlink linkDefault linkStyle={{ color: "#3b82f6" }}>
        <Text selectable style={styles.comment_text}>
          {data.comment}
        </Text>
      </Hyperlink>
      <Text style={styles.comment_date}>
        {moment(data.createdAt).fromNow()}
      </Text>

      {currentUser.isAdmin && (
        <>
          {data.reports && (
            <Text style={styles.comment_date}>
              신고수 : {data.reports.length}
            </Text>
          )}
          <TouchableOpacity onPress={handleCommentDelete}>
            <Text style={styles.delete_admin_text}>관리자 삭제</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
