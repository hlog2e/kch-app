import {
  addLike,
  deleteLike,
  communityDelete,
  postBlockUser,
  postReportCommunityItem,
} from "../../../../apis/community/index";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

import { useMutation, useQueryClient } from "react-query";
import { useActionSheet } from "@expo/react-native-action-sheet";

import { Text, StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function InteractionButtons({
  data,
  user,
  communityId,
}: {
  data: any;
  user: any;
  communityId: string;
}) {
  const router = useRouter();
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
                router.back();
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
                  router.back();
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
      paddingVertical: 14,
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
      <TouchableOpacity style={styles.button} onPress={() => {}}>
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
      {/* {user.isAdmin && (
          <TouchableOpacity style={styles.button} onPress={handleDeleteCommunity}>
            <Ionicons color={colors.red} name={"close"} size={24} />
            <Text style={{ fontSize: 12, color: colors.red }}>관리자 삭제</Text>
          </TouchableOpacity>
        )} */}
    </View>
  );
}
