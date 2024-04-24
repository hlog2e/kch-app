import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { postComment } from "../../../../../../apis/community/community";
import { useTheme } from "@react-navigation/native";

export default function CommentInput({ communityId }) {
  const { colors } = useTheme();
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);

  const queryClient = useQueryClient();
  const { mutate: commentMutate } = useMutation(postComment);

  const styles = StyleSheet.create({
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
      {comment !== "" ? (
        <TouchableOpacity onPress={handlePostComment}>
          <Text style={styles.comment_send_button}>작성</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
