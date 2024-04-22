import {
  deleteComment,
  postReportComment,
  postBlockUser,
  getBlockedUsers,
} from "../../../../../../apis/community/community";
import { useTheme } from "@react-navigation/native";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Text, StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Hyperlink from "react-native-hyperlink";
import moment from "moment";

export default function Comment({ communityId, currentUser, data }) {
  const { colors } = useTheme();

  //react-query
  const queryClient = useQueryClient();
  const { mutate: deleteCommentMutate } = useMutation(deleteComment);
  const { mutate: blockUserMutate } = useMutation(postBlockUser);
  const { mutate: reportComment } = useMutation(postReportComment);

  const { data: blockedUsers } = useQuery("BlockedUsers", getBlockedUsers);
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

    comment_writer_text: {
      fontWeight: "600",
      color: colors.blue,
    },
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
    <View>
      {data
        ? data.map((_item) => (
            <View key={_item._id} style={styles.comment}>
              <View style={styles.header}>
                <Text style={styles.comment_writer_text}>
                  {_item.isAnonymous ? "익명" : _item.issuer.name}
                </Text>

                {/*작성자 본인일 때 삭제버튼 보이기*/}
                {_item.issuer === currentUser._id ? (
                  <TouchableOpacity onPress={handleCommentDelete}>
                    <Text style={styles.delete_text}>삭제</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={handleOpenActionSheet}>
                    <Ionicons
                      name="ellipsis-horizontal"
                      size={16}
                      color="gray"
                    />
                  </TouchableOpacity>
                )}
              </View>
              <Hyperlink linkDefault linkStyle={{ color: "#3b82f6" }}>
                <Text selectable style={styles.comment_text}>
                  {_item.comment}
                </Text>
              </Hyperlink>
              <Text style={styles.comment_date}>
                {moment(_item.createdAt).fromNow()}
              </Text>
            </View>
          ))
        : null}
    </View>
  );
}
