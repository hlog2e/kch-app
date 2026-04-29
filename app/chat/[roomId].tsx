import React, { useMemo, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";

import { getChatMessages, getChatRoom, sendMessage } from "../../apis/chat";
import MessageItem from "../../src/components/common/MessageItem";
import type { ChatMessage } from "../../src/types/chat";

export default function ChatRoomScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);

  const { data: room } = useQuery({
    queryKey: ["chatRoom", roomId],
    queryFn: () => getChatRoom(roomId),
    enabled: Boolean(roomId),
  });
  const { data: messages = [] } = useQuery({
    queryKey: ["chatMessages", roomId],
    queryFn: () => getChatMessages(roomId),
    enabled: Boolean(roomId),
  });

  const { mutate: send, isPending } = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      setText("");
      setReplyTo(null);
      queryClient.invalidateQueries({ queryKey: ["chatMessages", roomId] });
      queryClient.invalidateQueries({ queryKey: ["chatRoom", roomId] });
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    },
  });

  const lastMyMessageId = [...messages].reverse().find((message) => message.isMine)?.id;

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed || isPending) return;
    send({
      roomId,
      text: trimmed,
      replyTo: replyTo
        ? {
            id: replyTo.id,
            text: replyTo.text,
            senderName: replyTo.isMine ? "나" : replyTo.sender.name,
          }
        : undefined,
    });
  };

  const scrollToMessage = (messageId: string) => {
    const index = messages.findIndex((message) => message.id === messageId);
    if (index >= 0) {
      listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.45 });
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="chevron-back" size={28} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerTextWrap}>
            <Text numberOfLines={1} style={styles.headerTitle}>
              {room?.title ?? "채팅"}
            </Text>
            <Text numberOfLines={1} style={styles.headerSubTitle}>
              {room
                ? room.type === "group"
                  ? `${room.participants.length}명`
                  : "DM"
                : "불러오는 중"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => Alert.alert("알림", "채팅방 설정은 다음 페이즈에서 연결됩니다.")}
            style={styles.iconButton}
          >
            <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          onScrollToIndexFailed={() => undefined}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons name="chatbubble-ellipses-outline" size={30} color={colors.subText} />
              <Text style={styles.emptyTitle}>첫 메시지를 보내보세요</Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <MessageItem
              message={item}
              index={index}
              messages={messages}
              roomType={room?.type}
              onReply={setReplyTo}
              onReport={() => Alert.alert("신고", "신고 기능은 백엔드 연결 페이즈에서 처리됩니다.")}
              onScrollToReply={scrollToMessage}
              isLastMyMessage={item.id === lastMyMessageId}
            />
          )}
        />

        {replyTo && (
          <View style={styles.replyBar}>
            <View style={styles.replyAccent} />
            <View style={styles.replyBody}>
              <Text style={styles.replyTitle}>
                {replyTo.isMine ? "나" : replyTo.sender.name}에게 답장
              </Text>
              <Text numberOfLines={1} style={styles.replyPreview}>
                {replyTo.text}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setReplyTo(null)} style={styles.smallIconButton}>
              <Ionicons name="close" size={18} color={colors.subText} />
            </TouchableOpacity>
          </View>
        )}

        <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="메시지 입력"
            placeholderTextColor={colors.subText}
            style={styles.input}
            multiline
          />
          <TouchableOpacity
            onPress={submit}
            disabled={!text.trim() || isPending}
            style={[styles.sendButton, (!text.trim() || isPending) && styles.sendButtonDisabled]}
          >
            <Ionicons name="arrow-up" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    flex: {
      flex: 1,
    },
    header: {
      height: 56,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 8,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    iconButton: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTextWrap: {
      flex: 1,
      minWidth: 0,
      alignItems: "center",
    },
    headerTitle: {
      color: colors.text,
      fontSize: 17,
      fontWeight: "900",
      maxWidth: "100%",
    },
    headerSubTitle: {
      marginTop: 2,
      color: colors.subText,
      fontSize: 11,
      fontWeight: "700",
    },
    messageList: {
      flexGrow: 1,
      paddingTop: 14,
      paddingBottom: 12,
    },
    emptyWrap: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 160,
    },
    emptyTitle: {
      marginTop: 10,
      color: colors.subText,
      fontSize: 14,
      fontWeight: "800",
    },
    replyBar: {
      minHeight: 54,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
    },
    replyAccent: {
      width: 3,
      height: 34,
      borderRadius: 2,
      backgroundColor: colors.accentBlue,
      marginRight: 10,
    },
    replyBody: {
      flex: 1,
      minWidth: 0,
    },
    replyTitle: {
      color: colors.accentBlue,
      fontSize: 12,
      fontWeight: "900",
    },
    replyPreview: {
      marginTop: 3,
      color: colors.subText,
      fontSize: 12,
      fontWeight: "600",
    },
    smallIconButton: {
      width: 32,
      height: 32,
      alignItems: "center",
      justifyContent: "center",
    },
    inputBar: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 9,
      paddingHorizontal: 12,
      paddingTop: 10,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
    },
    input: {
      flex: 1,
      maxHeight: 116,
      minHeight: 42,
      borderRadius: 21,
      paddingHorizontal: 15,
      paddingTop: Platform.OS === "ios" ? 11 : 8,
      paddingBottom: Platform.OS === "ios" ? 11 : 8,
      backgroundColor: colors.cardBg2,
      color: colors.text,
      fontSize: 15,
      fontWeight: "600",
    },
    sendButton: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.accentBlue,
    },
    sendButtonDisabled: {
      opacity: 0.35,
    },
  });
