import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { postComment } from "../../../../apis/community/index";
import { useTheme } from "@react-navigation/native";
import FullScreenLoader from "../../Overlay/FullScreenLoader";
import Checkbox from "expo-checkbox";

export default function CommentInput({ communityId }: { communityId: string }) {
  const { colors } = useTheme();
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);

  const queryClient = useQueryClient();
  const { mutate: commentMutate, isLoading } = useMutation(postComment);

  const styles = StyleSheet.create({
    input_container: {
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderColor: colors.border,
      borderTopWidth: 0.2,
      backgroundColor: colors.background,
    },
    left_wrap: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    checkbox_wrap: {
      flexDirection: "row",

      justifyContent: "center",
      alignItems: "center",
    },
    checkbox: { borderRadius: 5, color: colors.blue, width: 18, height: 18 },
    checkbox_text: {
      marginLeft: 4,
      fontWeight: "600",
      color: colors.subText,
      fontSize: 12,
    },

    comment_input: {
      color: colors.text,
      marginLeft: 8,
      paddingTop: 0,
    },
    comment_send_button: {
      fontSize: 16,
      color: colors.text,
    },

    loader_container: {
      paddingVertical: 12,
      flex: 1,
    },
  });

  const handlePostComment = async () => {
    if (comment !== "") {
      await commentMutate(
        {
          comment: comment,
          communityId: communityId,
          isAnonymous: isAnonymous,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries("CommunityDetail");
          },
        }
      );
      setComment("");
    }
  };
  return (
    <View style={styles.input_container}>
      {isLoading ? (
        <View style={styles.loader_container}>
          <FullScreenLoader />
        </View>
      ) : (
        <View style={styles.left_wrap}>
          <View style={styles.checkbox_wrap}>
            <Checkbox
              style={styles.checkbox}
              value={isAnonymous}
              onValueChange={() => {
                setIsAnonymous((_prev) => !_prev);
              }}
            />
            <Text style={styles.checkbox_text}>익명</Text>
            <TextInput
              style={styles.comment_input}
              value={comment}
              onChangeText={(_text) => {
                setComment(_text);
              }}
              placeholderTextColor={colors.subText}
              placeholder={"댓글을 입력해주세요."}
              multiline
            />
          </View>

          {comment !== "" ? (
            <TouchableOpacity onPress={handlePostComment}>
              <Text style={styles.comment_send_button}>작성</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    </View>
  );
}
