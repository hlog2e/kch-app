import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
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
} from "../../../../apis/community/community";

import FullScreenLoader from "../../../components/common/FullScreenLoader";
import { UserContext } from "../../../../context/UserContext";

import badWordChecker from "../../../../utils/badWordChecker";

export default function CommunityDetailScreen({ navigation, route }) {
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
  const { mutate: commentMutate } = useMutation(postComment);

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
      //비속어 체크 로직
      const { isBad, word } = await badWordChecker(comment);
      if (isBad) {
        Alert.alert(
          "알림",
          "작성중인 내용에 비속어가 포함 되어있습니다. '" + word + "'",
          ["확인"]
        );
        return;
      }
      //서버로 댓글 전송
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
    container: { backgroundColor: "white", flex: 1 },

    scroll_view_wrap: { flex: 1 },
    scroll_view: { backgroundColor: "#f4f4f4", height: 100 },
    wrap: { padding: 20, backgroundColor: "white" },
    title: {
      fontSize: 24,
      fontWeight: "600",
    },
    date: {
      marginTop: 6,
      fontSize: 12,
      color: "gray",
    },
    content: {
      marginTop: 24,
      fontSize: 14,
      color: "#52525b",
    },
    image: {
      width: 200,
      height: 200,
      marginRight: 20,
      borderRadius: 20,
      marginTop: 32,
    },

    input_container: {
      paddingHorizontal: 14,
      paddingVertical: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderColor: "#b8b8b8",
      borderTopWidth: 0.2,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <OnlyLeftArrowHeader navigation={navigation} />
      {isLoading ? <FullScreenLoader /> : null}
      {isSuccess ? (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.scroll_view_wrap}>
            <ScrollView style={styles.scroll_view}>
              <View style={styles.wrap}>
                <Text style={styles.title}>{data.title}</Text>
                <Text style={styles.date}>
                  {moment(data.createdAt).fromNow()}
                </Text>
                <Text style={styles.content}>{data.content}</Text>
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
                        resizeMode={"cover"}
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
              {data.comments.map((_i) => {
                return (
                  <Comment
                    key={_i._id}
                    communityId={itemId}
                    commentId={_i._id}
                    comment={_i.comment}
                    createdAt={_i.createdAt}
                    issuer={_i.issuer}
                    currentUser={user}
                  />
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.input_container}>
            <TextInput
              ref={commentInputRef}
              value={comment}
              onChangeText={(_text) => {
                setComment(_text);
              }}
              placeholder="댓글을 입력해주세요."
              multiline
            />
            {comment !== "" ? (
              <TouchableOpacity onPress={handlePostComment}>
                <Text style={{ fontSize: 16 }}>작성</Text>
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
  );
}

function ButtonBar({ data, user, communityId, commentInputRef, navigation }) {
  const queryClient = useQueryClient();
  const { mutate: likeAddMutate } = useMutation(addLike);
  const { mutate: likeDeleteMutate } = useMutation(deleteLike);
  const { mutate: communityDeleteMutate } = useMutation(communityDelete);

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
    button_text: { fontSize: 12, paddingHorizontal: 10 },
  });
  return (
    <View style={styles.button_bar}>
      <TouchableOpacity style={styles.button} onPress={handleLike}>
        {/*만약 data.likes 배열에 유저ID 가 존재 한다면*/}
        {data.likes.includes(user._id) ? (
          <>
            <FontAwesome color={"#CF5858"} name={"heart"} size={20} />
            <Text style={[styles.button_text, { color: "#CF5858" }]}>
              {data.likeCount}
            </Text>
          </>
        ) : (
          <>
            <FontAwesome name={"heart-o"} size={20} />
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
        <Ionicons name={"chatbubble-outline"} size={20} />
        <Text style={styles.button_text}>{data.commentCount}</Text>
      </TouchableOpacity>
      {data.publisher === user._id ? (
        <TouchableOpacity style={styles.button} onPress={handleDeleteCommunity}>
          <Ionicons color={"#CF5858"} name={"close"} size={24} />
          <Text style={{ fontSize: 12, color: "#CF5858" }}>삭제하기</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

function Comment({
  communityId,
  commentId,
  comment,
  createdAt,
  issuer,
  currentUser,
}) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation(deleteComment);
  const styles = StyleSheet.create({
    comment: {
      backgroundColor: "white",
      borderTopWidth: 0.2,
      borderBottomWidth: 0.2,
      borderColor: "#d4d4d4",
      padding: 17,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    comment_writer_text: { fontSize: 12, color: "gray" },
    delete_text: { fontSize: 13, color: "gray" },
    comment_text: { marginTop: 8 },
    comment_date: { fontSize: 12, color: "#94a3b8", marginTop: 8 },
  });

  const handleCommentDelete = async () => {
    Alert.alert("", "댓글을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "확인",
        onPress: () => {
          mutate(
            { communityId: communityId, commentId: commentId },
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

  return (
    <View style={styles.comment}>
      <View style={styles.header}>
        <Text style={styles.comment_writer_text}>익명</Text>
        {/*작성자 본인일 때 삭제버튼 보이기*/}
        {issuer === currentUser._id ? (
          <TouchableOpacity onPress={handleCommentDelete}>
            <Text style={styles.delete_text}>삭제</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <Text style={styles.comment_text}>{comment}</Text>
      <Text style={styles.comment_date}>{moment(createdAt).fromNow()}</Text>
    </View>
  );
}
