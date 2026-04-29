import React, { memo, useMemo } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import moment from "moment";

import type { ChatMessage, ChatRoomType } from "../../../types/chat";

export interface MessageItemProps {
  message: ChatMessage;
  index: number;
  messages: ChatMessage[];
  roomType?: ChatRoomType;
  onReply?: (message: ChatMessage) => void;
  onDeleteForMe?: (messageId: string) => void;
  onDeleteForEveryone?: (messageId: string) => void;
  onReport?: (messageId: string, senderId: string) => void;
  onScrollToReply?: (messageId: string) => void;
  isLastMyMessage?: boolean;
}

function isSameDay(a?: string, b?: string) {
  if (!a || !b) return false;
  return moment(a).isSame(moment(b), "day");
}

function formatDate(value: string) {
  const date = moment(value);
  if (date.isSame(moment(), "day")) return "오늘";
  if (date.isSame(moment().subtract(1, "day"), "day")) return "어제";
  return date.format("YYYY년 M월 D일");
}

function MessageItemComponent({
  message,
  index,
  messages,
  roomType = "dm",
  onReply,
  onDeleteForMe,
  onDeleteForEveryone,
  onReport,
  onScrollToReply,
  isLastMyMessage,
}: MessageItemProps) {
  const { colors, dark } = useTheme();
  const styles = useMemo(() => createStyles(colors, dark), [colors, dark]);
  const prev = messages[index - 1];
  const next = messages[index + 1];
  const sameAsPrev =
    prev?.sender.id === message.sender.id && isSameDay(prev.createdAt, message.createdAt);
  const sameAsNext =
    next?.sender.id === message.sender.id && isSameDay(next.createdAt, message.createdAt);
  const showDateSeparator = !isSameDay(prev?.createdAt, message.createdAt);
  const showAuthor = !message.isMine && roomType === "group" && !sameAsPrev;
  const showAvatar = !message.isMine && !sameAsNext;
  const showTime = !sameAsNext;
  const translateX = useSharedValue(0);

  const swipeGesture = Gesture.Pan()
    .enabled(Boolean(onReply))
    .activeOffsetX(message.isMine ? [-100, -12] : [12, 100])
    .onUpdate((event) => {
      const nextValue = message.isMine
        ? Math.min(0, Math.max(-64, event.translationX))
        : Math.max(0, Math.min(64, event.translationX));
      translateX.value = nextValue;
    })
    .onEnd(() => {
      const shouldReply = Math.abs(translateX.value) > 42;
      translateX.value = withSpring(0, { damping: 16, stiffness: 220 });
      if (shouldReply && onReply) {
        runOnJS(onReply)(message);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const openActions = () => {
    const actions = [
      ...(onReply ? [{ text: "답장하기", onPress: () => onReply(message) }] : []),
      ...(message.isMine && onDeleteForEveryone
        ? [{ text: "모두에게서 삭제", style: "destructive" as const, onPress: () => onDeleteForEveryone(message.id) }]
        : []),
      ...(onDeleteForMe
        ? [{ text: "나에게서 삭제", onPress: () => onDeleteForMe(message.id) }]
        : []),
      ...(!message.isMine && onReport
        ? [{ text: "신고하기", style: "destructive" as const, onPress: () => onReport(message.id, message.sender.id) }]
        : []),
      { text: "취소", style: "cancel" as const },
    ];
    Alert.alert("메시지", undefined, actions);
  };

  if (message.type === "system") {
    return (
      <View style={styles.systemWrap}>
        {showDateSeparator && (
          <Text style={styles.dateText}>{formatDate(message.createdAt)}</Text>
        )}
        <Text style={styles.systemText}>{message.text}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showDateSeparator && (
        <View style={styles.dateWrap}>
          <Text style={styles.dateText}>{formatDate(message.createdAt)}</Text>
        </View>
      )}

      <View style={[styles.row, message.isMine && styles.mineRow]}>
        {!message.isMine && (
          <View style={styles.avatarSlot}>
            {showAvatar && message.sender.profilePhoto ? (
              <Image source={{ uri: message.sender.profilePhoto }} style={styles.avatar} />
            ) : showAvatar ? (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarText}>{message.sender.name.slice(0, 1)}</Text>
              </View>
            ) : null}
          </View>
        )}

        <View style={[styles.content, message.isMine && styles.mineContent]}>
          {showAuthor && <Text style={styles.authorName}>{message.sender.name}</Text>}

          <View style={[styles.bubbleLine, message.isMine && styles.mineBubbleLine]}>
            <GestureDetector gesture={swipeGesture}>
              <Animated.View style={animatedStyle}>
                <Pressable
                  onLongPress={openActions}
                  delayLongPress={260}
                  style={[
                    styles.bubble,
                    message.isMine ? styles.mineBubble : styles.otherBubble,
                    sameAsPrev && (message.isMine ? styles.mineGroupedTop : styles.otherGroupedTop),
                    sameAsNext && (message.isMine ? styles.mineGroupedBottom : styles.otherGroupedBottom),
                  ]}
                >
                  {message.replyTo && (
                    <Pressable
                      onPress={() => onScrollToReply?.(message.replyTo?.id ?? "")}
                      style={[
                        styles.replyQuote,
                        message.isMine && styles.mineReplyQuote,
                      ]}
                    >
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.replySender,
                          message.isMine && styles.mineReplyText,
                        ]}
                      >
                        {message.replyTo.senderName}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.replyText,
                          message.isMine && styles.mineReplyText,
                        ]}
                      >
                        {message.replyTo.text}
                      </Text>
                    </Pressable>
                  )}
                  <Text style={[styles.messageText, message.isMine && styles.mineText]}>
                    {message.text}
                  </Text>
                </Pressable>
              </Animated.View>
            </GestureDetector>

            {showTime && (
              <Text style={[styles.timeText, message.isMine && styles.mineTimeText]}>
                {moment(message.createdAt).format("A h:mm")}
              </Text>
            )}
          </View>

          {isLastMyMessage && message.readBy && message.readBy.length > 0 && (
            <View style={styles.readReceipt}>
              <Ionicons name="checkmark-done" size={13} color={colors.subText} />
              <Text style={styles.readReceiptText}>
                {message.readBy.length}명 읽음
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: any, dark: boolean) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 14,
      marginBottom: 4,
    },
    dateWrap: {
      alignItems: "center",
      marginVertical: 16,
    },
    dateText: {
      overflow: "hidden",
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 5,
      backgroundColor: colors.cardBg2,
      color: colors.subText,
      fontSize: 12,
      fontWeight: "600",
    },
    row: {
      flexDirection: "row",
      alignItems: "flex-end",
    },
    mineRow: {
      justifyContent: "flex-end",
    },
    avatarSlot: {
      width: 36,
      marginRight: 8,
      alignItems: "center",
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.cardBg2,
    },
    avatarFallback: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.accentBlueAlpha,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.accentBlueBorder,
    },
    avatarText: {
      color: colors.accentBlue,
      fontWeight: "800",
      fontSize: 13,
    },
    content: {
      maxWidth: "78%",
    },
    mineContent: {
      alignItems: "flex-end",
    },
    authorName: {
      marginLeft: 8,
      marginBottom: 4,
      color: colors.subText,
      fontSize: 12,
      fontWeight: "700",
    },
    bubbleLine: {
      flexDirection: "row",
      alignItems: "flex-end",
    },
    mineBubbleLine: {
      flexDirection: "row-reverse",
    },
    bubble: {
      maxWidth: "100%",
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 18,
    },
    mineBubble: {
      backgroundColor: colors.accentBlue,
      borderBottomRightRadius: 6,
    },
    otherBubble: {
      backgroundColor: dark ? colors.cardBg2 : "#f4f7fb",
      borderBottomLeftRadius: 6,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    mineGroupedTop: {
      borderTopRightRadius: 7,
    },
    mineGroupedBottom: {
      borderBottomRightRadius: 7,
    },
    otherGroupedTop: {
      borderTopLeftRadius: 7,
    },
    otherGroupedBottom: {
      borderBottomLeftRadius: 7,
    },
    messageText: {
      color: colors.text,
      fontSize: 15,
      lineHeight: 21,
      fontWeight: "500",
    },
    mineText: {
      color: "#ffffff",
    },
    timeText: {
      marginLeft: 6,
      marginBottom: 2,
      color: colors.subText,
      fontSize: 10,
      fontWeight: "500",
    },
    mineTimeText: {
      marginLeft: 0,
      marginRight: 6,
    },
    replyQuote: {
      marginBottom: 7,
      paddingLeft: 9,
      borderLeftWidth: 3,
      borderLeftColor: colors.accentBlue,
      opacity: 0.9,
    },
    mineReplyQuote: {
      borderLeftColor: "rgba(255,255,255,0.75)",
    },
    replySender: {
      color: colors.accentBlue,
      fontSize: 12,
      fontWeight: "800",
      marginBottom: 2,
    },
    replyText: {
      color: colors.subText,
      fontSize: 12,
      fontWeight: "600",
    },
    mineReplyText: {
      color: "rgba(255,255,255,0.82)",
    },
    readReceipt: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
      marginTop: 4,
      marginRight: 4,
    },
    readReceiptText: {
      color: colors.subText,
      fontSize: 11,
      fontWeight: "600",
    },
    systemWrap: {
      alignItems: "center",
      paddingHorizontal: 20,
      marginVertical: 10,
    },
    systemText: {
      color: colors.subText,
      fontSize: 12,
      textAlign: "center",
      fontWeight: "600",
    },
  });

export default memo(MessageItemComponent);
