import React, { useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";

import { createChatRoom, searchChatUsers } from "../../apis/chat";
import type { ChatUser } from "../../src/types/chat";

export default function NewChatScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ChatUser[]>([]);

  const { data = [], isFetching } = useQuery({
    queryKey: ["chatUserSearch", query],
    queryFn: () => searchChatUsers(query),
    enabled: query.trim().length > 0,
  });

  const { mutate: createRoom, isPending } = useMutation({
    mutationFn: createChatRoom,
    onSuccess: (room) => {
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
      router.replace(`/chat/${room.id}`);
    },
  });

  const toggleUser = (user: ChatUser) => {
    setSelected((prev) =>
      prev.some((item) => item.id === user.id)
        ? prev.filter((item) => item.id !== user.id)
        : [...prev, user]
    );
  };

  const startChat = () => {
    if (selected.length === 0 || isPending) return;
    createRoom(selected.map((user) => user.id));
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="chevron-back" size={28} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>새 채팅</Text>
          <TouchableOpacity
            disabled={selected.length === 0 || isPending}
            onPress={startChat}
            style={[
              styles.startButton,
              selected.length === 0 && styles.startButtonDisabled,
            ]}
          >
            <Text style={styles.startButtonText}>
              {selected.length > 1 ? "그룹 시작" : "시작"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.subText} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            autoFocus
            placeholder="이름 또는 학번"
            placeholderTextColor={colors.subText}
            style={styles.searchInput}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={18} color={colors.subText} />
            </TouchableOpacity>
          )}
        </View>

        {selected.length > 0 && (
          <View style={styles.selectedWrap}>
            <FlatList
              horizontal
              data={selected}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.selectedList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => toggleUser(item)}
                  style={styles.selectedChip}
                >
                  <Text style={styles.selectedChipText}>{item.name}</Text>
                  <Ionicons name="close" size={14} color={colors.accentBlue} />
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons
                name={query.trim() ? "person-outline" : "search-outline"}
                size={30}
                color={colors.subText}
              />
              <Text style={styles.emptyTitle}>
                {query.trim()
                  ? isFetching
                    ? "검색 중입니다"
                    : "검색 결과가 없습니다"
                  : "학생 이름이나 학번으로 검색하세요"}
              </Text>
              <Text style={styles.emptyDesc}>
                재학생과 선생님만 결과에 표시됩니다
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <UserRow
              user={item}
              selected={selected.some((target) => target.id === item.id)}
              onPress={() => toggleUser(item)}
            />
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function UserRow({
  user,
  selected,
  onPress,
}: {
  user: ChatUser;
  selected: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.userRow,
        selected && styles.userRowSelected,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.userAvatar}>
        <Text style={styles.userAvatarText}>{user.name.slice(0, 1)}</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userMeta}>
          {user.role === "teacher" ? "선생님" : "재학생"} · {user.studentNumberMasked}
        </Text>
      </View>
      <Ionicons
        name={selected ? "checkmark-circle" : "ellipse-outline"}
        size={22}
        color={selected ? colors.accentBlue : colors.subText}
      />
    </Pressable>
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
      paddingHorizontal: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    iconButton: {
      width: 42,
      height: 42,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      flex: 1,
      color: colors.text,
      fontSize: 18,
      fontWeight: "900",
    },
    startButton: {
      height: 34,
      borderRadius: 17,
      paddingHorizontal: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.accentBlue,
    },
    startButtonDisabled: {
      opacity: 0.35,
    },
    startButtonText: {
      color: "#ffffff",
      fontSize: 13,
      fontWeight: "900",
    },
    searchBox: {
      margin: 16,
      height: 44,
      borderRadius: 14,
      paddingHorizontal: 13,
      backgroundColor: colors.cardBg2,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    searchInput: {
      flex: 1,
      color: colors.text,
      fontSize: 15,
      fontWeight: "700",
      padding: 0,
    },
    selectedWrap: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    selectedList: {
      paddingHorizontal: 16,
      paddingBottom: 12,
      gap: 8,
    },
    selectedChip: {
      height: 32,
      borderRadius: 16,
      paddingHorizontal: 11,
      backgroundColor: colors.accentBlueAlpha,
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    selectedChipText: {
      color: colors.accentBlue,
      fontSize: 13,
      fontWeight: "900",
    },
    userRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 18,
      paddingVertical: 13,
      gap: 12,
    },
    userRowSelected: {
      backgroundColor: colors.accentBlueAlpha,
    },
    pressed: {
      opacity: 0.7,
    },
    userAvatar: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.cardBg2,
    },
    userAvatarText: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "900",
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "900",
    },
    userMeta: {
      marginTop: 4,
      color: colors.subText,
      fontSize: 12,
      fontWeight: "700",
    },
    emptyWrap: {
      alignItems: "center",
      paddingTop: 110,
      paddingHorizontal: 24,
    },
    emptyTitle: {
      marginTop: 12,
      color: colors.text,
      fontSize: 15,
      fontWeight: "900",
      textAlign: "center",
    },
    emptyDesc: {
      marginTop: 7,
      color: colors.subText,
      fontSize: 12,
      fontWeight: "600",
      textAlign: "center",
    },
  });
