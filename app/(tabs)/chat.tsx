import React, { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import moment from "moment";

import { getChatRooms } from "../../apis/chat";
import { useUser } from "../../context/UserContext";
import FABPlus from "../../src/components/Button/FABPlus";
import CollapsibleHeader, {
  DEFAULT_HEADER_HEIGHT,
  useCollapsibleHeader,
} from "../../src/components/Header/CollapsibleHeader";
import FullScreenLoader from "../../src/components/Overlay/FullScreenLoader";
import type { ChatRoom } from "../../src/types/chat";

function canUseChat(user: any) {
  return (
    (user?.type === "undergraduate" || user?.type === "teacher") &&
    user?.verified !== false
  );
}

function formatRoomTime(value: string) {
  const date = moment(value);
  if (date.isSame(moment(), "day")) return date.format("A h:mm");
  if (date.isSame(moment().subtract(1, "day"), "day")) return "어제";
  return date.format("M/D");
}

export default function ChatTabScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const { user } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const { scrollProps, headerTranslateY } = useCollapsibleHeader({
    headerHeight: DEFAULT_HEADER_HEIGHT,
  });
  const hasAccess = canUseChat(user);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["chatRooms"],
    queryFn: getChatRooms,
    enabled: hasAccess,
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (!hasAccess) {
    return (
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <CollapsibleHeader
          title="채팅"
          headerTranslateY={headerTranslateY}
          headerHeight={DEFAULT_HEADER_HEIGHT}
        />
        <View style={styles.accessDenied}>
          <Ionicons name="chatbubbles-outline" size={38} color={colors.subText} />
          <Text style={styles.accessTitle}>재학생과 선생님만 이용 가능합니다</Text>
          <Text style={styles.accessDesc}>
            금천인 인증을 완료하면 DM과 그룹채팅을 사용할 수 있어요
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/more/verify")}
            style={styles.verifyButton}
          >
            <Text style={styles.verifyButtonText}>금천인 인증</Text>
            <MaterialIcons name="verified" size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      {isLoading && <FullScreenLoader />}
      <CollapsibleHeader
        title="채팅"
        headerTranslateY={headerTranslateY}
        headerHeight={DEFAULT_HEADER_HEIGHT}
      />
      <FABPlus onPress={() => router.push("/chat/new")} />

      <FlatList
        {...scrollProps}
        data={data ?? []}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={<View style={{ height: DEFAULT_HEADER_HEIGHT + 8 }} />}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyWrap}>
              <Ionicons name="chatbubble-ellipses-outline" size={34} color={colors.subText} />
              <Text style={styles.emptyTitle}>아직 채팅방이 없습니다</Text>
              <Text style={styles.emptyDesc}>이름이나 학번으로 친구를 찾아 대화를 시작해보세요</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => <RoomRow room={item} />}
      />
    </SafeAreaView>
  );
}

function RoomRow({ room }: { room: ChatRoom }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const previewPrefix =
    room.type === "group" && room.lastMessage?.senderName
      ? `${room.lastMessage.senderName}: `
      : "";

  return (
    <Pressable
      onPress={() => router.push(`/chat/${room.id}`)}
      style={({ pressed }) => [styles.roomRow, pressed && styles.pressed]}
    >
      <View style={styles.roomAvatar}>
        <Ionicons
          name={room.type === "group" ? "people" : "person"}
          size={22}
          color={colors.accentBlue}
        />
      </View>
      <View style={styles.roomBody}>
        <View style={styles.roomTitleLine}>
          <Text numberOfLines={1} style={styles.roomTitle}>
            {room.title}
          </Text>
          {room.type === "group" && (
            <View style={styles.groupBadge}>
              <Text style={styles.groupBadgeText}>
                {room.participants.length}명
              </Text>
            </View>
          )}
        </View>
        <Text numberOfLines={1} style={styles.roomPreview}>
          {room.lastMessage
            ? `${previewPrefix}${room.lastMessage.text}`
            : "새 채팅방이 만들어졌습니다"}
        </Text>
      </View>
      <View style={styles.roomMeta}>
        <Text style={styles.roomTime}>{formatRoomTime(room.updatedAt)}</Text>
        {room.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>
              {room.unreadCount > 99 ? "99+" : room.unreadCount}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    accessDenied: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
    },
    accessTitle: {
      marginTop: 16,
      color: colors.text,
      fontSize: 16,
      fontWeight: "800",
      textAlign: "center",
    },
    accessDesc: {
      marginTop: 8,
      color: colors.subText,
      fontSize: 13,
      lineHeight: 19,
      textAlign: "center",
    },
    verifyButton: {
      height: 40,
      marginTop: 24,
      borderRadius: 20,
      paddingHorizontal: 22,
      backgroundColor: colors.blue,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    verifyButtonText: {
      color: "#ffffff",
      fontSize: 14,
      fontWeight: "800",
    },
    roomRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 18,
      paddingVertical: 13,
      gap: 12,
    },
    pressed: {
      opacity: 0.68,
    },
    roomAvatar: {
      width: 46,
      height: 46,
      borderRadius: 23,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.accentBlueAlpha,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.accentBlueBorder,
    },
    roomBody: {
      flex: 1,
      minWidth: 0,
    },
    roomTitleLine: {
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
    },
    roomTitle: {
      flexShrink: 1,
      color: colors.text,
      fontSize: 16,
      fontWeight: "800",
    },
    groupBadge: {
      borderRadius: 999,
      backgroundColor: colors.cardBg2,
      paddingHorizontal: 7,
      paddingVertical: 2,
    },
    groupBadgeText: {
      color: colors.subText,
      fontSize: 11,
      fontWeight: "800",
    },
    roomPreview: {
      marginTop: 5,
      color: colors.subText,
      fontSize: 13,
      fontWeight: "500",
    },
    roomMeta: {
      alignItems: "flex-end",
      minWidth: 42,
      gap: 7,
    },
    roomTime: {
      color: colors.subText,
      fontSize: 11,
      fontWeight: "700",
    },
    unreadBadge: {
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      paddingHorizontal: 6,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.accentBlue,
    },
    unreadText: {
      color: "#ffffff",
      fontSize: 11,
      fontWeight: "900",
    },
    emptyWrap: {
      alignItems: "center",
      paddingTop: 120,
      paddingHorizontal: 24,
    },
    emptyTitle: {
      marginTop: 14,
      color: colors.text,
      fontSize: 16,
      fontWeight: "800",
    },
    emptyDesc: {
      marginTop: 7,
      color: colors.subText,
      fontSize: 13,
      textAlign: "center",
      lineHeight: 19,
    },
  });
