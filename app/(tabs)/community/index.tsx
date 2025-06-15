import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FABPlus from "../../../src/components/Button/FABPlus";
import Header from "../../../src/components/Header/Header";
import { View, Text, Switch, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  getCurrentNotificaionSettings,
  postUpdateNotificationSetting,
} from "../../../apis/user/notification";
import { useUser } from "../../../context/UserContext";
import { useRouter, useLocalSearchParams } from "expo-router";

// 임시 컴포넌트
const CommunityList = ({ boardData }: { boardData: any }) => (
  <View style={{ padding: 20 }}>
    <Text>커뮤니티 리스트</Text>
  </View>
);

export default function CommunityInnerListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // URL params에서 boardData 파싱 (실제 구현에서는 boardId만 전달하고 API로 데이터 가져오는 것이 좋음)
  const boardData = params.boardData
    ? JSON.parse(params.boardData as string)
    : null;

  const { user } = useUser();
  const accessAllowed =
    user && boardData ? boardData.role.includes(user.type) : false;

  useEffect(() => {
    if (boardData && !accessAllowed) {
      router.replace(
        `/access-denied?boardData=${encodeURIComponent(
          JSON.stringify(boardData)
        )}`
      );
    }
  }, [router, accessAllowed, boardData]);

  if (accessAllowed && boardData) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <Header
          title=""
          backArrowText={boardData.name + " 게시판"}
          rightComponent={<RightNotificationSwitch boardData={boardData} />}
        />
        <FABPlus
          onPress={() => {
            router.push(
              `/community/post?boardData=${encodeURIComponent(
                JSON.stringify(boardData)
              )}`
            );
          }}
        />
        <CommunityList boardData={boardData} />
      </SafeAreaView>
    );
  }
  return null;
}

interface RightNotificationSwitchProps {
  boardData: {
    _id: string;
  };
}

function RightNotificationSwitch({ boardData }: RightNotificationSwitchProps) {
  const { colors } = useTheme();
  const { data } = useQuery(
    "NotificationSetting",
    getCurrentNotificaionSettings
  );
  const { mutate } = useMutation(postUpdateNotificationSetting);
  const queryClient = useQueryClient();
  const isSubscribe = Array.isArray(data)
    ? data.includes(boardData._id)
    : false;

  const styles = StyleSheet.create({
    container: { flexDirection: "row", alignItems: "center", marginRight: 10 },
    text: { fontSize: 12, color: (colors as any).subText },
    switch: { transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>알림</Text>
      <Switch
        style={styles.switch}
        value={isSubscribe}
        onValueChange={(_value) => {
          mutate(
            { category: boardData._id, isRegister: _value },
            {
              onSuccess: () => {
                queryClient.invalidateQueries("NotificationSetting");
              },
            }
          );
        }}
        trackColor={{ true: (colors as any).blue, false: undefined }}
      />
    </View>
  );
}
